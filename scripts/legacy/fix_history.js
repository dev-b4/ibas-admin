import fs from 'fs';
const path = 'src/api/mockData.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "return saved ? JSON.parse(saved) : [];",
  `
  if (saved && saved !== "undefined") {
    const p = JSON.parse(saved);
    if (p.length > 0) return p;
  }
  const todayStr = new Date().toLocaleDateString('pt-BR');
  return [
    { date: "24/08/2025", close: 0.2169, max: 0.2169, min: 0.2169 },
    { date: "25/08/2025", close: 11.1429, max: 11.1429, min: 0.2169 },
    { date: todayStr, close: 10.0086, max: 11.1429, min: 0.2169 }
  ];
  `
);

fs.writeFileSync(path, content);
