import React, { useState, useEffect, useMemo } from 'react';
import { fetchIbasData, getLastScoreUpdate, registerDailyIbasIndex, getIbasHistory } from '../api/mockData';
import ProjectIcon, { hasProjectLogo } from './ProjectIcon';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowUpRight, ArrowDownRight, Globe, DollarSign, 
  ChevronRight, Filter, Download, Star, StarHalf, ExternalLink, Leaf,
  ChevronLeft, ChevronRight as IconChevronRight
} from 'lucide-react';

import { useLanguage } from "../context/LanguageContext";

const renderDynamicStars = (score, size = 8) => {
  const starValue = Math.min(5, Math.max(0, score / 200));
  const fullStars = Math.floor(starValue);
  const hasHalfStar = (starValue - fullStars) >= 0.25 && (starValue - fullStars) < 0.75;
  const extraFull = (starValue - fullStars) >= 0.75 ? 1 : 0;
  
  const finalFull = fullStars + extraFull;
  const finalHalf = hasHalfStar ? 1 : 0;
  const emptyStars = 5 - finalFull - finalHalf;
  
  const stars = [];
  let key = 0;
  
  for(let i = 0; i < finalFull; i++) {
    stars.push(<Star key={key++} size={size} fill="currentColor" />);
  }
  if (finalHalf) {
    stars.push(<StarHalf key={key++} size={size} fill="currentColor" />);
  }
  for(let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={key++} size={size} className="text-slate-300" />);
  }
  
  return stars;
};

