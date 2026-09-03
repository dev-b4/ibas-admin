import fs from 'fs';
const path = 'src/components/EvidencesLogModal.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace(
    "import { X, FileText, Link as LinkIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';",
    "import { X, FileText, Link as LinkIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';\nimport { useLanguage } from '../context/LanguageContext';\nimport { mockTranslations } from '../locales/mockTranslations';"
  );
}

const translateFunc = `
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
`;

if (!content.includes('const { t, language }')) {
  content = content.replace(
    "export default function EvidencesLogModal({ onClose, pillar }) {",
    "export default function EvidencesLogModal({ onClose, pillar }) {\n  const { t, language } = useLanguage();\n" + translateFunc
  );
}

content = content.replace(
  '<h2 className="text-xl font-bold text-[#150B2D]">Log de Evidências</h2>',
  '<h2 className="text-xl font-bold text-[#150B2D]">{translateMock("Log de Evidências")}</h2>'
);
content = content.replace(
  '<p className="text-sm text-slate-500 mt-1">Histórico documental - Pilar {pillar?.num}</p>',
  '<p className="text-sm text-slate-500 mt-1">{translateMock("Histórico documental - Pilar")} {pillar?.num}</p>'
);
content = content.replace(
  '<h4 className="text-sm font-bold text-slate-800">{log.action}</h4>',
  '<h4 className="text-sm font-bold text-slate-800">{translateMock(log.action)}</h4>'
);
content = content.replace(
  '<span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold border border-emerald-100">{log.status}</span>',
  '<span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold border border-emerald-100">{translateMock(log.status)}</span>'
);
content = content.replace(
  '<span className="text-xs font-semibold text-slate-700">{log.doc}</span>',
  '<span className="text-xs font-semibold text-slate-700">{translateMock(log.doc)}</span>'
);
content = content.replace(
  '<span className="text-[10px] text-slate-400 font-medium">por {log.user}</span>',
  '<span className="text-[10px] text-slate-400 font-medium">{translateMock("por")} {translateMock(log.user)}</span>'
);

fs.writeFileSync(path, content);
