import fs from 'fs';
let content = fs.readFileSync('src/locales/mockTranslations.js', 'utf8');
content = content.replace(
  "'Highlights the brand's positioning, as well as public clarity and transparency.'",
  "\"Highlights the brand's positioning, as well as public clarity and transparency.\""
);
fs.writeFileSync('src/locales/mockTranslations.js', content);
