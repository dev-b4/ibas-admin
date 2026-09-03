import fs from 'fs';

const path = 'src/components/Header.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("label: 'Para empresas',", "label: t('header.forCompanies') || 'Para empresas',");
content = content.replace("label: 'Para pessoas',", "label: t('header.forPeople') || 'Para pessoas',");
content = content.replace("label: 'Insights',", "label: t('header.insights') || 'Insights',");
content = content.replace("label: 'Projetos',", "label: t('header.projects') || 'Projetos',");
content = content.replace("label: 'Listings',", "label: t('header.listings') || 'Listings',");
content = content.replace("label: 'ReFi',", "label: t('header.refi') || 'ReFi',");

fs.writeFileSync(path, content);
