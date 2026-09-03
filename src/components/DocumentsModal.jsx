import React, { useState, useEffect } from 'react';
import { X, FileText, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { getEvidences } from '../api/mockData';

export default function DocumentsModal({ onClose, projeto, onOpenPillar }) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let localDocs = [];
    try {
      const allEvidences = getEvidences();
      localDocs = allEvidences.filter(e => e.projetoId === projeto.id && e.status === 'Validada');
    } catch(e) {}

    let hardcoded = [];

    const formattedLocal = localDocs
      // No filter, show all real validated documents
      .map(e => ({
        nome: e.name === 'Utility Token' ? 'Acesso ao Ativo Sustentável' : e.name === 'Certificado do Crédito' ? 'Certificado do Crédito de Carbono' : (e.name && e.name.startsWith('Certificado do Crédito') ? e.name.replace('Certificado do Crédito', 'Certificado do Crédito de Carbono') : e.name),
        pilarNome: `Pilar ${e.pilarNum || e.pilar}`,
        pilarNum: e.pilarNum || e.pilar,
        type: e.type,
        dataValidade: e.date && e.date.includes('/') ? e.date.split('/').reverse().join('-') : (e.date || new Date().toISOString().split('T')[0]),
        fileUrl: e.linkUrl || e.fileUrl || e.url || e.link || '#'
      }));

    const allCombined = [...formattedLocal, ...hardcoded];
    const uniqueDocs = Array.from(new Map(allCombined.map(item => [item.nome, item])).values());
    
    uniqueDocs.sort((a, b) => new Date(b.dataValidade) - new Date(a.dataValidade));

    setDocuments(uniqueDocs);
  }, [projeto]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-3xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[#150B2D] flex items-center gap-2"><Clock className="text-purple-500" /> Linha do Tempo Documental</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium bg-white/60 px-3 py-1 rounded-full inline-block backdrop-blur-sm">{projeto.nome}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white shadow-sm text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all relative z-10">
            <X size={20} />
          </button>
        </div>

        {/* Content - Timeline */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow bg-slate-50/50">
          <div className="relative border-l-2 border-emerald-200 ml-4 md:ml-8 space-y-8 py-4">
            
            {documents.map((doc, idx) => {
              const rawDate = doc.dataValidade || doc.data || new Date().toISOString().split('T')[0];
              let displayDate = rawDate;
              try {
                if (rawDate.includes('-')) {
                  const parts = rawDate.split('-');
                  displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
              } catch(e) {}

              return (
                <div key={idx} className="relative pl-8 md:pl-10 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                  
                  {/* Date Tag */}
                  <div className="mb-2">
                    <span className="bg-white border border-slate-200 text-[10px] font-bold text-slate-500 px-3 py-1 rounded-full shadow-sm">
                      {displayDate}
                    </span>
                  </div>
                  
                  {/* Card */}
                  {(() => {
                    const isSocial = doc.type === 'Redes Sociais' || doc.nome === 'Redes Sociais do Projeto';
                    const urls = isSocial && typeof doc.fileUrl === 'string' ? doc.fileUrl.split(',').map(s=>s.trim()) : [doc.fileUrl || '#'];
                    
                    return (
                      <div className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:shadow-lg transition-all">
                         <div className="flex items-start md:items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                               {isSocial ? <Globe size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                               {(() => {
                                let main = doc.nome;
                                let sub = '';
                                if (doc.nome && typeof doc.nome === 'string' && doc.nome.includes(' (')) {
                                  const p = doc.nome.split(' (');
                                  main = p[0];
                                  sub = '(' + p[1];
                                }
                                const formatMain = (m) => {
                                  if (m === 'Rastreabilidade do Plano Público') return <><span className="block">Rastreabilidade do</span><span className="block">Plano Público</span></>;
                                  if (m === 'Certificado do Crédito de Carbono') return <><span className="block">Certificado do</span><span className="block">Crédito de Carbono</span></>;
                                  return m;
                                };
                                return (
                                  <h4 className="text-base font-bold text-slate-800 leading-tight mb-2 break-words flex flex-col">
                                    <span>{formatMain(main)}</span>
                                    {sub && <span className="text-xs text-slate-500 font-medium mt-1">{sub}</span>}
                                  </h4>
                                );
                              })()}
                               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block">{doc.pilarNome || doc.type || 'Documento'}</span>
                            </div>
                            
                            {isSocial && urls.length > 0 ? (
                              <div className="flex flex-wrap gap-2 shrink-0">
                                {urls.map((url, sIdx) => {
                                  if (!url || url === '#') return null;
                                  const lUrl = url.toLowerCase();
                                  if (lUrl.includes('instagram.com')) {
                                    return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>;
                                  }
                                  if (lUrl.includes('linkedin.com')) {
                                    return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>;
                                  }
                                  return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-full transition-colors"><Globe size={16}/></a>;
                                })}
                              </div>
                            ) : (
                              <a href={doc.fileUrl || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 hover:bg-emerald-50 transition-colors">
                                <ExternalLink size={18} className="text-slate-400 hover:text-emerald-500 transition-colors" />
                              </a>
                            )}
                         </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}

            {/* Start of time indicator */}
            <div className="relative pl-8 md:pl-10 pt-4">
              <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-slate-300 border-4 border-slate-50"></div>
              <p className="text-xs font-bold text-slate-400">Início dos Registros</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
