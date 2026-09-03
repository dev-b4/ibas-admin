import fs from 'fs';

const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('removeEvidenceFromCache')) {
  content = content.replace(
    "export function addEvidenceToCache(ev) {",
    "export function removeEvidenceFromCache(id) {\n  if(globalEvidencesCache) {\n    const idx = globalEvidencesCache.findIndex(e => e.id === id);\n    if (idx >= 0) globalEvidencesCache.splice(idx, 1);\n  }\n}\n\nexport function addEvidenceToCache(ev) {"
  );
  fs.writeFileSync(file, content);
}

const file2 = 'src/components/AdminPanel.jsx';
let content2 = fs.readFileSync(file2, 'utf8');

if (!content2.includes('removeEvidenceFromCache(')) {
  content2 = content2.replace(
    "import { fetchIbasData, mockEvidences, calculatePilarScore, addEvidenceToCache, updateEvidenceInCache, generateAcreditationScore",
    "import { fetchIbasData, mockEvidences, calculatePilarScore, addEvidenceToCache, updateEvidenceInCache, removeEvidenceFromCache, generateAcreditationScore"
  );
  
  // Find confirmDelete and patch it
  const oldConfirm = `    if (feedbackState.idToDelete) {
      setAndSaveEvidences(prev => prev.filter(e => e.id !== feedbackState.idToDelete));
      supabase.from('evidences').delete().eq('id', feedbackState.idToDelete).then(() => {});
    logAction(currentUser.email, 'Exclusão de Evidência', projetoSelecionado?.nome || 'N/A', \`Excluiu evidência ID: \${feedbackState.idToDelete}\`);
    }`;

  const newConfirm = `    if (feedbackState.idToDelete) {
      setAndSaveEvidences(prev => prev.filter(e => e.id !== feedbackState.idToDelete));
      removeEvidenceFromCache(feedbackState.idToDelete);
      supabase.from('evidences').delete().eq('id', feedbackState.idToDelete).then(() => {});
      logAction(currentUser?.email || 'N/A', 'Exclusão de Evidência', projetoSelecionado?.nome || 'N/A', \`Excluiu evidência ID: \${feedbackState.idToDelete}\`);
      const newScore = generateAcreditationScore(0, projetoSelecionado.id);
      setProjetos(prev => prev.map(p => p.id === projetoSelecionado.id ? { ...p, score: newScore.total, acreditacao: newScore } : p));
      setProjetoSelecionado(prev => ({ ...prev, score: newScore.total, acreditacao: newScore }));
    }`;

  if (content2.includes(oldConfirm)) {
    content2 = content2.replace(oldConfirm, newConfirm);
  } else {
    console.log("Could not find confirmDelete to patch in AdminPanel.jsx");
  }

  fs.writeFileSync(file2, content2);
}
console.log("Patched delete");
