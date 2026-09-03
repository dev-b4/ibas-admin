import fs from 'fs';
const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('updateEvidenceInCache')) {
  content = content.replace(
    "export function addEvidenceToCache(ev) {",
    "export function updateEvidenceInCache(ev) {\n  if(globalEvidencesCache) {\n    const idx = globalEvidencesCache.findIndex(e => e.id === ev.id);\n    if (idx >= 0) globalEvidencesCache[idx] = ev;\n  }\n}\n\nexport function addEvidenceToCache(ev) {"
  );
  fs.writeFileSync(file, content);
}

const file2 = 'src/components/AdminPanel.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

if (!content2.includes('updateEvidenceInCache(')) {
  content2 = content2.replace(
    "import { fetchIbasData, mockEvidences, calculatePilarScore, addEvidenceToCache, generateAcreditationScore",
    "import { fetchIbasData, mockEvidences, calculatePilarScore, addEvidenceToCache, updateEvidenceInCache, generateAcreditationScore"
  );
  
  content2 = content2.replace(
    "setAndSaveEvidences(prev => prev.map(e => e.id === editingEvidence.id ? updatedEv : e));",
    "setAndSaveEvidences(prev => prev.map(e => e.id === editingEvidence.id ? updatedEv : e));\n      updateEvidenceInCache(updatedEv);\n      const newScore = generateAcreditationScore(0, projetoSelecionado.id);\n      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));\n      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));"
  );
  fs.writeFileSync(file2, content2);
}
console.log("Patched updates");
