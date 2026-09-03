import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, FileText, Link as LinkIcon, Database, CheckCircle, Search, FileUp } from 'lucide-react';

export default function AddEvidenceModal({ onClose, onSave, pilarSelecionado, initialData }) {
  const draftKey = `b4_draft_ev_${pilarSelecionado?.num || '0'}`;
  const draftSocialKey = `b4_draft_social_${pilarSelecionado?.num || '0'}`;

  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
    try {
      const saved = sessionStorage.getItem(draftKey);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      name: '', desc: '', type: 'Documento', source: 'Originador',
      status: 'Validada', linkUrl: '', observacoes: ''
    };
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    if (initialData && Array.isArray(initialData.socialLinks)) return initialData.socialLinks;
    try {
      const saved = sessionStorage.getItem(draftSocialKey);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [''];
  });

  useEffect(() => {
    if (!initialData) {
      sessionStorage.setItem(draftKey, JSON.stringify(formData));
      sessionStorage.setItem(draftSocialKey, JSON.stringify(socialLinks));
    }
  }, [formData, socialLinks, initialData, draftKey, draftSocialKey]);
  const handleSocialChange = (index, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };
  const addSocialLink = () => setSocialLinks([...socialLinks, '']);
  const removeSocialLink = (index) => setSocialLinks(socialLinks.filter((_, i) => i !== index));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (formData.type === 'Redes Sociais') {
      dataToSave.socialLinks = socialLinks.filter(link => link.trim() !== '');
    }
    if (!initialData) {
      sessionStorage.removeItem(draftKey);
      sessionStorage.removeItem(draftSocialKey);
    }
    onSave(dataToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in font-sans" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in-up m-4" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-3xl text-slate-900">
          <div>
            <h2 className="text-xl font-bold text-[#150B2D]">Adicionar Evidência</h2>
            <p className="text-sm text-slate-500 mt-1">Pilar {pilarSelecionado?.num}: {pilarSelecionado?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
          <form id="add-evidence-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Nome da Evidência *</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Ex: KYC/KYB do Originador, Relatório de Auditoria..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Descrição / Detalhes</label>
                <input name="desc" value={formData.desc} onChange={handleChange} type="text" placeholder="Ex: Documento KYC aprovado e assinado" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Observações Internas</label>
                <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Adicione notas, comentários ou ressalvas sobre esta evidência..." rows="3" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 resize-none text-slate-900"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Tipo de Evidência *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900">
                  <option value="Documento">Documento (PDF/Doc)</option>
                  <option value="Link">Link Externo</option>
                  <option value="API">API de Terceiros</option>
                  <option value="Blockchain">Registro Blockchain</option>
                  <option value="Imagem">Imagem / Satélite</option>
                  <option value="Redes Sociais">Redes Sociais</option>
                </select>
              </div>

                            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Gestor Responsável (KYC)</label>
                <div className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  mozart@b4.capital
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Fonte da Informação *</label>
                <select name="source" value={formData.source} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900">
                  <option value="Originador">Originador do Projeto</option>
                  <option value="Terceirizado">Auditor / Terceirizado</option>
                  <option value="Sistema">Sistema B4 (Automático)</option>
                  <option value="Órgão Público">Órgão Público / Governamental</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Status da Evidência</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900">
                  <option value="Validada">Validada</option>
                  <option value="Pendente">Pendente de Validação</option>
                  <option value="Rejeitada">Rejeitada</option>
                  <option value="Sincronizada">Sincronizada via API</option>
                </select>
              </div>

              {formData.type === 'Redes Sociais' ? (
                <div className="col-span-1 md:col-span-2 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Links das Redes Sociais</label>
                  {socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        value={link} 
                        onChange={(e) => handleSocialChange(idx, e.target.value)} 
                        type="url" 
                        placeholder="https://..." 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900" 
                      />
                      {socialLinks.length > 1 && (
                        <button type="button" onClick={() => removeSocialLink(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addSocialLink} className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 mt-2">
                    <Plus size={14} /> Adicionar outro link
                  </button>
                </div>
              ) : formData.type === 'Link' || formData.type === 'Blockchain' || formData.type === 'API' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">URL / Link (Endpoint) *</label>
                  <input required name="linkUrl" value={formData.linkUrl} onChange={handleChange} type="url" placeholder="https://" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 text-slate-900" />
                </div>
              ) : (
                                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Upload de Arquivo *</label>
                  <label className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-purple-300 rounded-xl text-sm text-purple-600 font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors text-slate-900">
                    <FileUp size={24} className="mb-1" /> 
                    <span id="file-name-display">Clique para selecionar ou arraste o arquivo</span>
                    <input type="file" required name="fileUpload" className="hidden" onChange={(e) => {
                      if(e.target.files.length > 0) {
                        e.target.previousElementSibling.textContent = e.target.files[0].name;
                        e.target.parentElement.classList.add('bg-purple-50', 'border-purple-500');
                      }
                    }} />
                  </label>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3 rounded-b-3xl shrink-0 text-slate-900">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button form="add-evidence-form" type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/30">
            <Save size={16} /> Salvar Evidência
          </button>
        </div>

      </div>
    </div>
  );
}
