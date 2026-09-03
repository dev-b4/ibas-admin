import fs from 'fs';

const currentContent = fs.readFileSync('src/api/mockData.js', 'utf8');
const oldContent = fs.readFileSync('old_mock.js', 'utf8');

// Extract fetchIbasData from old_mock.js
const oldMatch = oldContent.match(/(export const fetchIbasData = async \(\) => {[\s\S]*?\n};\n)/);

if (!oldMatch) {
  console.log("Failed to match old fetchIbasData");
  process.exit(1);
}

const oldFetch = oldMatch[1];

// Extract fetchIbasData from current mockData.js
const currentMatch = currentContent.match(/(export const fetchIbasData = async \(\) => {[\s\S]*?\n};\n)/);

if (!currentMatch) {
  console.log("Failed to match current fetchIbasData");
  process.exit(1);
}

const newContent = currentContent.replace(currentMatch[1], oldFetch);
fs.writeFileSync('src/api/mockData.js', newContent);
console.log("Patched successfully with old_mock logic!");
