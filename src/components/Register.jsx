import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: ''
  });
  const [docsUploaded, setDocsUploaded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Complete registration
      sessionStorage.setItem('b4_admin_auth', 'pending');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-[#150B2D] font-extrabold text-3xl tracking-tighter hover:opacity-80 transition-opacity">
            B4<span className="text-sm font-semibold tracking-normal text-[#7C2DFF] mt-1 relative -top-2">CO2</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">Criar nova conta corporativa</h1>
          <p className="text-sm text-slate-500 mt-1">Acesso ao portal de Gestão IBAS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Corporativo</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Senha</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF</label>
                  <input required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-[#1F123C] hover:bg-[#2A1B4E] text-white font-bold py-3 rounded-xl transition-colors mt-4">
                Continuar para KYC
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl mb-4 text-center">
                <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-purple-900">Verificação de Identidade (KYC)</h3>
                <p className="text-xs text-purple-700 mt-1">Para garantir a segurança do portal B4, envie uma foto do seu RG ou CNH (Frente e Verso).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Documento (Frente)</label>
                <label className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border-2 border-dashed border-slate-300 rounded-xl text-xs text-slate-500 font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors">
                  <UploadCloud size={18} /> 
                  <span>Selecionar arquivo</span>
                  <input type="file" className="hidden" onChange={(e) => {
                    if(e.target.files.length) {
                      e.target.previousElementSibling.textContent = e.target.files[0].name;
                      e.target.parentElement.classList.add('bg-purple-50', 'border-purple-500', 'text-purple-700');
                    }
                  }} />
                </label>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Documento (Verso)</label>
                <label className="w-full px-4 py-3 bg-slate-50 text-slate-900 text-slate-900 border-2 border-dashed border-slate-300 rounded-xl text-xs text-slate-500 font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors">
                  <UploadCloud size={18} /> 
                  <span>Selecionar arquivo</span>
                  <input type="file" className="hidden" onChange={(e) => {
                    if(e.target.files.length) {
                      e.target.previousElementSibling.textContent = e.target.files[0].name;
                      e.target.parentElement.classList.add('bg-purple-50', 'border-purple-500', 'text-purple-700');
                      setDocsUploaded(true);
                    }
                  }} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm">
                  Voltar
                </button>
                <button 
                  type="submit" 
                  disabled={!docsUploaded}
                  className={`flex-1 font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${docsUploaded ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  <FileText size={16} /> Submeter para Aprovação
                </button>
              </div>
            </div>
          )}
        </form>

        {step === 1 && (
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500">
              Já possui uma conta? <Link to="/admin" className="text-purple-600 font-bold hover:underline">Fazer login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
