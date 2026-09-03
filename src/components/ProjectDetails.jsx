import React, { useState, useEffect } from 'react';
import { useLanguage } from "../context/LanguageContext";
import { useParams, Link } from 'react-router-dom';
import { fetchIbasData, calculatePilarScore, getEvidences } from '../api/mockData';
import { 
  ArrowLeft, Copy, ExternalLink, Leaf, ShieldCheck, 
  Settings, Link as LinkIcon, Download, Star, StarHalf, Activity, PlusCircle, CheckCircle, Info, Lock, ArrowUpRight, Globe, FileText
} from 'lucide-react';
import PillarModal from './PillarModal';
import BlockchainModal from './BlockchainModal';
import DocumentsModal from './DocumentsModal';
import ProjectIcon, { hasProjectLogo } from './ProjectIcon';

const DollarSignIcon = () => (
  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);


const getPublicPageUrl = (nome) => {
  if (!nome) return "#";
  const n = nome.toLowerCase();
  if (n.includes('bf terra')) return "https://b4.capital/pt/projeto-bfterraiii/";
  if (n.includes('arace iba')) return "https://b4.capital/pt/projeto-especial-arace-iba/";
  if (n.includes('apoena kaa')) return "https://b4.capital/pt/projeto-especial-apoena-kaa/";
  if (n.includes('owie')) return "https://b4.capital/pt/projeto-owie-bitioni/";
  if (n.includes('dowedi')) return "https://b4.capital/pt/projeto-dowedi-mitir/";
  return "#";
};


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

