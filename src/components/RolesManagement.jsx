import React, { useState } from 'react';
import { Shield, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function RolesManagement() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', desc: 'Acesso total a configuração e painel.', pillars: [1,2,3,4,5,6,7,8,9,10,11] },
    { id: 2, name: 'Gestor Interno B4', desc: 'Acesso para input de documentos.', pillars: [1,2,3,4,5,7,8] },
    { id: 3, name: 'Comitê B4', desc: 'Acesso modo leitura e aprovação.', pillars: [1,11] }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [feedback, setFeedback] = useState({ isOpen: false });

  const [formData, setFormData] = useState({ name: '', desc: '', pillars: [] });

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData(role);
    } else {
      setEditingRole(null);
      setFormData({ name: '', desc: '', pillars: [] });
    }
    setIsModalOpen(true);
  };

  const togglePillar = (num) => {
    setFormData(prev => ({
      ...prev,
      pillars: prev.pillars.includes(num)
        ? prev.pillars.filter(p => p !== num)
        : [...prev.pillars, num].sort((a,b) => a - b)
    }));
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
    } else {
      setRoles([...roles, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFeedback({ isOpen: true, type: 'success', title: 'Sucesso', message: 'Perfil salvo com sucesso!', onConfirm: () => setFeedback({isOpen: false}) });
  };

  const removeRole = (id) => {
    setFeedback({
      isOpen: true,
      type: 'warning',
      title: 'Excluir Perfil',
      message: 'Tem certeza que deseja excluir este perfil de acesso?',
      onConfirm: () => {
        setRoles(roles.filter(r => r.id !== id));
        setFeedback({ isOpen: false });
      },
      onCancel: () => setFeedback({ isOpen: false })
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-8 flex flex-col sm:flex-row justify-between sm:items-center shrink-0 gap-4 text-slate-900">
        <div>
          <h1 className="text-3xl font-extrabold text-[#150B2D] flex items-center gap-3">
            Perfis de Acesso <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">{roles.length}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">Crie e edite os perfis padrão para facilitar a definição de permissões.</p>
        </div>
        <button onClick={() => openModal()} className="bg-[#7C2DFF] hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2">
          <Plus size={18} /> Criar Novo Perfil
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {roles.map(role => (
            <div key={role.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col group text-slate-900">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{role.name}</h3>
                    <p className="text-xs text-slate-500">{role.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(role)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button onClick={() => removeRole(role.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Pilares Padrão:</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.pillars.length > 0 ? role.pillars.map(p => (
                    <span key={p} className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">
                      {p}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-400 italic">Nenhum pilar liberado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col animate-fade-in-up border border-slate-100 text-slate-900">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 rounded-t-3xl text-slate-900">
              <h2 className="text-xl font-bold text-[#150B2D]">{editingRole ? "Editar Perfil" : "Novo Perfil de Acesso"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Perfil</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Auditor Externo" className="w-full px-4 py-2 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                <input value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Breve descrição da responsabilidade" className="w-full px-4 py-2 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilares Permitidos por Padrão</label>
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4,5,6,7,8,9,10,11].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => togglePillar(num)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${formData.pillars.includes(num) ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl text-slate-900">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-[#1F123C] hover:bg-[#2A1B4E] transition-colors flex items-center gap-2">
                <Save size={16} /> Salvar Perfil
              </button>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal {...feedback} />
    </div>
  );
}
