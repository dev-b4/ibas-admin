import { getEvidences, generateAcreditationScore } from './src/api/mockData.js';
try {
  const score = generateAcreditationScore(0, '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef');
  console.log("Score:", score);
} catch (e) {
  console.error("Crash:", e);
}
