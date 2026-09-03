import fs from 'fs';

const path = 'src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

// PT
content = content.replace(
  "linksAndDocs: 'Links e Documentos',",
  "linksAndDocs: 'Links e Documentos',\n      certAccess: 'Acesso ao Certificado — BF Terra I',\n      creditCert: 'Certificado de Crédito',"
);

// EN
content = content.replace(
  "linksAndDocs: 'Links and Documents',",
  "linksAndDocs: 'Links and Documents',\n      certAccess: 'Certificate Access — BF Terra I',\n      creditCert: 'Credit Certificate',"
);

fs.writeFileSync(path, content);
