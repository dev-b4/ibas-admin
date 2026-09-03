import fs from 'fs';
const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('export function addEvidenceToCache')) {
  content = content.replace(
    "export function getEvidences() {",
    "export function addEvidenceToCache(ev) {\n  if(globalEvidencesCache) globalEvidencesCache.unshift(ev);\n}\n\nexport function getEvidences() {"
  );
  fs.writeFileSync(file, content);
  console.log("Patched mockData.js");
}

const file2 = 'src/components/AdminPanel.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

if (!content2.includes('addEvidenceToCache(')) {
  content2 = content2.replace(
    "import { fetchIbasData, mockEvidences, calculatePilarScore",
    "import { fetchIbasData, mockEvidences, calculatePilarScore, addEvidenceToCache, generateAcreditationScore"
  );
  
  content2 = content2.replace(
    "setAndSaveEvidences([ev, ...evidenciasLocal]);",
    "setAndSaveEvidences([ev, ...evidenciasLocal]);\n      addEvidenceToCache(ev);\n      const newScore = generateAcreditationScore(0, projetoSelecionado.id);\n      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));\n      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));"
  );
  fs.writeFileSync(file2, content2);
  console.log("Patched AdminPanel.jsx");
}
