import fs from 'fs';

const path = 'src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("market: 'A Bolsa',", "market: 'A Bolsa',\n      forCompanies: 'Para empresas',\n      forPeople: 'Para pessoas',\n      insights: 'Insights',\n      projects: 'Projetos',\n      refi: 'ReFi',");
content = content.replace("market: 'The Market',", "market: 'The Market',\n      forCompanies: 'For companies',\n      forPeople: 'For people',\n      insights: 'Insights',\n      projects: 'Projects',\n      refi: 'ReFi',");

fs.writeFileSync(path, content);
