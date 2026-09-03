import React, { useState, useEffect } from 'react';
import { fetchIbasData, mockEvidences, getEvidences, calculatePilarScore, getObligations, saveObligations, logAction, getActionLogs, getSystemUsers, saveSystemUsers, defaultPilarObligations, addEvidenceToCache, updateEvidenceInCache, removeEvidenceFromCache, generateAcreditationScore } from '../api/mockData';
import AddProjectModal from './AddProjectModal';
import AddEvidenceModal from './AddEvidenceModal';
import EvidenceDetailsModal from './EvidenceDetailsModal';
import FeedbackModal from './FeedbackModal';
import UsersManagement from './UsersManagement';
import ProfilePanel from './ProfilePanel';
import SystemUsersAndLogs from './SystemUsersAndLogs';
import ProjectIcon from './ProjectIcon';
import RolesManagement from './RolesManagement';
import { 
  BarChart3, FolderGit2, Users, FileText, ChevronLeft, ChevronRight, Search, Menu, X,
  Filter, Download, Plus, ShieldCheck, ShieldAlert, CheckCircle, 
  ExternalLink, Info, Globe, AlertCircle, Shield, User, CloudUpload, Leaf, Link as LinkIcon, Eye, Trash2, Pencil, Lock, Activity, LogOut
, DownloadCloud} from 'lucide-react';

