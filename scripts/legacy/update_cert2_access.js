import fs from 'fs';

const path = 'src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

// PT
content = content.replace(
  "certAccess: 'Acesso ao Certificado — BF Terra I',",
  "certAccess: 'Acesso ao Certificado — BF Terra I',\n      certAccess2: 'Acesso ao Certificado — BF Terra II',\n      whitepaper: 'Whitepaper do Projeto',"
);

// EN
content = content.replace(
  "certAccess: 'Certificate Access — BF Terra I',",
  "certAccess: 'Certificate Access — BF Terra I',\n      certAccess2: 'Certificate Access — BF Terra II',\n      whitepaper: 'Project Whitepaper',"
);

fs.writeFileSync(path, content);

const projPath = 'src/components/ProjectDetails.jsx';
let projContent = fs.readFileSync(projPath, 'utf8');
projContent = projContent.replace(
  'isBf ? "Acesso ao Certificado — BF Terra II" : "Whitepaper do Projeto"',
  'isBf ? t("projectDetails.certAccess2") : t("projectDetails.whitepaper")'
);
fs.writeFileSync(projPath, projContent);
