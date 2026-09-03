import fs from 'fs';
const file = 'src/components/AdminPanel.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldImport = "import { fetchIbasData, mockEvidences, getEvidences, calculatePilarScore, getObligations, saveObligations, logAction, getActionLogs, getSystemUsers, saveSystemUsers, defaultPilarObligations } from '../api/mockData';";

const newImport = "import { fetchIbasData, mockEvidences, getEvidences, calculatePilarScore, getObligations, saveObligations, logAction, getActionLogs, getSystemUsers, saveSystemUsers, defaultPilarObligations, addEvidenceToCache, updateEvidenceInCache, removeEvidenceFromCache, generateAcreditationScore } from '../api/mockData';";

content = content.replace(oldImport, newImport);

fs.writeFileSync(file, content);
console.log("Patched imports in AdminPanel");