export default function ProjectDetails() {
  const { t, language } = useLanguage();

  const translateIntegrity = (label) => {
    if (language !== 'en') return label;
    if (label === 'Não Avaliado') return 'Not Evaluated';
    if (label === 'Integridade de Excelência') return 'Excellence Integrity';
    if (label === 'Integridade Excelente') return 'Excellent Integrity';
    if (label === 'Integridade Avançada') return 'Advanced Integrity';
    if (label === 'Integridade Muito Alta') return 'Very High Integrity';
    if (label === 'Integridade Alta') return t('projectDetails.integrity.high') || 'High Integrity';
    if (label === 'Integridade Moderada') return 'Moderate Integrity';
    if (label === 'Integridade Média') return t('projectDetails.integrity.medium') || 'Medium Integrity';
    if (label === 'Integridade Baixa') return t('projectDetails.integrity.low') || 'Low Integrity';
    if (label === 'Integridade Muito Baixa') return t('projectDetails.integrity.veryLow') || 'Very Low Integrity';
    return label;
  };

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [projeto, setProjeto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchIbasData();
      setData(result);
      const found = result.ativos.find(a => a.id === id);
      if (found) setProjeto(found);
    };
    loadData();
  }, [id]);

  const openPillar = (pillarNum, title) => {
    setSelectedPillar({ num: pillarNum, title: title, score: calculatePilarScore(projeto.id, pillarNum) });
    setIsModalOpen(true);
  };

  if (!projeto) return <div className="p-8 text-center text-slate-500">Carregando detalhes do projeto...</div>;

  const pilaresList = [
    { num: 1, icon: <Leaf className="text-emerald-500" />, title: 'Impacto Socioambiental' },
    { num: 2, icon: <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310B981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'%3E%3C/path%3E%3C/svg%3E" className="w-6 h-6" />, title: 'Compromisso do Originador' },
    { num: 3, icon: <ShieldCheck className="text-emerald-500" />, title: 'Governança e Conformidade' },
    { num: 4, icon: <PlusCircle className="text-emerald-500" />, title: 'Adicionalidade' },
    { num: 5, icon: <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>, title: 'Integridade Documental e Fundiária' },
    { num: 6, icon: <CheckCircle className="text-emerald-500" />, title: 'Auditoria e Certificação' },
    { num: 7, icon: <LinkIcon className="text-emerald-500" />, title: 'Rastreabilidade Blockchain' },
    { num: 8, icon: <DollarSignIcon />, title: 'Transparência Financeira' },
    { num: 9, icon: <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>, title: 'Reputação e Relacionamento' },
    { num: 10, icon: <Star className="text-purple-500" />, title: 'Rating de Integridade', max: 50 },
    { num: 11, icon: <Settings className="text-purple-500" />, title: 'Capacidade Operacional', max: 50 },
  ];

  return (
    <div className="w-full px-4 md:px-6 xl:px-8 py-6 animate-fade-in-up min-h-[calc(100vh-73px)]">
      <Link to="/" className="inline-flex items-center gap-2 text-purple-600 font-bold mb-6 hover:text-purple-800 transition-colors text-sm">
        <ArrowLeft size={18} /> {t('projectDetails.backToIndex')}
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8">
        
        {/* Left Column - Card do Ativo */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-40 bg-slate-200 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Forest" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                {language === 'en' ? (projeto.status === 'Listado' ? 'Listed' : projeto.status === 'Custodiado' ? 'Custodied' : projeto.status === 'Em Avaliação' ? 'Under Review' : projeto.status) : projeto.status}
              </div>
              <div className="absolute bottom-4 left-4">
                <ProjectIcon project={projeto} className={`w-12 h-12 rounded-xl text-white mb-2 ${hasProjectLogo(projeto.nome) ? 'bg-transparent shadow-none' : 'bg-[#7C2DFF] shadow-lg'}`} imgClassName="scale-125 drop-shadow-lg" />
                <p className="text-white/80 text-xs font-semibold">{language === 'en' ? 'Project' : 'Projeto'}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-bold text-xl leading-tight">{projeto.nome.replace('Projeto ', '')}</h2>
                  <span className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {projeto.categoria}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
            <h3 className="font-bold text-slate-800 mb-4">{t('projectDetails.generalInfo')}</h3>
            <div className="space-y-2.5">
              {[
                { label: t('projectDetails.niche'), value: projeto.categoria },
                { label: t('projectDetails.originator'), value: projeto.originador || 'B4' },
                { label: t('projectDetails.methodology'), value: projeto.metodologia },
                { label: t('projectDetails.validationCert'), value: projeto.verificacao },
                { label: t('projectDetails.emission'), value: projeto.dataListagem },
                { label: t('projectDetails.totalCredits'), value: `${projeto.volume} tCO₂e`, hideIf: projeto.id === '0x7466eb42b5b165d8b133a7040870b2da6c060546' },
                { label: t('projectDetails.location') || 'Localização', value: projeto.localizacao || 'Brasil' },
                { label: t('projectDetails.statusB4') || 'Status na B4', value: language === 'en' ? (projeto.status === 'Listado' ? 'Listed' : projeto.status === 'Custodiado' ? 'Custodied' : projeto.status === 'Em Avaliação' ? 'Under Review' : projeto.status) : projeto.status, emerald: true },
              ].filter(i => !i.hideIf).map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.label}</span>
                  <span className={`text-xs font-bold leading-snug ${item.emerald ? 'text-emerald-500' : 'text-slate-800'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <a href={getPublicPageUrl(projeto.nome)} target="_blank" rel="noreferrer" className="w-full bg-white border border-purple-200 text-purple-600 font-bold py-3 mt-5 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 text-sm">
              {t('projectDetails.publicPage')} <ExternalLink size={16} />
            </a>
          </div>
          </div>
        </div>

        {/* Central Column - Pilares */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-[#150B2D]">{t('projectDetails.accreditationStandard')} <Info size={16} className="inline text-slate-400" /></h2>
              <a href="https://b4.capital/pt/alem-do-credito-de-carbono-a-construcao-do-pib-verde-por-meio-do-ibas-indice-b4-de-ativos-sustentaveis/" target="_blank" rel="noreferrer" className="border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-50 shrink-0">
                {t('projectDetails.understandStandard')} <ExternalLink size={14} />
              </a>
            </div>
            <p className="text-slate-500 text-sm mb-6">{t('projectDetails.evaluationBasedOn')}</p>
            
            {/* Score Summary - mobile: 2 cols, desktop: 3 cols */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 pb-6 border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.totalScore")}</p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-2xl md:text-3xl font-black text-[#7C2DFF]">{projeto.score}</span>
                  <span className="text-sm md:text-lg font-bold text-slate-400">/ 1000 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 mb-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{width: `${(projeto.score/1000)*100}%`}}></div>
                </div>
                <p className={`${projeto.acreditacao.colorClass || "text-purple-600"} text-xs font-bold`}>{translateIntegrity(projeto.acreditacao.nivel)}</p>
                <div className={`${projeto.acreditacao.colorClass || "text-purple-500"} text-xs mt-1 font-black tracking-widest`}>{projeto.acreditacao.stars}</div>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.impactIbas")}</p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-2xl md:text-3xl font-black text-[#150B2D]">{(projeto.impacto || 0).toFixed(2).replace('.', ',')}</span>
                  <span className="text-sm md:text-lg font-bold text-slate-400">pts</span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-3">{((projeto.peso || 0)*100).toFixed(2)}% {t('projectDetails.weightIndex')}</p>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("projectDetails.totalCredits")}</p>
                <span className="text-2xl md:text-3xl font-black text-[#150B2D]">{projeto.volume}</span>
                <p className="text-slate-500 text-xs font-medium mt-3">{t('projectDetails.volumeTotal')}</p>
              </div>
            </div>

            {/* Pillar legend */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 gap-3">
              <h3 className="text-lg md:text-xl font-bold text-[#150B2D]">{t('projectDetails.accreditationPillars')}</h3>
              <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t('projectDetails.status.excellent')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> {t('projectDetails.status.good')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> {t('projectDetails.status.attention')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> {t('projectDetails.status.critical')}</span>
              </div>
            </div>

            {/* Grid 11 Pilares */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
              {(() => {
                let userPillars = [1,2,3,4,5,6,7,8,9,10,11];
                try {
                  const stored = localStorage.getItem('b4_allowed_pillars');
                  if (stored && stored !== 'undefined') userPillars = JSON.parse(stored) || userPillars;
                } catch(e) {}
                return pilaresList.filter(p => userPillars.includes(p.num)).map((p) => {
                  const max = p.max || 100;
                  const score = calculatePilarScore(projeto.id, p.num, p.max);
                  const percent = (score / max) * 100;
                  let colorClass = 'bg-emerald-500';
                  if(percent < 90) colorClass = 'bg-blue-500';
                  if(percent < 70) colorClass = 'bg-amber-500';
                  if(percent < 50) colorClass = 'bg-red-500';
                  if(p.num >= 10) colorClass = 'bg-purple-500';

                  return (
                    <div key={p.num} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col hover:border-purple-300 transition-colors cursor-pointer group active:scale-95" onClick={() => openPillar(p.num, p.title)}>
                      <div className="flex items-start gap-2 mb-3">
                        <div className="shrink-0">{p.icon}</div>
                        <span className="text-lg font-black text-slate-800">{p.num}</span>
                      </div>
                      <h4 className="font-bold text-slate-700 text-xs md:text-sm leading-tight flex-grow mb-3">{t(`pillars.${p.title}`)}</h4>
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className={`text-lg font-black ${p.num >= 10 ? 'text-purple-600' : 'text-emerald-500'}`}>{score}</span>
                          <span className="text-xs font-bold text-slate-400">/{max}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                          <div className={`h-full ${colorClass}`} style={{width: `${percent}%`}}></div>
                        </div>
                        <span className="text-purple-600 text-xs font-bold flex items-center gap-1 group-hover:text-purple-800">
                          {t('projectDetails.seeDetails')} <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Score B4</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#7C2DFF]">{projeto.score}</span>
              <span className="text-lg font-bold text-slate-400">/ 1000 pts</span>
            </div>
            <div className="flex text-purple-500 text-sm mt-2 mb-2">
              {renderDynamicStars(projeto.acreditacao?.score || 0, 16)}
            </div>
            <p className={`${projeto.acreditacao.colorClass || "text-emerald-500"} font-bold text-sm`}>{translateIntegrity(projeto.acreditacao.nivel)}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">{t('projectDetails.linksAndDocs')}</h3>
            <div className="space-y-3">
              {(() => {
                let docs = [];
                const isBf = projeto.nome.includes('BF Terra');
                try {
                  docs = getEvidences().filter(e => e.projetoId === projeto.id && e.status === 'Validada');
                } catch(e) {}
                
                if (docs.length === 0) {
                  return (
                    <>
                      <a href={isBf ? "https://b4.capital/pt/consulta-publica/#projeto/bft" : projeto.links?.documento || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 group border border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><FileText size={14} /></div>
                          <span className="text-xs font-semibold text-slate-700 break-words whitespace-normal leading-tight">{isBf ? t('projectDetails.certAccess') : t('projectDetails.creditCert')}</span>
                        </div>
                        <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0 ml-2" />
                      </a>
                      <a href={isBf ? "https://b4.capital/pt/consulta-publica/#projeto/bftII" : projeto.links?.whitepaper || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 group border border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><FileText size={14} /></div>
                          <span className="text-xs font-semibold text-slate-700 break-words whitespace-normal leading-tight">{isBf ? t("projectDetails.certAccess2") : t("projectDetails.whitepaper")}</span>
                        </div>
                        <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0 ml-2" />
                      </a>
                      <a href={isBf ? "https://polygonscan.com/token/0x9f727a1350b11f6c0855ddf718ae8bc058a5342e#transactions" : projeto.links?.polygonscan || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 group border border-slate-100">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Globe size={14}/></div>
                          <span className="text-xs font-semibold text-slate-700 break-words whitespace-normal leading-tight">{isBf ? t("projectDetails.tokenBft") : t("projectDetails.blockExplorer")}</span>
                        </div>
                        <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0 ml-2" />
                      </a>
                    </>
                  );
                }

                return docs.slice(0, 4).map((doc, i) => {
                  let docName = doc.name || doc.nome || 'Documento';
                  if (docName === 'Utility Token') docName = 'Acesso ao Ativo Sustentável';
                  if (docName === 'Certificado do Crédito') docName = 'Certificado do Crédito de Carbono';
                  if (docName && docName.startsWith('Certificado do Crédito (')) docName = docName.replace('Certificado do Crédito', 'Certificado do Crédito de Carbono');
                  const docUrl = doc.linkUrl || doc.fileUrl || doc.link || doc.url || '#';
                  const docType = (doc.type || 'Link').toLowerCase();
                  
                  if (docType === 'redes sociais' || docName === 'Redes Sociais do Projeto') {
                    const pNum = doc.pilarNum || doc.pilar || 9;
                    const pName = pilaresList.find(p => p.num === pNum)?.title || 'Reputação e Relacionamento';
                    return (
                      <button key={i} onClick={() => openPillar(pNum, pName)} className="w-full text-left flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-purple-50 group border border-slate-100 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Globe size={14}/>
                          </div>
                          <span className="text-xs font-semibold text-purple-700 break-words whitespace-normal leading-tight flex flex-col">
                            <span>Redes Sociais do Projeto</span>
                          </span>
                        </div>
                        <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0 ml-2" />
                      </button>
                    );
                  }
                  
                  return (
                    <a key={i} href={docUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 group border border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          {docName.toLowerCase().includes('token') || docName.toLowerCase().includes('explorer') ? <Globe size={14}/> : <FileText size={14} />}
                        </div>
                        {(() => {
                          let main = docName;
                          let sub = '';
                          if (docName && typeof docName === 'string' && docName.includes(' (')) {
                            const p = docName.split(' (');
                            main = p[0];
                            sub = '(' + p[1];
                          }
                          const formatMain = (m) => {
                            if (m === 'Rastreabilidade do Plano Público') return <><span className="block">Rastreabilidade do</span><span className="block">Plano Público</span></>;
                            if (m === 'Certificado do Crédito de Carbono') return <><span className="block">Certificado do</span><span className="block">Crédito de Carbono</span></>;
                            return m;
                          };
                          return (
                            <span className="text-xs font-semibold text-slate-700 break-words whitespace-normal leading-tight flex flex-col">
                              <span>{formatMain(main)}</span>
                              {sub && <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{sub}</span>}
                            </span>
                          );
                        })()}
                      </div>
                      <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0 ml-2" />
                    </a>
                  );
                });
              })()}
            </div>
            <button onClick={() => setIsDocumentsModalOpen(true)} className="text-purple-600 text-xs font-bold mt-4 hover:underline">{t('projectDetails.seeAllDocs')} →</button>
          </div>

          
        </div>
      </div>
      
      {isModalOpen && selectedPillar && (
        <PillarModal 
          pillar={selectedPillar} 
          projetoId={projeto.id}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      {isBlockchainModalOpen && (
        <BlockchainModal onClose={() => setIsBlockchainModalOpen(false)} />
      )}
      {isDocumentsModalOpen && (
        <DocumentsModal onClose={() => setIsDocumentsModalOpen(false)} projeto={projeto} onOpenPillar={openPillar} />
      )}
    </div>
  );
}
