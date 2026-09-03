import fs from 'fs';

// 1. Update translations.js
const transPath = 'src/locales/translations.js';
let transContent = fs.readFileSync(transPath, 'utf8');

transContent = transContent.replace(
  "lastValidation: 'Última Validação de Dados'",
  "lastValidation: 'Última Validação de Dados',\n      max24h: 'Máxima (24h)',\n      min24h: 'Mínima (24h)',\n      max30d: 'Máxima (30d)',\n      min30d: 'Mínima (30d)',\n      weightIbas: 'Peso no IBAS'"
);
transContent = transContent.replace(
  "lastValidation: 'Last Data Validation'",
  "lastValidation: 'Last Data Validation',\n      max24h: 'High (24h)',\n      min24h: 'Low (24h)',\n      max30d: 'High (30d)',\n      min30d: 'Low (30d)',\n      weightIbas: 'IBAS Weight'"
);
fs.writeFileSync(transPath, transContent);

// 2. Update Dashboard.jsx
const dashPath = 'src/components/Dashboard.jsx';
let dashContent = fs.readFileSync(dashPath, 'utf8');

dashContent = dashContent.replace('Máxima (24h)', "{t('dashboard.max24h')}");
dashContent = dashContent.replace('Mínima (24h)', "{t('dashboard.min24h')}");
dashContent = dashContent.replace('Máxima (30d)', "{t('dashboard.max30d')}");
dashContent = dashContent.replace('Mínima (30d)', "{t('dashboard.min30d')}");
dashContent = dashContent.replace('Peso no IBAS', "{t('dashboard.weightIbas')}");

fs.writeFileSync(dashPath, dashContent);
