import fs from 'fs';

const oldContent = fs.readFileSync('old_mock.js', 'utf8');
const currentContent = fs.readFileSync('src/api/mockData.js', 'utf8');

const fallbackMatch = oldContent.match(/(const getFallbackAssets = \(\) => {[\s\S]*?\n};\n)/);
if (fallbackMatch && !currentContent.includes("const getFallbackAssets = () => {")) {
  fs.appendFileSync('src/api/mockData.js', '\n' + fallbackMatch[1]);
  console.log("Appended getFallbackAssets");
}