export default function AdminPanel() {
  const currentUser = JSON.parse(sessionStorage.getItem('b4_user') || '{}');
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'Super Admin';
  const [projetos, setProjetos] = useState([]);

  const handleLogout = () => {
    sessionStorage.removeItem('b4_admin_auth');
    sessionStorage.removeItem('b4_user');
    window.location.reload();
  };
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [activeView, setActiveView] = useState('projetos');
  const [pilarSelecionado, setPilarSelecionado] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  

  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [evidenciasLocal, setEvidenciasLocal] = useState(() => getEvidences());

  const setAndSaveEvidences = (newEvs) => {
    // If it's a function (like prev => ...), evaluate it first
    const evaluated = typeof newEvs === 'function' ? newEvs(evidenciasLocal) : newEvs;
    setEvidenciasLocal(evaluated);
  };

  const [activePilarTab, setActivePilarTab] = useState('Evidências');
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [editingEvidence, setEditingEvidence] = useState(null);
  const [isEvidenceDetailsOpen, setIsEvidenceDetailsOpen] = useState(false);

  const [feedbackState, setFeedbackState] = useState({ isOpen: false, idToDelete: null });
  const [editingObligation, setEditingObligation] = useState(null); // { id, nome, desc }

  const handleDeleteEvidence = (id) => {
    setFeedbackState({ isOpen: true, idToDelete: id });
  };

  const confirmDelete = () => {
    if (feedbackState.idToDelete) {
      setAndSaveEvidences(prev => prev.filter(e => e.id !== feedbackState.idToDelete));
      removeEvidenceFromCache(feedbackState.idToDelete);
      supabase.from('evidences').delete().eq('id', feedbackState.idToDelete).then(() => {});
      logAction(currentUser?.email || 'N/A', 'Exclusão de Evidência', projetoSelecionado?.nome || 'N/A', `Excluiu evidência ID: ${feedbackState.idToDelete}`);
      const newScore = generateAcreditationScore(0, projetoSelecionado.id);
      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));
      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));
    }
    setFeedbackState({ isOpen: false, idToDelete: null });
    setIsEvidenceDetailsOpen(false);
  };

  const cancelDelete = () => {
    setFeedbackState({ isOpen: false, idToDelete: null });
  };

  const handleExport = () => {
    const headers = ['Nome,Tipo,Fonte,Status,Validado Em,Usuario,Observacoes'];
    const rows = evidenciasLocal.map(ev =>
      `"${ev.name || ''}","${ev.type || ''}","${ev.source || ''}","${ev.status || ''}","${ev.date || ''}","${ev.user || ''}","${(ev.observacoes || '').replace(/\n/g, ' ')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `evidencias_pilar_${pilarSelecionado?.num}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvidencias = evidenciasLocal.filter(ev =>
    ev.projetoId === projetoSelecionado?.id &&
    ev.pilarNum === pilarSelecionado?.num &&
    (!filterText ||
    (ev.name && ev.name.toLowerCase().includes(filterText.toLowerCase())) ||
    (ev.type && ev.type.toLowerCase().includes(filterText.toLowerCase())) ||
    (ev.source && ev.source.toLowerCase().includes(filterText.toLowerCase())) ||
    (ev.status && ev.status.toLowerCase().includes(filterText.toLowerCase())))
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchIbasData();
      let ativos = data.ativos;
      if (currentUser.projects && currentUser.role !== 'Super Admin' && currentUser.role !== 'admin') {
        ativos = ativos.filter(p => currentUser.projects.includes(p.id) || p.id.startsWith('custom_'));
      }
      setProjetos(ativos);
      setEvidenciasLocal(getEvidences());
      if (ativos.length > 0) {
        setProjetoSelecionado(ativos[0]);
      }
    };
    loadData();

    const handleUserUpdate = () => {
      try {
        const updatedUser = JSON.parse(sessionStorage.getItem('b4_user'));
        if (updatedUser) {
          setCurrentUser(updatedUser);
          window.location.reload(); // Simplest way to re-filter everything
        }
      } catch(e) {}
    };
    window.addEventListener('b4_user_updated', handleUserUpdate);
    return () => window.removeEventListener('b4_user_updated', handleUserUpdate);
  }, []);

  const pilaresList = [
    { num: 1, title: 'Impacto Socioambiental' },
    { num: 2, title: 'Compromisso do Originador' },
    { num: 3, title: 'Governança e Conformidade' },
    { num: 4, title: 'Adicionalidade' },
    { num: 5, title: 'Integridade Documental e Fundiária' },
    { num: 6, title: 'Auditoria e Certificação' },
    { num: 7, title: 'Rastreabilidade Blockchain' },
    { num: 8, title: 'Transparência Financeira' },
    { num: 9, title: 'Reputação e Relacionamento Institucional' },
    { num: 10, title: 'Rating de Integridade Climática', max: 50 },
    { num: 11, title: 'Capacidade Operacional', max: 50 },
  ];

  const handleSaveEvidence = (newEv) => {
    if (editingEvidence) {
      const updatedEv = {
        ...editingEvidence,
        ...newEv,
        date: new Date().toLocaleDateString('pt-BR'),
        user: `${currentUser.email} (Editado)`
      };
      setAndSaveEvidences(prev => prev.map(e => e.id === editingEvidence.id ? updatedEv : e));
      updateEvidenceInCache(updatedEv);
      const newScore = generateAcreditationScore(0, projetoSelecionado.id);
      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));
      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));
      
      supabase.from('evidences').update({
        name: updatedEv.name,
        type: updatedEv.type,
        source: updatedEv.source,
        status: updatedEv.status,
        link_url: updatedEv.linkUrl,
        file_url: updatedEv.fileUrl,
        date: updatedEv.date,
        validated_by: updatedEv.user
      }).eq('id', updatedEv.id).then(() => {});
      
      // We don't want the old replace to match, so we comment out what it replaced:
      
      setEditingEvidence(null);
      setIsAddEvidenceModalOpen(false);
      logAction(currentUser.email, 'Edição de Evidência', projetoSelecionado.nome, `Editou evidência: ${newEv.name}`);
    } else {
      const today = new Date().toLocaleDateString('pt-BR');
      const ev = {
        id: Math.random().toString(),
        ...newEv,
        projetoId: projetoSelecionado.id,
        pilarNum: pilarSelecionado.num,
        date: today,
        user: currentUser.email
      };
      setAndSaveEvidences([ev, ...evidenciasLocal]);
      addEvidenceToCache(ev);
      const newScore = generateAcreditationScore(0, projetoSelecionado.id);
      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));
      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));
      supabase.from('evidences').insert({
        id: ev.id,
        projeto_id: ev.projetoId,
        pilar_num: ev.pilarNum,
        name: ev.name,
        type: ev.type,
        source: ev.source,
        status: ev.status,
        link_url: ev.linkUrl,
        file_url: ev.fileUrl,
        date: ev.date,
        validated_by: ev.user
      }).then(() => {});
      logAction(currentUser.email, 'Nova Evidência', projetoSelecionado.nome, `Adicionou evidência: ${newEv.name}`);
    }
  };

  const handleSaveProject = (newProject) => {
    const proj = {
      id: Math.random().toString(),
      nome: newProject.nome,
      categoria: newProject.categoria,
      preco: parseFloat(newProject.preco) || 0,
      volume: newProject.volume,
      status: newProject.status,
      metodologia: newProject.metodologia || 'B4 Padrão',
      verificacao: newProject.auditor || 'Não Auditado',
      score: 0,
      acreditacao: {
        total: 0, nivel: 'Não Avaliado', stars: '',
        detalhes: { p1:0, p2:0, p3:0, p4:0, p5:0, p6:0, p7:0, p8:0, p9:0, p10:0, p11:0 }
      },
      links: {
        whitepaper: newProject.linkWhitepaper,
        documento: newProject.linkCertificado,
        polygonscan: newProject.enderecoContrato ? `https://polygonscan.com/token/${newProject.enderecoContrato}` : '#'
      }
    };
    const newList = [proj, ...projetos];
    setProjetos(newList);
    setProjetoSelecionado(proj);
    
    try {
      const saved = localStorage.getItem('b4_custom_projects');
      let custom = saved ? JSON.parse(saved) : [];
      custom.push(proj);
      localStorage.setItem('b4_custom_projects', JSON.stringify(custom));
    } catch(e) {}
  };

  if (!projetoSelecionado) return <div className="p-8 text-center text-slate-500">Carregando Admin...</div>;

  const Sidebar = () => (
    <div className="h-full bg-[#150B2D] text-white flex flex-col border-r border-[#2A1B4E]">
      <div className={`border-b border-[#2A1B4E] ${isSidebarCollapsed ? 'p-4' : 'p-6'}`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} mb-6`}>
          <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'hidden' : ''}`}>
            <img src="https://bolsa.b4.capital/assets/images/logo_white.png" alt="B4" className="h-8 object-contain" />
          </div>
          
          <div className={`flex items-center justify-center ${!isSidebarCollapsed ? 'hidden' : ''}`}>
            <img src="https://bolsa.b4.capital/assets/images/logo_white.png" alt="B4" className="h-6 w-6 object-contain object-left" />
          </div>
          
          <div className="flex items-center gap-2">
            {!isSidebarCollapsed && (
              <button className="hidden md:block text-slate-400 hover:text-white" onClick={() => setIsSidebarCollapsed(true)} title="Recolher Menu">
                <ChevronLeft size={20} />
              </button>
            )}
            {isSidebarCollapsed && (
              <button className="hidden md:block text-slate-400 hover:text-white mx-auto" onClick={() => setIsSidebarCollapsed(false)} title="Expandir Menu">
                <ChevronRight size={20} />
              </button>
            )}
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
        <p className={`text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>Projetos de Sustentabilidade</p>
        <div className={`relative ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input type="text" placeholder="Buscar projeto..." className="w-full pl-10 pr-4 py-2 bg-[#1F123C] border border-[#3A2566] rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto space-y-2 overflow-x-hidden custom-scrollbar ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
        {projetos.map(proj => (
          <div
            key={proj.id}
            onClick={() => { setProjetoSelecionado(proj); setPilarSelecionado(null); setActiveView('projetos'); setSidebarOpen(false); }}
            className={`rounded-xl cursor-pointer transition-colors border ${projetoSelecionado?.id === proj.id ? 'bg-[#2E1A55] border-[#5B21B6]' : 'border-transparent hover:bg-[#1F123C]'} ${isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <ProjectIcon project={proj} className={`w-10 h-10 rounded-lg ${projetoSelecionado?.id === proj.id ? 'bg-[#7C2DFF]' : 'bg-[#2A1B4E]'}`} />
              <div className={`flex-1 overflow-hidden ${isSidebarCollapsed ? 'hidden' : ''}`}>
                <p className="text-sm font-bold truncate">{proj.nome}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{proj.categoria}</p>
              </div>
              <ChevronRight size={16} className={`${projetoSelecionado.id === proj.id ? 'text-white' : 'text-slate-600'} ${isSidebarCollapsed ? 'hidden' : ''}`} />
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t border-[#2A1B4E] space-y-3 flex flex-col items-center justify-center ${isSidebarCollapsed ? 'p-4' : 'p-6'}`}>
        <button onClick={() => { setIsAddModalOpen(true); setSidebarOpen(false); }} className={`bg-[#7C2DFF] hover:bg-purple-600 border border-[#7C2DFF] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
          <Plus size={14} /> {!isSidebarCollapsed && "Adicionar Novo Projeto"}
        </button>
        <button onClick={() => { setActiveView('kyc'); setSidebarOpen(false); }} className={`hover:bg-[#2A1B4E] border border-[#3A2566] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${activeView === 'kyc' ? 'bg-[#7C2DFF] border-purple-500' : 'bg-[#1F123C]'} ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
          <Users size={14} /> {!isSidebarCollapsed && "Equipe B4 (Gestores)"}
        </button>
        <button onClick={() => { setActiveView('profile'); setSidebarOpen(false); }} className={`hover:bg-[#2A1B4E] border border-[#3A2566] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${activeView === 'profile' ? 'bg-[#7C2DFF] border-purple-500' : 'bg-[#1F123C]'} ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
          <User size={14} /> {!isSidebarCollapsed && "Meu Perfil (Dados / KYC)"}
        </button>
        {currentUser.role === 'admin' && (
          <button onClick={() => { setActiveView('system'); setSidebarOpen(false); }} className={`hover:bg-[#2A1B4E] border border-[#3A2566] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${activeView === 'system' ? 'bg-[#7C2DFF] border-purple-500' : 'bg-[#1F123C]'} ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
            <Activity size={14} /> {!isSidebarCollapsed && "Usuários e Logs"}
          </button>
        )}
        <button onClick={() => { setActiveView('roles'); setSidebarOpen(false); }} className={`hover:bg-[#2A1B4E] border border-[#3A2566] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${activeView === 'roles' ? 'bg-[#7C2DFF] border-purple-500' : 'bg-[#1F123C]'} ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
          <Shield size={14} /> {!isSidebarCollapsed && "Gestão de Perfis"}
        </button>
        <button onClick={handleLogout} className={`mt-2 hover:bg-red-900/50 border border-red-900/30 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2'}`}>
          <LogOut size={14} /> {!isSidebarCollapsed && "Sair do Sistema"}
        </button>
      </div>
    </div>
  );

  const currentObligations = projetoSelecionado && pilarSelecionado ? getObligations(projetoSelecionado.id, pilarSelecionado.num) : [];
  const totalObligationsCount = currentObligations.length;
  const validatedEvidencesCount = filteredEvidencias.filter(e => e.status === 'Validada').length;
  const compliancePercentage = totalObligationsCount > 0 ? Math.min(100, Math.round((validatedEvidencesCount / totalObligationsCount) * 100)) : 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Desktop */}
      <div className={`hidden md:flex shrink-0 h-full transition-all duration-300 ${isSidebarCollapsed ? "w-[88px]" : "w-80"}`}>
        <div className="w-full h-full">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 z-50 md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      {activeView === 'system' ? <SystemUsersAndLogs projetos={projetos} /> : activeView === 'kyc' ? <UsersManagement projetos={projetos} /> : activeView === 'roles' ? <RolesManagement /> : activeView === 'profile' ? <ProfilePanel /> : (
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 shrink-0 text-slate-900 flex justify-between items-center">
          

          <div className="flex items-center justify-between gap-4">
            {/* Mobile hamburger */}
            <button className="md:hidden text-slate-600 hover:text-purple-600 p-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>

            {/* Project info - scrollable on mobile */}
            <div className="flex items-center gap-3 md:gap-8 overflow-x-auto flex-1 min-w-0 scrollbar-hide">
              <div className="shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Projeto selecionado</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm md:text-lg font-black text-[#150B2D] truncate max-w-[120px] md:max-w-none">{projetoSelecionado.nome.replace('Projeto ', '')}</h1>
                  <span className="hidden sm:flex bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {projetoSelecionado.status}
                  </span>
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-slate-200 shrink-0"></div>
              <div className="hidden sm:block shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Nicho</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Leaf size={14} className="text-emerald-500"/> {projetoSelecionado.categoria}</p>
              </div>
              <div className="hidden md:block shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">TCO₂e Total</p>
                <p className="text-sm font-bold text-slate-800">{projetoSelecionado.volume} tCO₂e</p>
              </div>
              <div className="hidden lg:block shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Score B4</p>
                <div className="flex items-baseline gap-1">
                  
<span className="text-lg font-black text-[#7C2DFF]">
  {[1,2,3,4,5,6,7,8,9,10,11].reduce((acc, num) => acc + calculatePilarScore(projetoSelecionado.id, num, num > 9 ? 50 : 100), 0)}
</span>

                  <span className="text-[10px] font-bold text-slate-400">/ 1000 pts</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <span className="text-emerald-500 text-xs font-bold uppercase flex items-center gap-1">IBAS <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">AO VIVO</span></span>
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Admin</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

          {/* Pilares List */}
          <div className={`overflow-y-auto p-4 md:p-8 custom-scrollbar transition-all duration-300 ${pilarSelecionado ? 'hidden md:block md:w-1/2 border-r border-slate-200' : 'w-full'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#150B2D]">Pilares de Acreditação B4</h2>
                <p className="text-sm text-slate-500">11 pilares que compõem o Score de Integridade Climática B4</p>
              </div>
              {!pilarSelecionado && (
                <a href="https://b4.capital/pt/alem-do-credito-de-carbono-a-construcao-do-pib-verde-por-meio-do-ibas-indice-b4-de-ativos-sustentaveis/" target="_blank" rel="noreferrer" className="border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-50 shrink-0 text-slate-900">
                  Entenda o Padrão de Acreditação B4 <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div className="space-y-3">
              {(() => {
                let userPillars = [1,2,3,4,5,6,7,8,9,10,11];
                try {
                  const stored = localStorage.getItem('b4_allowed_pillars');
                  if (stored && stored !== 'undefined') userPillars = JSON.parse(stored) || userPillars;
                } catch(e) {}
                return pilaresList.filter(p => userPillars.includes(p.num)).map((p) => {
                  const max = p.max || 100;
                  const score = calculatePilarScore(projetoSelecionado.id, p.num, p.max);
                  const isSelected = pilarSelecionado?.num === p.num;
                  return (
                    <div
                      key={p.num}
                      onClick={() => { setPilarSelecionado(p); setActivePilarTab('Evidências'); }}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-purple-50 border-purple-300 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          {p.num}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`font-bold text-sm md:text-base truncate ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>{p.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400">Peso: {max} pts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:gap-6 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-base md:text-lg font-black text-[#150B2D]">{score} <span className="text-xs font-bold text-slate-400">/ {max}</span></p>
                          <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> {score === 0 ? '' : 'Excelente'}</p>
                        </div>
                        <ChevronRight size={20} className={isSelected ? 'text-purple-600' : 'text-slate-300'} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Right Panel - Pilar Details */}
          {pilarSelecionado && (
            <div className="flex-1 md:w-1/2 overflow-y-auto bg-slate-50 custom-scrollbar text-slate-900">
              <div className="p-4 md:p-8">

                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                  <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h2 className="text-base md:text-xl font-bold text-[#150B2D]">Pilar {pilarSelecionado.num} — {pilarSelecionado.title}</h2>
                      <p className="text-[10px] font-bold text-slate-400">Peso máximo: {pilarSelecionado.max || 100} pts</p>
                    </div>
                  </div>
                  <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-500">{calculatePilarScore(projetoSelecionado.id, pilarSelecionado.num, pilarSelecionado.max)} <span className="text-xs font-bold text-slate-400">/ {pilarSelecionado.max || 100} pts</span></p>
                      <p className="text-[10px] font-bold text-emerald-500">&nbsp;</p>
                    </div>
                    <button onClick={() => setPilarSelecionado(null)} className="md:hidden text-slate-400 hover:text-red-500 bg-white border border-slate-200 p-2 rounded-lg text-slate-900">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-slate-200 mb-6 mt-4 overflow-x-auto custom-scrollbar">
                  {['Evidências', 'Obrigações', 'Observações', 'Guia'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActivePilarTab(tab)}
                      className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${activePilarTab === tab ? 'border-purple-600 text-purple-900 font-bold' : 'border-transparent text-slate-400 hover:text-slate-600 font-medium'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activePilarTab === 'Evidências' && (
                  <>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 mb-6">
                      <div className="text-blue-500 shrink-0"><ShieldAlert size={20} /></div>
                      <p className="text-sm text-blue-900">
                        As evidências abaixo alimentam o cálculo deste pilar.<br/>
                        <span className="text-blue-700">A pontuação é calculada automaticamente com base nos critérios do Padrão B4.</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                      <button onClick={() => { setEditingEvidence(null); setIsAddEvidenceModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2">
                        <Plus size={16} /> Adicionar evidência
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setShowFilter(!showFilter)} className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 flex-1 sm:flex-none justify-center text-slate-900">
                          <Filter size={14} /> Filtrar
                        </button>
                        <button onClick={handleExport} className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 flex-1 sm:flex-none justify-center text-slate-900">
                          <Download size={14} /> Exportar
                        </button>
                      </div>
                    </div>

                    {showFilter && (
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Buscar por nome, tipo, fonte ou status..."
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none"
                        />
                      </div>
                    )}

                    {/* Tabela de Evidencias */}
                    {/* Container with relative positioning for scroll hint */}
                    <div className="relative mb-8">
                      {/* Hint for mobile scroll */}
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent pointer-events-none md:hidden flex items-center justify-end pr-1 text-slate-400 z-10">
                        <ChevronRight size={16} className="opacity-50 animate-pulse" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto text-slate-900">
                      <table className="w-full text-left min-w-[800px] lg:min-w-full">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-4 min-w-[250px] lg:w-[40%]">Evidência</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4">Fonte</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Validado Em</th>
                            <th className="p-4">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvidencias.map((ev, i) => (
                            <tr key={i} onClick={() => { setSelectedEvidence(ev); setIsEvidenceDetailsOpen(true); }} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group text-slate-900">
                              <td className="p-4">
                                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                    ev.type === 'Documento' ? 'bg-orange-50 text-orange-500' :
                                    ev.type === 'Link' ? 'bg-purple-50 text-purple-500' :
                                    ev.type === 'API' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                                  }`}>
                                    {ev.type === 'Documento' && <FileText size={16} />}
                                    {ev.type === 'Link' && <LinkIcon size={16} />}
                                    {ev.type === 'API' && <CloudUpload size={16} />}
                                    {ev.type === 'Blockchain' && <ShieldAlert size={16} />}
                                    {!['Documento', 'Link', 'API', 'Blockchain'].includes(ev.type) && <FileText size={16} />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5 break-words whitespace-normal" title={ev.name}>{ev.name}</p>
                                    <p className="text-[10px] text-slate-500">{ev.desc}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4"><span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{ev.type}</span></td>
                              <td className="p-4 text-[10px] text-slate-600">{ev.source}</td>
                              <td className="p-4">
                                <span className={`text-[10px] font-bold flex items-center gap-1 ${ev.status === 'Validada' ? 'text-emerald-600' : ev.status === 'Rejeitada' ? 'text-red-600' : 'text-amber-600'}`}>
                                  <CheckCircle size={10} /> {ev.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <p className="text-[10px] font-bold text-slate-700">{ev.date || new Date().toLocaleDateString('pt-BR')}</p>
                                <p className="text-[10px] text-slate-400">{ev.user || 'Sistema'}</p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                  {(isAdmin || ev.user?.includes(currentUser.email)) && (<button onClick={(e) => { e.stopPropagation(); setEditingEvidence(ev); setIsAddEvidenceModalOpen(true); }} className="text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Editar">
                                    <Pencil size={14} />
                                  </button>)}
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedEvidence(ev); setIsEvidenceDetailsOpen(true); }} className="text-slate-400 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 p-1.5 rounded transition-colors" title="Ver detalhes">
                                    <Eye size={14} />
                                  </button>
                                  {(isAdmin || ev.user?.includes(currentUser.email)) && (<button onClick={(e) => { e.stopPropagation(); handleDeleteEvidence(ev.id); }} className="text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 p-1.5 rounded transition-colors" title="Excluir">
                                    <Trash2 size={14} />
                                  </button>)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="p-3 text-[10px] text-slate-500 text-center">
                        Mostrando 1 a {filteredEvidencias.length} de {filteredEvidencias.length} evidências
                      </div>
                    </div>
                    </div>
                  </>
                )}

                {activePilarTab === 'Obrigações' && (
                  <div className="space-y-4 mb-8 text-slate-900">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-sm mb-2">Itens Obrigatórios deste Pilar</h3>
                      <p className="text-xs text-slate-500 mb-4">A pontuação (score) máxima deste pilar é dividida igualmente pela quantidade de itens abaixo. Ao adicionar mais obrigações, o peso de cada evidência validada é recalculado dinamicamente.</p>
                      
                      <div className="space-y-2 mb-4">
                        {getObligations(projetoSelecionado.id, pilarSelecionado.num).map(ob => (
                          <div key={ob.id}>
                            {editingObligation?.id === ob.id ? (
                              // Inline edit form
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const current = getObligations(projetoSelecionado.id, pilarSelecionado.num);
                                const updated = current.map(o => o.id === ob.id ? { ...o, nome: e.target.nome.value, desc: e.target.desc.value } : o);
                                saveObligations(projetoSelecionado.id, pilarSelecionado.num, updated);
                                setEditingObligation(null);
                                setPilarSelecionado({...pilarSelecionado});
                              }} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex flex-col sm:flex-row gap-2">
                                <input
                                  required
                                  name="nome"
                                  defaultValue={ob.nome}
                                  type="text"
                                  placeholder="Nome da Obrigação"
                                  className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                                />
                                <input
                                  name="desc"
                                  defaultValue={ob.desc}
                                  type="text"
                                  placeholder="Descrição"
                                  className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500"
                                />
                                <div className="flex gap-2">
                                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-1">
                                    <CheckCircle size={14}/> Salvar
                                  </button>
                                  <button type="button" onClick={() => setEditingObligation(null)} className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-3 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                                    <X size={14}/>
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                                <div>
                                  <p className="font-bold text-sm text-slate-800">{ob.nome}</p>
                                  <p className="text-xs text-slate-500">{ob.desc}</p>
                                </div>
                                <div className="flex gap-1 shrink-0 ml-2">
                                  {isAdmin ? (
                                    <>
                                      <button onClick={() => setEditingObligation(ob)} className="text-slate-400 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 p-1.5 rounded transition-colors" title="Editar">
                                        <Pencil size={14} />
                                      </button>
                                      <button onClick={() => {
                                        const current = getObligations(projetoSelecionado.id, pilarSelecionado.num);
                                        const updated = current.filter(o => o.id !== ob.id);
                                        saveObligations(projetoSelecionado.id, pilarSelecionado.num, updated);
                                        setPilarSelecionado({...pilarSelecionado});
                                      }} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-1.5 rounded transition-colors" title="Excluir">
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="text-slate-300 p-1.5" title="Apenas administradores podem alterar obrigações">
                                      <Lock size={14} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {getObligations(projetoSelecionado.id, pilarSelecionado.num).length === 0 && (
                           <p className="text-xs text-slate-400 italic">Nenhuma obrigação cadastrada.</p>
                        )}
                      </div>

                      {isAdmin && <div className="border-t border-slate-200 pt-4 mt-2">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const current = getObligations(projetoSelecionado.id, pilarSelecionado.num);
                          const newOb = {
                            id: Math.random().toString(),
                            nome: e.target.nome.value,
                            desc: e.target.desc.value
                          };
                          saveObligations(projetoSelecionado.id, pilarSelecionado.num, [...current, newOb]);
                          logAction(currentUser.email, 'Nova Obrigação', projetoSelecionado.nome, `Adicionou obrigação: ${newOb.nome}`);
                          e.target.reset();
                          // Force re-render
                          setPilarSelecionado({...pilarSelecionado});
                        }} className="flex flex-col sm:flex-row gap-2">
                          <input required name="nome" type="text" placeholder="Nome da Obrigação" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500" />
                          <input required name="desc" type="text" placeholder="Descrição" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500" />
                          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1">
                            <Plus size={14}/> Adicionar
                          </button>
                        </form>
                      </div>}
                    </div>
                  </div>
                )}

                {activePilarTab === 'Observações' && (
                  <div className="space-y-4 mb-8">
                    {filteredEvidencias.filter(e => e.observacoes).length === 0 ? (
                      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-900">
                        <p className="text-sm text-slate-500">Nenhuma observação registrada para este pilar.</p>
                      </div>
                    ) : (
                      filteredEvidencias.filter(e => e.observacoes).map((ev, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-900">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{ev.name}</h4>
                              <p className="text-xs text-slate-500">{ev.date || new Date().toLocaleDateString('pt-BR')} • por {ev.user || 'Gestor'}</p>
                            </div>
                            <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-[10px] font-bold">Observação</span>
                          </div>
                          <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">{ev.observacoes}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activePilarTab === 'Guia' && (
                  <div className="space-y-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-900">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">Guia de Preenchimento</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Documentação exigida e recomendada para comprovação deste pilar:
                    </p>
                    <div className="space-y-4 mt-4">
                      {defaultPilarObligations[pilarSelecionado.num]?.map((req, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-1">
                            <FileText size={14} className="text-purple-500" />
                            {req.nome}
                          </h4>
                          <p className="text-xs text-slate-600 pl-5">{req.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pilarSelecionado?.num === 7 && projetoSelecionado?.photo && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-xl border border-purple-100 text-slate-900">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-purple-600" /> Acesso ao Crédito de Carbono
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative rounded-xl overflow-hidden shadow-lg shrink-0 w-full sm:w-48 h-48 bg-slate-200">
                        <img
                          src={projetoSelecionado.photo}
                          alt={`NFT ${projetoSelecionado.nome}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display='none'; }}
                        />
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LISTADO</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm mb-1">{projetoSelecionado.nome}</p>
                        <p className="text-[11px] text-slate-500 mb-3">Registro do Acesso ao Crédito de Carbono em Rede Pública Blockchain.</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                          <div className="bg-white rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-[10px] uppercase font-medium mb-0.5">Volume</p>
                            <p className="font-bold text-slate-800">{projetoSelecionado.volume} tCO₂e</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-[10px] uppercase font-medium mb-0.5">Emissão</p>
                            <p className="font-bold text-slate-800">{projetoSelecionado.dataListagem}</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-[10px] uppercase font-medium mb-0.5">Rede</p>
                            <p className="font-bold text-slate-800">Polygon</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-[10px] uppercase font-medium mb-0.5">Padrão</p>
                            <p className="font-bold text-slate-800">ERC-721</p>
                          </div>
                        </div>
                        <a
                          href={projetoSelecionado.links?.polygonscan}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-purple-600 font-bold text-[11px] hover:underline"
                        >
                          Ver no Polygonscan <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumo box */}
                <div className="bg-gradient-to-r from-[#150B2D] to-[#2A1B4E] border border-purple-500/30 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row items-start justify-between gap-6 text-white mt-6">
                  <div className="flex-1 max-w-xl">
                    <h4 className="font-bold text-lg mb-2">Resumo da pontuação deste pilar</h4>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                      O score é calculado automaticamente com base nas evidências validadas em relação aos documentos obrigatórios.
                    </p>
                    <a href="https://b4.capital/pt/como-funciona-o-score-de-projetos-da-b4-o-novo-padrao-de-acreditacao-e-precificacao-de-ativos-sustentaveis-do-brasil/" target="_blank" rel="noreferrer" className="text-purple-400 text-xs font-bold hover:text-purple-300 transition-colors flex items-center gap-1 w-fit bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                      Ver critérios e metodologia <ExternalLink size={12}/>
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto min-w-[220px]">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-[11px] font-bold text-purple-300 uppercase m-0 mr-4">Evidências Válidas</p>
                      <p className="text-2xl font-black text-white">{validatedEvidencesCount}<span className="text-base text-slate-400">/{totalObligationsCount}</span></p>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-[11px] font-bold text-purple-300 uppercase m-0 mr-4">Critérios Atendidos</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-black text-emerald-400">{compliancePercentage}%</p>
                        <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${compliancePercentage}, 100`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {isAddModalOpen && (
        <AddProjectModal onClose={() => setIsAddModalOpen(false)} onSave={handleSaveProject} />
      )}
      {isAddEvidenceModalOpen && (
        <AddEvidenceModal
          onClose={() => { setIsAddEvidenceModalOpen(false); setEditingEvidence(null); }}
          onSave={handleSaveEvidence}
          pilarSelecionado={pilarSelecionado}
          initialData={editingEvidence}
        />
      )}
      {isEvidenceDetailsOpen && selectedEvidence && (
        <EvidenceDetailsModal
          evidence={selectedEvidence}
          onClose={() => { setIsEvidenceDetailsOpen(false); setSelectedEvidence(null); }}
          onDelete={handleDeleteEvidence}
        />
      )}
      {feedbackState.isOpen && (
        <FeedbackModal
          isOpen={true}
          title="Excluir Evidência"
          message="Tem certeza que deseja excluir esta evidência? Esta ação não pode ser desfeita."
          type="error"
          onConfirm={confirmDelete}
          onCancel={() => setFeedbackState({ isOpen: false, idToDelete: null })}
        />
      )}
    </div>
  );
}
