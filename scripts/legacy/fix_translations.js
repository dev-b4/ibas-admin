import fs from 'fs';

let content;

// Fix translations.js
const transPath = 'src/locales/translations.js';
content = fs.readFileSync(transPath, 'utf8');
if (!content.includes('publicPage')) {
  content = content.replace("seeAllDocs: 'Ver todos os documentos',", "seeAllDocs: 'Ver todos os documentos',\n      publicPage: 'Ver página pública',");
  content = content.replace("seeAllDocs: 'See all documents',", "seeAllDocs: 'See all documents',\n      publicPage: 'View public page',");
  fs.writeFileSync(transPath, content);
}

// Fix Dashboard.jsx (Metodologia & waitingData issue)
const dashPath = 'src/components/Dashboard.jsx';
content = fs.readFileSync(dashPath, 'utf8');
content = content.replace(
  "Aguardando atingir período {t('dashboard.of')} dados...",
  "{t('dashboard.waitingData')}"
);
content = content.replace(
  "{ label: 'Metodologia', value: selectedAsset.metodologia, pill: 'slate' },",
  "{ label: t('projectDetails.methodology'), value: selectedAsset.metodologia, pill: 'slate' },"
);
fs.writeFileSync(dashPath, content);

// Fix ProjectDetails.jsx (publicPage and integrity)
const projPath = 'src/components/ProjectDetails.jsx';
content = fs.readFileSync(projPath, 'utf8');

const integrityFunc = `
  const translateIntegrity = (label) => {
    if (label === 'Integridade Excelente') return t('projectDetails.integrity.excellent');
    if (label === 'Integridade Alta') return t('projectDetails.integrity.high');
    if (label === 'Integridade Média') return t('projectDetails.integrity.medium');
    if (label === 'Integridade Baixa') return t('projectDetails.integrity.low');
    if (label === 'Integridade Muito Baixa') return t('projectDetails.integrity.veryLow');
    return label;
  };
`;

if (!content.includes('translateIntegrity')) {
  content = content.replace(
    'export default function ProjectDetails() {\n  const { t, language } = useLanguage();',
    'export default function ProjectDetails() {\n  const { t, language } = useLanguage();\n' + integrityFunc
  );
}
content = content.replace(
  /\{getIntegrityLabel\((.*?)\)\}/g,
  '{translateIntegrity(getIntegrityLabel($1))}'
);
content = content.replace('Ver página pública', "{t('projectDetails.publicPage')}");
fs.writeFileSync(projPath, content);

