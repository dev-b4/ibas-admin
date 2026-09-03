import fs from 'fs';
const path = 'src/components/PillarModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
if (!content.includes('mockTranslations')) {
  content = content.replace(
    "import { useLanguage } from \"../context/LanguageContext\";",
    "import { useLanguage } from \"../context/LanguageContext\";\nimport { mockTranslations } from \"../locales/mockTranslations\";"
  );
}

// Modify translateMock
content = content.replace(
  "return dict[text] || text;",
  "return dict[text] || mockTranslations[text] || text;"
);

fs.writeFileSync(path, content);