export default function Dashboard() {
  const { t, language, toggleLanguage } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // States para filtros e buscas
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos os Tipos');
  const [sortBy, setSortBy] = useState('score_desc');

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchIbasData();
        setData(result);
        if (result.ativos && result.ativos.length > 0) {
          setSelectedAsset(result.ativos[0]);
        }
        
        const hist = await getIbasHistory();
        if (hist && hist.length > 0) {
          setHistoryList(hist);
        }
      } catch (err) {
        console.error("Error loading Dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Atualiza o PTAX automaticamente a cada 30 minutos
    // O BCB publica a cotação do dia por volta das 13h — assim ela aparece sem precisar de F5
    const ptaxInterval = setInterval(async () => {
      try {
        for (let daysBack = 0; daysBack <= 5; daysBack++) {
          const d = new Date();
          d.setDate(d.getDate() - daysBack);
          if (d.getDay() === 0 || d.getDay() === 6) continue;
          const fmt = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
          const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${fmt}'&$top=1&$format=json`);
          const json = await res.json();
          if (json && json.value && json.value.length > 0) {
            const newPtax = json.value[json.value.length - 1].cotacaoVenda;
            setData(prev => prev ? { ...prev, ptax: newPtax } : prev);
            break;
          }
        }
      } catch (e) {}
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(ptaxInterval);
  }, []);

  // Lógica {t('dashboard.of')} Filtro e Ordenação
  const filteredAndSortedAssets = useMemo(() => {
    if (!data || !data.ativos) return [];
    let processed = [...data.ativos];

    // Busca por texto
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      processed = processed.filter(a => 
        a.nome.toLowerCase().includes(lowerSearch) || 
        a.categoria.toLowerCase().includes(lowerSearch)
      );
    }

    // Filtro por Categoria
    if (categoryFilter !== 'Todos os Tipos') {
      processed = processed.filter(a => a.categoria === categoryFilter);
    }

    // Ordenação
    processed.sort((a, b) => {
      if (sortBy === 'impacto_desc') return b.impacto - a.impacto;
      if (sortBy === 'impacto_asc') return a.impacto - b.impacto;
      if (sortBy === 'score_desc') return b.score - a.score;
      if (sortBy === 'score_asc') return a.score - b.score;
      if (sortBy === 'nome_asc') return a.nome.localeCompare(b.nome);
      return 0;
    });

    return processed;
  }, [data, searchTerm, categoryFilter, sortBy]);

  const currentIbas = useMemo(() => {
    if (!data || !data.ativos || data.ativos.length === 0) return 0;
    
    // Fórmula Real do IBAS Global: Σ (Score * Peso) / Fator Normalização
    // Apenas ativos "Listados" compõem o índice, e a pesquisa na tabela NÃO deve afetar o gráfico/índice
    const listedAssets = data.ativos.filter(a => ['Listado', 'Listed', 'Custodiado', 'Custodied'].includes(a.status));
    
    const weightedSum = listedAssets.reduce((acc, a) => acc + ((a.score || 0) * (a.peso || 0)), 0);
    const fator = data.fatorNormalizacao || 1.67;
    
    return weightedSum / fator;
  }, [data, language]);

  const [historyData, setHistoryData] = useState({ max24h: 0, min24h: 0, max30d: 0, min30d: 0, variation: 0 });
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if (currentIbas > 0) {
      const history = historyList;
      const today = new Date().toLocaleDateString('pt-BR');
      
      const todayEntry = history.find(h => h.date === today);
      const max24h = todayEntry ? todayEntry.max : currentIbas;
      const min24h = todayEntry ? todayEntry.min : currentIbas;

      let max30d = 0;
      let min30d = 0;
      let variation = 0;
      
      if (history.length > 1) {
        const last30 = history.slice(-30);
        min30d = 9999;
        last30.forEach(h => {
          if (h.max > max30d) max30d = h.max;
          if (h.min < min30d && h.min > 0) min30d = h.min;
        });
        if (min30d === 9999) min30d = 0;

        const pastEntries = history.filter(h => h.date !== today);
        if (pastEntries.length > 0) {
          const lastClose = pastEntries[pastEntries.length - 1].close;
          if (lastClose > 0) {
            variation = ((currentIbas - lastClose) / lastClose) * 100;
          }
        }
      }

      setHistoryData({ max24h, min24h, max30d, min30d, variation });
    }
  }, [currentIbas, historyList]);

  // Função para exportar CSV
  const handleExportCSV = () => {
    if (!filteredAndSortedAssets.length) return;
    
    // Cabeçalhos
    const headers = ['ID', 'Ativo', 'Categoria', 'Score B4', 'Peso (%)', 'Impacto', 'Variação (%)', 'Preço ($)', 'Volume', 'Metodologia', 'Data Listagem'];
    
    // Linhas
    const rows = filteredAndSortedAssets.map(a => [
      a.id,
      `"${a.nome}"`, // Aspas para não quebrar com vírgulas no nome
      a.categoria,
      a.score,
      (a.peso * 100).toFixed(2),
      a.impacto.toFixed(2),
      a.variacao,
      a.preco.toFixed(2),
      `"${a.volume}"`,
      `"${a.metodologia}"`,
      a.dataListagem
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `B4_IBAS_Ativos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAsset = (ativo) => {
    setSelectedAsset(ativo);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('asset-details-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  // Lógica do Gráfico Real
  const [timeFilter, setTimeFilter] = useState('1S');
  
  const getChartData = () => {
    if (!historyList || !Array.isArray(historyList) || historyList.length === 0) {
      return [];
    }

    const formatData = (dataSlice) => {
      if (!Array.isArray(dataSlice)) return [];
      return dataSlice.map(h => ({
        time: h && h.date ? h.date.substring(0, 5) : '00/00',
        pts: h ? h.close : 0
      }));
    };

    try {
      switch (timeFilter) {
        case '1D': 
          const todayPts = historyList.length > 0 ? historyList[historyList.length - 1].close : 0;
          return [
            { time: '08:00', pts: todayPts },
            { time: '10:00', pts: todayPts },
            { time: '12:00', pts: todayPts },
            { time: '14:00', pts: todayPts },
            { time: '16:00', pts: todayPts },
            { time: '18:00', pts: todayPts }
          ];
        case '1S':
          return formatData(historyList.slice(-7));
        case '1M': 
          return formatData(historyList.slice(-30));
        case '3M': 
          return formatData(historyList.slice(-90));
        case '6M': 
          return formatData(historyList.slice(-180));
        default: 
          return formatData(historyList.slice(-7));
      }
    } catch(e) {
      console.error("Error formatting chart data", e);
      return [];
    }
  };
  const chartData = getChartData();

  // Pega as categorias únicas para o select
  const uniqueCategories = useMemo(() => {
    if (!data || !data.ativos) return [];
    const cats = new Set(data.ativos.map(a => a.categoria));
    return ['Todos os Tipos', ...Array.from(cats)];
  }, [data]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Carregando IBAS...</div>;
  }

  return (
    <div className="w-full px-3 md:px-4 lg:px-6 xl:px-8 py-4 animate-fade-in-up min-h-screen lg:min-h-0 lg:h-[calc(100vh-73px)] lg:overflow-hidden flex flex-col">
      {/* Top Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 shrink-0">
        
        {/* Main IBAS Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  IBAS
                </span>
                <span className="text-emerald-500 text-[10px] font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {t('dashboard.live')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleLanguage('pt')} 
                  className={`w-6 h-4 rounded overflow-hidden shadow-sm transition-transform hover:scale-110 ${language === 'pt' ? 'ring-2 ring-emerald-500 ring-offset-1' : 'opacity-50 grayscale'}`}
                  title="Português"
                >
                  <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-full h-full object-cover" />
                </button>
                <button 
                  onClick={() => toggleLanguage('en')} 
                  className={`w-6 h-4 rounded overflow-hidden shadow-sm transition-transform hover:scale-110 ${language === 'en' ? 'ring-2 ring-emerald-500 ring-offset-1' : 'opacity-50 grayscale'}`}
                  title="English"
                >
                  <img src="https://flagcdn.com/w40/us.png" alt="USA/English" className="w-full h-full object-cover" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-extrabold text-[#150B2D] leading-none">{t('dashboard.indexTitle')}</h2>
                <div className="flex items-baseline gap-2 mt-1">
                  {/* Cálculo dinâmico do {t('dashboard.indexTitle')} */}
                  <span className="text-4xl font-black text-[#7C2DFF] leading-none">
                    {currentIbas.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})}
                  </span>
                  <span className="text-lg font-bold text-slate-400">pts</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${historyData.variation >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {historyData.variation >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
                  {Math.abs(historyData.variation).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4 pt-3 border-t border-slate-100">
            <div><p className="text-[10px] text-slate-500">{t('dashboard.max24h')}</p><p className="font-bold text-slate-800 text-sm">{historyData.max24h.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</p></div>
            <div><p className="text-[10px] text-slate-500">{t('dashboard.min24h')}</p><p className="font-bold text-slate-800 text-sm">{historyData.min24h.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</p></div>
            <div><p className="text-[10px] text-slate-500">{t('dashboard.max30d')}</p><p className="font-bold text-slate-800 text-sm">{historyData.max30d.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</p></div>
            <div><p className="text-[10px] text-slate-500">{t('dashboard.min30d')}</p><p className="font-bold text-slate-800 text-sm">{historyData.min30d.toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})}</p></div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 z-10 mb-1">
              {['1D', '1S', '1M', '3M', '6M'].map(time => (
                <span 
                  key={time}
                  onClick={() => setTimeFilter(time)}
                  className={`cursor-pointer transition-colors px-2 py-0.5 rounded ${timeFilter === time ? 'text-purple-600 bg-purple-50' : 'hover:text-purple-500'}`}
                >
                  {time}
                </span>
              ))}
            </div>
            
            <div className="relative flex-grow h-full w-full mt-2 min-h-[80px]">
              {chartData.length < 2 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50 border border-purple-100/50 rounded-2xl">
                  <span className="text-purple-500/80 font-bold text-[11px] tracking-wide uppercase px-4 text-center">
                    {t('dashboard.waitingData')}
                  </span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C2DFF" stopOpacity="0.3"/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', padding: '4px 8px' }}
                      itemStyle={{ color: '#150B2D', fontWeight: 'bold', fontSize: '11px' }}
                      labelStyle={{ color: '#64748B', fontSize: '10px' }}
                      formatter={(value) => [`${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 4, maximumFractionDigits: 4})} pts`, 'IBAS']}
                    />
                    <XAxis dataKey="time" hide />
                    <Area type="monotone" dataKey="pts" stroke="#7C2DFF" strokeWidth={2} fillOpacity={1} fill="url(#colorPts)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
        </div>

        {/* Info Cards */}
        <div className="lg:col-span-1 flex flex-col gap-3 min-h-[180px]">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-100 flex items-center justify-center bg-slate-50">
                <img src="./b4trii.png" alt="B4TRII" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t("dashboard.price")}</p>
                <p className="text-lg font-black text-[#150B2D] leading-none mt-1">R$ {data.ptax.toFixed(4).replace('.', ',')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t("dashboard.normalization")}</p>
                <p className="text-lg font-black text-[#150B2D] leading-none mt-1">{data.fatorNormalizacao.toFixed(2).replace('.', ',')}x</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow min-h-0">
        
        {/* Left: Table */}
        <div className="lg:col-span-8 flex flex-col min-h-0">

          <div className="flex flex-col mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-lg md:text-2xl font-bold text-slate-800">{t('dashboard.composition')}</h3>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full shrink-0">{data.ativos.length} {language === 'en' ? 'ASSETS' : 'ATIVOS'}</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">{t('dashboard.sustainableAssetsIndex')}</span>
            </div>
            <div className="flex flex-col sm:hidden mt-2 border-l-2 border-purple-400 pl-2">
              <span className="text-sm font-bold text-slate-700">{t('dashboard.sustainableAssetsIndex')}</span>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Selecione o Ativo Sustentável abaixo para Análise completa
              </p>
            </div>
          </div>

          {/* Funcionalidade {t('dashboard.of')} Filtros e Busca */}
          <div className="flex flex-wrap gap-3 mb-4 shrink-0">
            <div className="relative flex-grow min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder')} 
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" 
              />
            </div>
            <div className="relative w-full sm:w-40">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs appearance-none text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'Todos os Tipos' ? t('dashboard.allTypes') : (cat === 'Floresta' ? t('common.forest') : cat)}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <div className="relative w-40">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs appearance-none text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="impacto_desc">{language === 'en' ? 'Highest Impact' : 'Maior Impacto'}</option>
                <option value="impacto_asc">{language === 'en' ? 'Lowest Impact' : 'Menor Impacto'}</option>
                <option value="score_desc">{language === 'en' ? 'Highest Score' : 'Maior Score'}</option>
                <option value="score_asc">{language === 'en' ? 'Lowest Score' : 'Menor Score'}</option>
                <option value="nome_asc">A-Z</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold text-xs transition-colors shadow-sm shrink-0"
            >
              <Download size={14} /> Excel
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[500px] lg:min-h-0 lg:h-full">
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-grow">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{t('dashboard.asset')}</th>
                    <th className="py-3 px-4">{t('dashboard.category')}</th>
                    <th className="py-3 px-4">VOLUME <span className="normal-case">(tCO₂e)</span></th>
                    <th className="py-3 px-4">Score B4</th>
                    <th className="py-3 px-4">{t('dashboard.weight')}</th>
                    <th className="py-3 px-4">{t('dashboard.impact')}</th>
                    <th className="py-3 px-4">{t('dashboard.variation')}</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredAndSortedAssets.length > 0 ? (
                      filteredAndSortedAssets.map((ativo, index) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                          key={ativo.id} 
                          className={`border-b border-slate-50 cursor-pointer transition-all ${selectedAsset?.id === ativo.id ? 'bg-purple-50/80 border-l-4 border-l-purple-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                          onClick={() => handleSelectAsset(ativo)}
                        >
                          <td className="py-2.5 px-4 text-xs text-slate-500 font-medium">{index + 1}</td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <ProjectIcon project={ativo} className={`w-7 h-7 rounded shrink-0 transition-colors ${hasProjectLogo(ativo.nome) ? 'bg-transparent' : (selectedAsset?.id === ativo.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600')}`} />
                              <span className={`font-bold text-xs whitespace-nowrap transition-colors ${selectedAsset?.id === ativo.id ? 'text-purple-900' : 'text-slate-800'}`} title={ativo.nome}>{language === "en" ? ativo.nome.replace("Projeto ", "Project ") : ativo.nome}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 w-max ${ativo.categoria === 'Floresta' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                              {ativo.categoria === 'Floresta' && <Leaf size={10} />} {ativo.categoria === 'Floresta' ? t('common.forest') : (ativo.categoria.startsWith('PSA') ? 'PSA' : ativo.categoria)}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-xs text-slate-600 whitespace-nowrap">
                            {ativo.id === '0x7466eb42b5b165d8b133a7040870b2da6c060546' ? '–' : ativo.volume}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex flex-col">
                              <span className={`font-bold text-xs ${ativo.acreditacao?.colorClass || "text-slate-800"}`}>{ativo.score}</span>
                              <div className="flex text-purple-500 text-[8px]">
                                {renderDynamicStars(ativo.score, 8)}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-800 text-xs">{((ativo.peso || 0) * 100).toFixed(2)}%</span>
                              <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${ativo.peso * 100}%` }}
                                  transition={{ duration: 1, delay: 0.5 + (index * 0.05) }}
                                  className="h-full bg-[#7C2DFF]"
                                ></motion.div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-emerald-500 text-xs whitespace-nowrap">{(ativo.impacto || 0).toFixed(2).replace('.', ',')} pts</td>
                          <td className="py-2.5 px-4">
                            <span className={`text-xs font-semibold flex items-center ${(ativo.variacao || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {(ativo.variacao || 0) >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                              {Math.abs(ativo.variacao || 0).toFixed(2).replace('.', ',')}%
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center justify-center min-w-[70px] ${ativo.status === 'Listado' || ativo.status === 'Listed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                              {language === 'en' ? (ativo.status === 'Listado' ? 'Listed' : ativo.status === 'Custodiado' ? 'Custodied' : ativo.status === 'Em Avaliação' ? 'Under Review' : ativo.status) : ativo.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <button className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${selectedAsset?.id === ativo.id ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'border border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-300'}`}>
                              <IconChevronRight size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan="10" className="text-center py-8 text-slate-500 text-xs font-medium">Nenhum ativo encontrado para os filtros selecionados.</td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            <div className="p-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 bg-slate-50 shrink-0">
              <span>{t('dashboard.showing')} {filteredAndSortedAssets.length} {t('dashboard.of')} {data.ativos.length} {t('dashboard.assets')}</span>
              <div className="flex gap-1 items-center">
                <button className="p-1 hover:text-slate-800"><ChevronLeft size={14}/></button>
                <button className="w-5 h-5 rounded bg-purple-100 text-purple-700 font-bold flex items-center justify-center">1</button>
                <button className="p-1 hover:text-slate-800"><IconChevronRight size={14}/></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Side Panel */}
        {selectedAsset && (
          <div className="lg:col-span-4 min-h-0 h-full scroll-mt-28" id="asset-details-section">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedAsset.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col h-full min-h-0"
                >
                  <div className="flex justify-between items-start mb-4 shrink-0">
                    <div className="flex gap-4 items-center min-w-0">
                      <ProjectIcon project={selectedAsset} className={`w-12 h-12 md:w-14 md:h-14 rounded-xl text-white ${hasProjectLogo(selectedAsset?.nome) ? 'bg-transparent shadow-none' : 'bg-[#7C2DFF] shadow-lg shadow-purple-500/30'}`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[#150B2D] text-lg md:text-xl leading-tight break-words">{language === "en" ? selectedAsset.nome.replace("Projeto ", "Project ") : selectedAsset.nome}</h3>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-2 py-0.5 rounded uppercase mt-1.5 inline-flex items-center gap-1">
                          <Leaf size={12} /> {selectedAsset.categoria === 'Floresta' ? t('common.forest') : selectedAsset.categoria}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tab section removed to simplify UI */}

                  <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 mt-4">
                    {/* Grid 2x2 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:border-purple-200 transition-colors">
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Score B4</p>
                        <p className={`text-xl font-black ${selectedAsset.acreditacao?.colorClass || "text-[#150B2D]"}`}>{selectedAsset.score}</p>
                        <div className="flex text-purple-500 text-[10px] mt-1">
                          {renderDynamicStars(selectedAsset.score, 10)}
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 relative overflow-hidden hover:border-purple-200 transition-colors">
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">{t('dashboard.weightIbas')}</p>
                        <p className="text-xl font-black text-[#150B2D]">{((selectedAsset.peso || 0) * 100).toFixed(2)}%</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:border-emerald-200 transition-colors">
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">{t('dashboard.impact')} (pts)</p>
                        <p className="text-xl font-black text-emerald-500">{(selectedAsset.impacto || 0).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 hover:border-emerald-200 transition-colors">
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">{t('dashboard.variation')} ({language === 'pt' ? 'mês' : 'month'})</p>
                        <p className={`text-lg font-black flex items-center gap-1 mt-0.5 ${(selectedAsset.variacao || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {(selectedAsset.variacao || 0) >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                          {Math.abs(selectedAsset.variacao || 0).toFixed(2).replace('.', ',')}%
                        </p>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-2.5 mb-4">
                      {[
                        { label: t('dashboard.totalVolume'), value: `${selectedAsset.volume} tCO₂e`, pill: 'slate', hideIf: selectedAsset.id === '0x7466eb42b5b165d8b133a7040870b2da6c060546' },
                        { label: t('dashboard.status'), value: language === 'en' ? (selectedAsset.status === 'Listado' ? t('common.listed') : selectedAsset.status === 'Custodiado' ? 'Custodied' : selectedAsset.status === 'Em Avaliação' ? 'Under Review' : selectedAsset.status) : selectedAsset.status, pill: 'emerald' },
                        { label: t('projectDetails.methodology'), value: selectedAsset.metodologia, pill: 'slate' },
                        { label: t('dashboard.lastValidation'), value: getLastScoreUpdate(selectedAsset.id, (selectedAsset.ultimaAtualizacao || new Date().toLocaleDateString('pt-BR')).split(' ')[0]), pill: 'purple' },
                        { label: 'Blockchain', value: 'Polygon', pill: 'slate' },
                      ].filter(i => !i.hideIf).map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-[11px] border-b border-slate-100 pb-2 gap-3">
                          <span className="text-slate-500 font-medium shrink-0 pt-0.5">{item.label}</span>
                          <span className={`font-bold text-right break-words ${item.pill === 'emerald' ? 'text-emerald-600' : item.pill === 'purple' ? 'text-purple-700' : 'text-slate-800'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 shrink-0 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => navigate(`/projeto/${selectedAsset.id}`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 text-sm"
                    >
                      {t('dashboard.analyzeProject')} <ExternalLink size={14} />
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
