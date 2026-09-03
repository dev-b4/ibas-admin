import fs from 'fs';

const path = 'src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

// PT
content = content.replace(
  "whitepaper: 'Whitepaper do Projeto',",
  "whitepaper: 'Whitepaper do Projeto',\n      tokenBft: 'Ativo Sustentável — Utility Token BFTIII',\n      blockExplorer: 'Explorador de Blocos',"
);

// EN
content = content.replace(
  "whitepaper: 'Project Whitepaper',",
  "whitepaper: 'Project Whitepaper',\n      tokenBft: 'Sustainable Asset — Utility Token BFTIII',\n      blockExplorer: 'Block Explorer',"
);

fs.writeFileSync(path, content);

const projPath = 'src/components/ProjectDetails.jsx';
let projContent = fs.readFileSync(projPath, 'utf8');
projContent = projContent.replace(
  'isBf ? "Ativo Sustentável — Utility Token BFTIII" : "Explorador de Blocos"',
  'isBf ? t("projectDetails.tokenBft") : t("projectDetails.blockExplorer")'
);
fs.writeFileSync(projPath, projContent);
