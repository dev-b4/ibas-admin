import fs from 'fs';
const path = 'src/components/ProjectDetails.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "{ label: 'Localização', value: projeto.localizacao || 'Brasil' },",
  "{ label: t('projectDetails.location') || 'Localização', value: projeto.localizacao || 'Brasil' },"
);
content = content.replace(
  "{ label: 'Status na B4', value: projeto.status, emerald: true },",
  "{ label: t('projectDetails.statusB4') || 'Status na B4', value: (projeto.status === 'Listado' && language === 'en') ? 'Listed' : projeto.status, emerald: true },"
);

fs.writeFileSync(path, content);
