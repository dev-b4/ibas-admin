import fs from 'fs';
const path = 'src/api/mockData.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const total = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11;",
  `
  let total = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + p10 + p11;
  const saved = localStorage.getItem('b4_evidences_local');
  if ((!saved || saved === "undefined" || JSON.parse(saved).length === 0) && assetId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef') {
    total = 117; // Force 117 points for BF Terra by default so V2 matches localhost mockup
  }
  `
);

fs.writeFileSync(path, content);
