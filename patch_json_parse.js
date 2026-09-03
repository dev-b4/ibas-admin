import fs from 'fs';
const file = 'src/api/mockData.js';
let content = fs.readFileSync(file, 'utf8');

// Replace all JSON.parse(saved) outside of try-catch blocks with safe parsing.
// Actually, it's easier to just find the getActionLogs and fix it.
const oldGetActionLogs = `export const getActionLogs = () => {
  const saved = localStorage.getItem('b4_action_logs');
  
  if (saved && saved !== "undefined") {
    const p = JSON.parse(saved);
    if (p.length > 0) return p;
  }`;

const newGetActionLogs = `export const getActionLogs = () => {
  const saved = localStorage.getItem('b4_action_logs');
  
  if (saved && saved !== "undefined") {
    try {
      const p = JSON.parse(saved);
      if (p.length > 0) return p;
    } catch(e) {}
  }`;

content = content.replace(oldGetActionLogs, newGetActionLogs);

const oldGetSystemUsers = `export const getSystemUsers = () => {
  const saved = localStorage.getItem('b4_users');
  if (saved) return JSON.parse(saved);`;

const newGetSystemUsers = `export const getSystemUsers = () => {
  const saved = localStorage.getItem('b4_users');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }`;

content = content.replace(oldGetSystemUsers, newGetSystemUsers);

const oldGetObligations = `export const getObligations = (projetoId, pilarNum) => {
  const saved = localStorage.getItem('b4_obligations_v2');
  let allObs = saved ? JSON.parse(saved) : {};`;

const newGetObligations = `export const getObligations = (projetoId, pilarNum) => {
  const saved = localStorage.getItem('b4_obligations_v2');
  let allObs = {};
  if (saved && saved !== "undefined") {
    try { allObs = JSON.parse(saved); } catch(e) {}
  }`;

content = content.replace(oldGetObligations, newGetObligations);

const oldSaveObligations = `export const saveObligations = (projetoId, pilarNum, obligationsArray) => {
  const saved = localStorage.getItem('b4_obligations_v2');
  let allObs = saved ? JSON.parse(saved) : {};`;

const newSaveObligations = `export const saveObligations = (projetoId, pilarNum, obligationsArray) => {
  const saved = localStorage.getItem('b4_obligations_v2');
  let allObs = {};
  if (saved && saved !== "undefined") {
    try { allObs = JSON.parse(saved); } catch(e) {}
  }`;

content = content.replace(oldSaveObligations, newSaveObligations);

const oldGetIbasHistory = `  // Fallback se estiver vazio
  const saved = localStorage.getItem('b4_ibas_history');
  return saved ? JSON.parse(saved) : [];`;

const newGetIbasHistory = `  // Fallback se estiver vazio
  const saved = localStorage.getItem('b4_ibas_history');
  if (saved && saved !== "undefined") {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return [];`;

content = content.replace(oldGetIbasHistory, newGetIbasHistory);

const oldScoreCheck = `  const saved = localStorage.getItem('b4_evidences_local');
  if ((!saved || saved === "undefined" || JSON.parse(saved).length === 0) && assetId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef') {
    total = 117; // Force 117 points for BF Terra by default so V2 matches localhost mockup
  }`;

const newScoreCheck = `  const saved = localStorage.getItem('b4_evidences_local');
  let isEmpty = !saved || saved === "undefined";
  if (!isEmpty) {
    try { isEmpty = JSON.parse(saved).length === 0; } catch(e) { isEmpty = true; }
  }
  if (isEmpty && assetId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef') {
    total = 117; // Force 117 points for BF Terra by default so V2 matches localhost mockup
  }`;

content = content.replace(oldScoreCheck, newScoreCheck);

fs.writeFileSync(file, content);
console.log("Patched mockData.js with safe JSON.parse");
