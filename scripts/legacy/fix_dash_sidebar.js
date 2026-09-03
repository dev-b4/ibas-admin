import fs from 'fs';

// 1. Update translations.js
const transPath = 'src/locales/translations.js';
let transContent = fs.readFileSync(transPath, 'utf8');

transContent = transContent.replace(
  "analyzeProject: 'Analisar Projeto Completo'",
  "analyzeProject: 'Analisar Projeto Completo',\n      lastValidation: 'Última Validação de Dados'"
);
transContent = transContent.replace(
  "analyzeProject: 'Analyze Full Project'",
  "analyzeProject: 'Analyze Full Project',\n      lastValidation: 'Last Data Validation'"
);
fs.writeFileSync(transPath, transContent);

// 2. Update Dashboard.jsx
const dashPath = 'src/components/Dashboard.jsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');

dashContent = dashContent.replace(
  '<p className="text-[10px] font-bold text-slate-500 uppercase">Cotação B4TRII</p>',
  '<p className="text-[10px] font-bold text-slate-500 uppercase">{t("dashboard.price")}</p>'
);
dashContent = dashContent.replace(
  '<p className="text-[10px] font-bold text-slate-500 uppercase">Fator Normalização</p>',
  '<p className="text-[10px] font-bold text-slate-500 uppercase">{t("dashboard.normalization")}</p>'
);
dashContent = dashContent.replace(
  "{ label: 'Última Validação de Dados', value: getLastScoreUpdate(selectedAsset.id, selectedAsset.ultimaAtualizacao.split(' ')[0]), pill: 'purple' },",
  "{ label: t('dashboard.lastValidation'), value: getLastScoreUpdate(selectedAsset.id, selectedAsset.ultimaAtualizacao.split(' ')[0]), pill: 'purple' },"
);

fs.writeFileSync(dashPath, dashContent);
