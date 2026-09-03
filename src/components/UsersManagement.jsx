import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, User, Eye, Edit, Trash2, X, Save, FileText } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

function UserModal({ initialData, onClose, onSave, projetos = [] }) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData ? { ...initialData, projects: initialData.projects || [] } : {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    role: 'Gestor Interno B4',
    status: 'Verificado',
    allowedPillars: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    projects: []
  });

  const togglePillar = (num) => {
    setFormData(prev => ({
      ...prev,
      allowedPillars: prev.allowedPillars.includes(num)
        ? prev.allowedPillars.filter(p => p !== num)
        : [...prev.allowedPillars, num].sort((a,b)=>a-b)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      let defaultPillars = [1,2,3,4,5,6,7,8,9,10,11];
      if (value === 'Gestor Interno B4') defaultPillars = [1,2,3,4,5,7,8];
      if (value === 'Comitê B4') defaultPillars = [1,11];
      if (value === 'Super Admin') defaultPillars = [1,2,3,4,5,6,7,8,9,10,11];
      setFormData(prev => ({ ...prev, role: value, allowedPillars: defaultPillars }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEdit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col animate-fade-in-up border border-slate-100 text-slate-900">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 rounded-t-3xl text-slate-900">
          <h2 className="text-xl font-bold text-[#150B2D]">{isEdit ? 'Editar Usuário' : 'Convidar Usuário (B4)'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
              <input required name="name" value={formData.name} onChange={handleChange} disabled={isEdit} className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none ${isEdit ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}` } />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Corporativo *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="@b4.capital" className="w-full px-4 py-2 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Documento (CPF)</label>
                <input name="cpf" value={formData.cpf} onChange={handleChange} disabled={isEdit} className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none ${isEdit ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}` } />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} disabled={isEdit} className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none ${isEdit ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}` } />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perfil B4</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none">
                <option value="Super Admin">Super Admin</option>
                <option value="Gestor Interno B4">Gestor Interno B4</option>
                <option value="Comitê B4">Membro do Comitê B4</option>
              </select>
            </div>
            
                                    <div className="pt-2 border-t border-slate-100 mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">Projetos Liberados</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.projects.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Nenhum projeto selecionado.</span>
                ) : (
                  formData.projects.map(pid => {
                    const pInfo = projetos.find(p => p.id === pid);
                    return (
                      <span key={pid} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-200">
                        {pInfo ? pInfo.nome : pid}
                        <button type="button" onClick={() => setFormData(prev => ({...prev, projects: prev.projects.filter(id => id !== pid)}))} className="text-purple-400 hover:text-purple-800 transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              <select 
                value="" 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && !formData.projects.includes(val)) {
                    setFormData(prev => ({ ...prev, projects: [...prev.projects, val] }));
                  }
                }} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-purple-500 outline-none cursor-pointer"
              >
                <option value="" disabled>+ Adicionar projeto à lista...</option>
                {projetos.filter(p => !formData.projects.includes(p.id)).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">Permissões (Acesso aos Pilares)</label>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6,7,8,9,10,11].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => togglePillar(num)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${formData.allowedPillars.includes(num) ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Clique nos números para habilitar ou desabilitar o acesso do usuário à inserção de evidências nesses pilares específicos.</p>
            </div>
          </form>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl text-slate-900">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200">Cancelar</button>
          <button form="add-user-form" type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
            <Save size={16} /> {isEdit ? "Salvar" : "Convidar"}
          </button>
        </div>
      </div>
    </div>
  );
}


function KycReviewModal({ user, onClose, onApprove }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col animate-fade-in-up border border-slate-100 text-slate-900">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 rounded-t-3xl text-slate-900">
          <h2 className="text-xl font-bold text-[#150B2D]">Revisão de Documentos (KYC)</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email} • CPF: {user.cpf}</p>
            </div>
          </div>
          
          <h3 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">Documentos Anexados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden group">
              <div className="bg-slate-100 p-2 text-xs font-bold text-slate-600 text-center border-b border-slate-200">
                Frente do Documento
              </div>
              <div className="h-40 bg-slate-200 flex items-center justify-center relative">
                <FileText size={32} className="text-slate-400" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg">Ampliar</button>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden group">
              <div className="bg-slate-100 p-2 text-xs font-bold text-slate-600 text-center border-b border-slate-200">
                Verso do Documento
              </div>
              <div className="h-40 bg-slate-200 flex items-center justify-center relative">
                <FileText size={32} className="text-slate-400" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg">Ampliar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl text-slate-900">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 border border-red-200">Rejeitar Documentos</button>
          <button onClick={() => { onApprove(user.id); onClose(); }} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={16} /> Aprovar KYC
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersManagement({ projetos = [] }) {
  const defaultUsers = [
    { id: 1, name: 'Mozart F. Silva', email: 'mozart@b4.capital', cpf: '000.***.***-00', phone: '+55 11 98888-7777', role: 'Super Admin', status: 'Verificado', kycDate: '15/08/2025', allowedPillars: [1,2,3,4,5,6,7,8,9,10,11] },
    { id: 2, name: 'Equipe B4', email: 'contato@b4.capital', cpf: 'N/A', phone: '-', role: 'Gestor Interno B4', status: 'Verificado', kycDate: '20/08/2025', allowedPillars: [1,2,3,4,5,7,8] },
  ];
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('b4_users');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return defaultUsers;
  });

  // Persiste users no localStorage toda vez que mudar
  React.useEffect(() => {
    try { localStorage.setItem('b4_users', JSON.stringify(users)); } catch(e) {}
  }, [users]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycUser, setKycUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleSaveUser = (userData, isEdit) => {
    if (isEdit) {
      // Update existing user in place
      setUsers(prev => prev.map(u => {
        if (u.id === userData.id) {
          const updated = { ...u, role: userData.role, allowedPillars: userData.allowedPillars, projects: userData.projects };
          try {
            const logged = JSON.parse(sessionStorage.getItem('b4_user'));
            if (logged && logged.id === u.id) {
              sessionStorage.setItem('b4_user', JSON.stringify(updated));
              // Dispatch an event so AdminPanel can know (or just force reload)
              window.dispatchEvent(new Event('b4_user_updated'));
            }
          } catch(e) {}
          return updated;
        }
        return u;
      }));
    } else {
      // Create new user
      const today = new Date().toLocaleDateString('pt-BR');
      const newUser = {
        id: Math.random(),
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf || 'Pendente',
        phone: userData.phone || 'Pendente',
        role: userData.role,
        allowedPillars: userData.allowedPillars,
        projects: userData.projects || [],
        status: userData.status || 'Pendente',
        kycDate: today
      };
      setUsers(prev => [newUser, ...prev]);
    }
  };

  const removeUser = (id) => {
    setPendingDeleteId(id);
    setFeedback({
      isOpen: true,
      type: 'warning',
      title: 'Revogar Acesso',
      message: 'Tem certeza que deseja revogar o acesso deste usuário? Esta ação não pode ser desfeita.',
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== id));
        setFeedback({ isOpen: false });
      },
      onCancel: () => setFeedback({ isOpen: false })
    });
  };

  const viewUser = (u) => {
    setKycUser(u);
  };

  const handleApproveKyc = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'Verificado', kycDate: new Date().toLocaleDateString('pt-BR') } : u));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-6 shrink-0 text-slate-900">
        <h1 className="text-2xl font-extrabold text-[#150B2D] flex items-center gap-3">
          Equipe B4 (Gestão Interna)
          <span className="bg-purple-100 text-purple-600 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest">Acesso Restrito</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie os acessos internos da equipe B4. Apenas gestores cadastrados aqui podem aprovar evidências.</p>
      </div>

      {/* Toolbar */}
      <div className="px-4 md:px-8 py-3 md:py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 shrink-0 gap-3 text-slate-900">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar equipe..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-900" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-purple-500/20">
          <User size={16} /> Convidar Membro B4
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-8 custom-scrollbar">
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm text-slate-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário B4</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Documento (CPF)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil de Acesso</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Projetos</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pilares Liberados</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status KYC</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-slate-900">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email} • {user.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-mono text-slate-600 font-medium">{user.cpf}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">
                      {user.projects?.length === projetos.length ? 'Todos' : (user.projects?.length > 0 ? projetos.filter(p => user.projects.includes(p.id)).map(p => p.nome).join(', ') : 'Nenhum')}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {user.allowedPillars?.map(p => (
                        <span key={p} className="w-5 h-5 flex items-center justify-center bg-purple-100 text-purple-700 text-[9px] font-bold rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {user.status === 'Verificado' ? (
                      <div>
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 w-max">
                          <ShieldCheck size={12} /> Verificado B4
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Aprovado em {user.kycDate}</p>
                      </div>
                    ) : (
                      <span className="text-amber-600 bg-amber-50 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 w-max">
                        <ShieldAlert size={12} /> Pendente
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => viewUser(user)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Ver Detalhes">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Usuário">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => removeUser(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Revogar Acesso">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} projetos={projetos} />}
      {editingUser && <UserModal initialData={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} projetos={projetos} />}
      <KycReviewModal user={kycUser} onClose={() => setKycUser(null)} onApprove={handleApproveKyc} />
      <FeedbackModal {...feedback} />
    </div>
  );
}
