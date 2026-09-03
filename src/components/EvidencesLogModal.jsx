import React from 'react';
import { X, FileText, Link as LinkIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockTranslations } from '../locales/mockTranslations';

export default function EvidencesLogModal({ onClose, pillar }) {
  const { t, language } = useLanguage();

  const translateMock = (text) => {
    if (language === 'pt') return text;
    const dict = {
      'Renovação de Evidência': 'Evidence Renewal',
      'Relatório Técnico de Campo': 'Technical Field Report',
      'Auditado': 'Audited',
      'Registro em Blockchain': 'Blockchain Registration',
      'Sistema Automático': 'Automatic System',
      'Confirmado': 'Confirmed',
      'Validação B4': 'B4 Validation',
      'Equipe de Conformidade': 'Compliance Team',
      'Checklist de Elegibilidade': 'Eligibility Checklist',
      'Aprovado': 'Approved',
      'Submissão de Documento': 'Document Submission',
      'Originador do Projeto': 'Project Originator',
      'Laudo Ambiental Preliminar': 'Preliminary Environmental Report',
      'Recebido': 'Received',
      'Log de Evidências': 'Evidences Log',
      'Histórico documental - Pilar': 'Document History - Pillar',
      'por': 'by'
    };
    return dict[text] || mockTranslations[text] || text;
  };

  const logs = [
    { date: '21/08/2025', time: '16:40', action: 'Renovação de Evidência', user: 'Bureau Veritas', doc: 'Relatório Técnico de Campo', status: 'Auditado' },
    { date: '15/07/2025', time: '09:12', action: 'Registro em Blockchain', user: 'Sistema Automático', doc: 'Hash #0x89...12af', status: 'Confirmado' },
    { date: '10/05/2025', time: '14:22', action: 'Validação B4', user: 'Equipe de Conformidade', doc: 'Checklist de Elegibilidade', status: 'Aprovado' },
    { date: '01/05/2025', time: '10:05', action: 'Submissão de Documento', user: 'Originador do Projeto', doc: 'Laudo Ambiental Preliminar', status: 'Recebido' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col animate-fade-in-up border border-slate-100" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-slate-50 rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-[#150B2D]">{translateMock("Log de Evidências")}</h2>
            <p className="text-sm text-slate-500 mt-1">{translateMock("Histórico documental - Pilar")} {pillar?.num}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Timeline Log Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
          <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
            {logs.map((log, idx) => (
              <div key={idx} className="relative pl-8">
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-1 bg-white p-1 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                </div>

                {/* Log Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{translateMock(log.action)}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.date} • {log.time}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold border border-emerald-100">{translateMock(log.status)}</span>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {log.action.includes('Blockchain') ? <LinkIcon size={16} className="text-purple-500" /> : <FileText size={16} className="text-blue-500" />}
                      <span className="text-xs font-semibold text-slate-700">{translateMock(log.doc)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{translateMock("por")} {translateMock(log.user)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
