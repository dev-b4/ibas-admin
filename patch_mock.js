import fs from 'fs';

const currentContent = fs.readFileSync('src/api/mockData.js', 'utf8');
const backupContent = fs.readFileSync('../ibas-dashboard-v1-backup/src/api/mockData.js', 'utf8');

// Extrair fetchIbasData do backup
const backupMatch = backupContent.match(/(export const fetchIbasData = async \(\) => {[\s\S]*?\n  \} catch \(error\) {[\s\S]*?\n    };\n  }\n};)/);

if (!backupMatch) {
  console.log("Failed to extract from backup");
  process.exit(1);
}
let backupFetch = backupMatch[1];
// The current Dashboard expects data.history in the return of fetchIbasData.
// The backup version returns:
// return {
//   moedaBase: ...,
//   ativos: ...,
//   ptax: ...,
//   fatorNormalizacao: ...
// }
// We need to inject `history: []` or `history: registerDailyIbasIndex(100)` into the return statements of the backup version so it doesn't crash the current Dashboard!

backupFetch = backupFetch.replace(
  /fatorNormalizacao: 1\.5\n    };/g,
  'fatorNormalizacao: 1.5,\n      history: registerDailyIbasIndex(100)\n    };'
);

const currentMatch = currentContent.match(/(export const fetchIbasData = async \(\) => {[\s\S]*?\n};\n)/);

if (!currentMatch) {
  console.log("Failed to match current");
  process.exit(1);
}

const newContent = currentContent.replace(currentMatch[1], backupFetch + '\n');
fs.writeFileSync('src/api/mockData.js', newContent);
console.log("Patched successfully!");
