import fs from 'fs';
const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');

const oldGetEv = `export function getEvidences() {
  if (globalEvidencesCache && globalEvidencesCache.length > 0) {
    return globalEvidencesCache;
  }
  const saved = localStorage.getItem('b4_evidences_local');
  let evs = [];
  if (saved && saved !== "undefined") {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) evs = parsed;
    } catch(e) {}
  }
  if (evs.length === 0) evs = defaultEvidences || [];
  return evs;
};`;

const newGetEv = `export function getEvidences() {
  let localEvs = [];
  try {
    const saved = localStorage.getItem('b4_evidences_local');
    if (saved && saved !== "undefined") {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) localEvs = parsed;
    }
  } catch(e) {}

  if (localEvs.length === 0) localEvs = defaultEvidences || [];

  if (globalEvidencesCache && globalEvidencesCache.length > 0) {
    const map = new Map();
    localEvs.forEach(e => map.set(e.id, e));
    globalEvidencesCache.forEach(e => map.set(e.id, e));
    return Array.from(map.values());
  }

  return localEvs;
};`;

content = content.replace(oldGetEv, newGetEv);
fs.writeFileSync(file, content);
console.log("Patched getEvidences!");
