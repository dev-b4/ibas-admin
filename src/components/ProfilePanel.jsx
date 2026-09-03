import React, { useState } from 'react';
import { User, Mail, Phone, FileText, UploadCloud, Save, ShieldCheck } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function ProfilePanel() {
  const [formData, setFormData] = useState({
    name: 'Mozart F. Silva',
    email: 'mozart@b4.capital',
    phone: '+55 11 98888-7777',
    cpf: '000.***.***-00'
  });

  const [docsUploaded, setDocsUploaded] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ isOpen: true, type: 'success', title: 'Sucesso', message: 'Perfil atualizado com sucesso!' });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 font-sans">
      <div className="bg-white border-b border-slate-200 px-8 py-8 shrink-0">
        <h1 className="text-3xl font-extrabold text-[#150B2D] flex items-center gap-3">
          Meu Perfil
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">Mantenha seus dados atualizados e envie seus documentos de identificação para manter seu status de KYC ativo no portal B4.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Dados Pessoais */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-purple-600" /> Dados Pessoais
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Nome Completo</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Email Corporativo</label>
                <input disabled value={formData.email} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Documento (CPF)</label>
                  <input value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Telefone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1F123C] hover:bg-[#2A1B4E] text-white font-bold py-3 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar Alterações
              </button>
            </form>
          </div>

          {/* KYC Upload */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-purple-600" /> Verificação de Identidade
            </h2>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
              <p className="text-xs text-amber-800 font-medium">Para aprovar evidências na blockchain, precisamos confirmar sua identidade. Envie uma foto do seu RG ou CNH (Frente e Verso).</p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Documento de Identidade (Frente)</label>
                <label className="w-full px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors">
                  <UploadCloud size={24} className="text-slate-400 mb-1" /> 
                  <span className="file-label">Selecionar arquivo CNH_Frente.jpg</span>
                  <input type="file" className="hidden" onChange={(e) => {
                    if(e.target.files.length) {
                      e.target.previousElementSibling.textContent = e.target.files[0].name;
                      e.target.parentElement.classList.add('bg-purple-50', 'border-purple-500', 'text-purple-700');
                    }
                  }} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Documento de Identidade (Verso)</label>
                <label className="w-full px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 font-semibold flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors">
                  <UploadCloud size={24} className="text-slate-400 mb-1" /> 
                  <span className="file-label">Selecionar arquivo CNH_Verso.jpg</span>
                  <input type="file" className="hidden" onChange={(e) => {
                    if(e.target.files.length) {
                      e.target.previousElementSibling.textContent = e.target.files[0].name;
                      e.target.parentElement.classList.add('bg-purple-50', 'border-purple-500', 'text-purple-700');
                      setDocsUploaded(true);
                    }
                  }} />
                </label>
              </div>
            </div>

            <button 
              className={`w-full font-bold py-3 rounded-xl transition-colors mt-6 flex items-center justify-center gap-2 ${docsUploaded ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              onClick={() => { if(docsUploaded) setFeedback({ isOpen: true, type: 'success', title: 'KYC Enviado', message: 'Documentos enviados para análise do Backoffice!' }); }}
            >
              <FileText size={16} /> Submeter para Análise KYC
            </button>
          </div>

        </div>
      </div>
      <FeedbackModal isOpen={feedback.isOpen} type={feedback.type} title={feedback.title} message={feedback.message} onConfirm={() => setFeedback({ ...feedback, isOpen: false })} />
    </div>
  );
}
