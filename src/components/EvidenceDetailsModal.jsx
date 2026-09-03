import React from 'react';
import { X, FileText, Link as LinkIcon, CloudUpload, ShieldAlert, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export default function EvidenceDetailsModal({ evidence, onClose, onDelete }) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in font-sans" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              evidence.type === 'Documento' ? 'bg-orange-100 text-orange-600' :
              evidence.type === 'Link' ? 'bg-purple-100 text-purple-600' :
              evidence.type === 'API' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {evidence.type === 'Documento' && <FileText size={20} />}
              {evidence.type === 'Link' && <LinkIcon size={20} />}
              {evidence.type === 'API' && <CloudUpload size={20} />}
              {evidence.type === 'Blockchain' && <ShieldAlert size={20} />}
              {!['Documento', 'Link', 'API', 'Blockchain'].includes(evidence.type) && <FileText size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#150B2D] leading-tight">{evidence.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{evidence.type} • {evidence.date || new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status de Validação</p>
                <div className={`font-bold flex items-center gap-2 ${
                  evidence.status === 'Validada' ? 'text-emerald-600' : 
                  evidence.status === 'Rejeitada' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  <CheckCircle size={18} /> {evidence.status}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fonte</p>
                <p className="font-bold text-slate-800">{evidence.source}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Descrição / Detalhes</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">
                  {evidence.desc || 'Nenhuma descrição fornecida.'}
                </div>
              </div>

              {evidence.observacoes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Observações Internas</h3>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-900 whitespace-pre-wrap">
                    {evidence.observacoes}
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <h3 className="text-sm font-bold text-slate-800 mb-2">{evidence.type === 'Redes Sociais' ? 'Links das Redes Sociais' : 'Anexo / Link'}</h3>
                {evidence.type === 'Redes Sociais' && Array.isArray(evidence.socialLinks) && evidence.socialLinks.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {evidence.socialLinks.map((url, sIdx) => {
                      if (!url || typeof url !== 'string' || url.trim() === '') return null;
                      return (
                        <a key={sIdx} href={url} target="_blank" rel="noopener noreferrer" className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-purple-50 hover:border-purple-200 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><LinkIcon size={16} /></div>
                            <span className="text-sm font-bold text-slate-700 truncate max-w-[200px] sm:max-w-[300px]">{url}</span>
                          </div>
                          <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-600" />
                        </a>
                      );
                    })}
                  </div>
                ) : evidence.linkUrl ? (
                  <a href={evidence.linkUrl} target="_blank" rel="noopener noreferrer" className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><LinkIcon size={16} /></div>
                      <span className="text-sm font-bold text-slate-700 truncate max-w-[200px] sm:max-w-[300px]">{evidence.linkUrl}</span>
                    </div>
                    <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-600" />
                  </a>
                ) : (
                  <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FileText size={16} /></div>
                      <span className="text-sm font-bold text-slate-700">documento_anexo.pdf</span>
                    </div>
                    <button disabled className="text-sm font-bold text-slate-400 flex items-center gap-1">Upload Realizado</button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Registrado por</h3>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {evidence.user || 'Sistema (Automático)'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3 rounded-b-3xl shrink-0">
          <button 
            onClick={() => onDelete(evidence.id)} 
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors border border-red-200"
          >
            <Trash2 size={16} /> Excluir Evidência
          </button>
          
          <button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors text-center">
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
