import React, { useState, useEffect } from 'react';
import { getSystemUsers, saveSystemUsers, getActionLogs } from '../api/mockData';
import { Users, Activity, Eye, Edit, Trash2, X, Plus } from 'lucide-react';

export default function SystemUsersAndLogs({ projetos }) {
  const [activeTab, setActiveTab] = useState('logs');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    setUsers(getSystemUsers());
    setLogs(getActionLogs());
  }, []);

  const handleSaveUser = (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      role: e.target.role.value,
      projects: Array.from(e.target.projects.selectedOptions).map(opt => opt.value)
    };

    let newUsers;
    if (editingUser) {
      newUsers = users.map(u => u.id === editingUser.id ? { ...u, ...data } : u);
    } else {
      newUsers = [{ id: Date.now().toString(), ...data }, ...users];
    }
    
    setUsers(newUsers);
    saveSystemUsers(newUsers);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const deleteUser = (id) => {
    if (confirm("Excluir este usuário?")) {
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      saveSystemUsers(newUsers);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200 px-8 py-6 shrink-0">
        <h1 className="text-2xl font-extrabold text-[#150B2D] flex items-center gap-3">
          Configurações do Sistema
        </h1>
        <p className="text-sm text-slate-500 mt-1">Gerencie os usuários do Backoffice e audite as ações realizadas no sistema.</p>
        
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setActiveTab('logs')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'logs' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2"><Activity size={16} /> Logs de Auditoria</div>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'users' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-2"><Users size={16} /> Gestão de Usuários</div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {activeTab === 'logs' ? (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4">Data / Hora</th>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Ação</th>
                  <th className="p-4">Projeto</th>
                  <th className="p-4">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-400">Nenhum log registrado ainda.</td></tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm text-slate-700">
                    <td className="p-4 whitespace-nowrap text-xs">{log.date}</td>
                    <td className="p-4 font-medium">{log.user}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{log.action}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{log.project}</td>
                    <td className="p-4 text-xs text-slate-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2">
                <Plus size={16} /> Adicionar Usuário
              </button>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="p-4">Nome</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Perfil</th>
                    <th className="p-4">Projetos Liberados</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                      <td className="p-4 font-bold text-slate-800">{u.name}</td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role === 'admin' ? 'Admin Geral' : 'Operador'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {u.role === 'admin' ? 'Acesso Total' : (
                          u.projects?.length > 0 ? projetos.filter(p => u.projects.includes(p.id)).map(p => p.nome).join(', ') : 'Nenhum'
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setEditingUser(u); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 rounded mr-2"><Edit size={14}/></button>
                        <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 rounded"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 rounded-full p-2"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome</label>
                <input name="name" defaultValue={editingUser?.name} required className="w-full border border-slate-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full border border-slate-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perfil</label>
                <select name="role" defaultValue={editingUser?.role || 'operator'} className="w-full border border-slate-200 rounded-lg p-2">
                  <option value="operator">Operador Padrão</option>
                  <option value="admin">Admin Geral</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Projetos Liberados (Ctrl+Clique para vários)</label>
                <select name="projects" multiple defaultValue={editingUser?.projects || []} className="w-full border border-slate-200 rounded-lg p-2 h-32 text-xs">
                  {projetos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Selecione quais projetos este operador pode ver (Admin vê todos automaticamente).</p>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
