import fs from 'fs';
const path = 'src/locales/translations.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "blockExplorer: 'Explorador de Blocos',",
  "blockExplorer: 'Explorador de Blocos',\n      location: 'Localização',\n      statusB4: 'Status na B4',"
);
content = content.replace(
  "blockExplorer: 'Block Explorer',",
  "blockExplorer: 'Block Explorer',\n      location: 'Location',\n      statusB4: 'B4 Status',"
);

fs.writeFileSync(path, content);
