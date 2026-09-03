import { useState, useEffect } from 'react';
import { LanguageProvider } from "./context/LanguageContext";
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Register from './components/Register';
import ProjectDetails from './components/ProjectDetails';
import { getSystemUsers } from './api/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import Login from './pages/Login';
import SetupTOTP from './pages/SetupTOTP';
import VerifyTOTP from './pages/VerifyTOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthGuard from './components/AuthGuard';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function AdminAuthWrapper({ children }) {
  const [authStatus, setAuthStatus] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {

        try {
          const savedEvs = localStorage.getItem('b4_evidences_local');
          if (savedEvs) {
            let parsed = JSON.parse(savedEvs);
            let updated = false;
            parsed.forEach(e => {
              if (e.source === "B4 Exchange") {
                e.source = "Ferramenta de acesso à informações registradas em blockchain.";
                updated = true;
              }
            });
            if (updated) {
              localStorage.setItem('b4_evidences_local', JSON.stringify(parsed));
              console.log('Updated all B4 Exchange sources');
            }
          }
        } catch(e) {}


        try {
          const savedEvs = localStorage.getItem('b4_evidences_local');
          if (savedEvs) {
            let parsed = JSON.parse(savedEvs);
            let beforeLen = parsed.length;
            parsed = parsed.filter(e => !(e.projetoId === '0x90192d63e476b7ce061c0dbbad10fde95c5e1514' && e.name === "Certificado do Crédito (Apoena Kaa)"));
            if (parsed.length !== beforeLen) {
              localStorage.setItem('b4_evidences_local', JSON.stringify(parsed));
              console.log('Cleaned up old bad Apoena Kaa seed name');
            }
          }
        } catch(e) {}


        // WIPE ALL CACHED OBLIGATIONS ON LOAD TO FORCE FRESH ONES
        try {
          const savedObs = localStorage.getItem('b4_obligations_v2');
          if (savedObs) {
            localStorage.removeItem('b4_obligations_v2');
            console.log('Wiped all cached obligations to refresh Pilar 1');
          }
        } catch(e) {}


    // ZERO OUT ALL OBLIGATIONS FOR OTHER PROJECTS SO THEY PULL FRESH DEFAULTS
    try {
      const savedObs = localStorage.getItem('b4_obligations_v2');
      if (savedObs && savedObs !== 'undefined') {
        let obs = JSON.parse(savedObs);
        let changedObs = false;
        for (const key in obs) {
          if (!key.startsWith('0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef')) {
            delete obs[key];
            changedObs = true;
          }
        }
        if (changedObs) {
          localStorage.setItem('b4_obligations_v2', JSON.stringify(obs));
          console.log('Zeroed out obligations for other projects to pull fresh defaults!');
        }
      }
    } catch(e) {}


    // HARD CLEANUP FOR PILAR 1 OBLIGATIONS
    try {
      const savedObs = localStorage.getItem('b4_obligations_v2');
      if (savedObs && savedObs !== 'undefined') {
        let obs = JSON.parse(savedObs);
        const key = '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef_1';
        if (obs[key] && obs[key].some(o => o.nome === 'Projetos de Preservação Florestal e Sequestro de Carbono' || o.nome === 'Indicadores de ODS')) {
          delete obs[key];
          localStorage.setItem('b4_obligations_v2', JSON.stringify(obs));
          console.log('Wiped BF Terra Pilar 1 obligations from local storage!');
        }
      }
    } catch(e) {}


    // FIX OLD NFT LINKS
    try {
      const saved = localStorage.getItem('b4_evidences_local');
      if (saved && saved !== 'undefined') {
        let evs = JSON.parse(saved);
        let c = false;
        evs = evs.map(e => {
          if (e.id === "nft_bfterra_1" && e.linkUrl === "https://b4.capital/pt/consulta-publica/#projeto/bft") {
            e.linkUrl = "https://b4.capital/pt/consulta-publica/#projeto/0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef/id/1";
            c = true;
          }
          if (e.id === "nft_bfterra_2" && e.linkUrl === "https://b4.capital/pt/consulta-publica/#projeto/bftII") {
            e.linkUrl = "https://b4.capital/pt/consulta-publica/#projeto/0x21031505ef6eda4c078da90bbc9fd5e4b1d120ff/id/1";
            c = true;
          }
          return e;
        });
        if (c) {
          localStorage.setItem('b4_evidences_local', JSON.stringify(evs));
        }
      }
    } catch(e) {}


    
        // COMPLIANCE EMAIL MIGRATION
        try {
          const saved = localStorage.getItem('b4_evidences_local');
          if (saved && saved !== 'undefined') {
            let localEvs = JSON.parse(saved);
            let localChanged = false;
            localEvs = localEvs.map(e => {
              if (e.user === 'mozart@b4.capital') {
                e.user = 'compliance@b4.capital';
                localChanged = true;
              }
              return e;
            });
            if (localChanged) {
              localStorage.setItem('b4_evidences_local', JSON.stringify(localEvs));
            }
          }
          
          const savedUsers = localStorage.getItem('b4_users');
          if (savedUsers) {
            let localUsers = JSON.parse(savedUsers);
            let usersChanged = false;
            localUsers = localUsers.map(u => {
              if (u.email === 'mozart@b4.capital') {
                u.email = 'compliance@b4.capital';
                usersChanged = true;
              }
              return u;
            });
            if (usersChanged) {
              localStorage.setItem('b4_users', JSON.stringify(localUsers));
            }
          }
          
          const sessionUser = sessionStorage.getItem('b4_user');
          if (sessionUser) {
            let su = JSON.parse(sessionUser);
            if (su.email === 'mozart@b4.capital') {
              su.email = 'compliance@b4.capital';
              sessionStorage.setItem('b4_user', JSON.stringify(su));
            }
          }
        } catch(e) {}

        // FIX TYPES BACK TO BLOCKCHAIN
    try {
      const saved = localStorage.getItem('b4_evidences_local');
      if (saved && saved !== 'undefined') {
        let evs = JSON.parse(saved);
        let c = false;
        evs = evs.map(e => {
          if (e.id === "nft_bfterra_1" || e.id === "nft_bfterra_2" || e.id === "token_bfterra") {
            if (e.type === "Link") {
              e.type = "Blockchain";
              c = true;
            }
          }
          return e;
        });
        if (c) {
          localStorage.setItem('b4_evidences_local', JSON.stringify(evs));
        }
      }
    } catch(e) {}


    // FIX OLD SEEDS THAT HAD "link" INSTEAD OF "linkUrl"
    try {
      const saved = localStorage.getItem('b4_evidences_local');
      if (saved && saved !== 'undefined') {
        let evs = JSON.parse(saved);
        let c = false;
        evs = evs.map(e => {
          if (e.id === "nft_bfterra_1" || e.id === "nft_bfterra_2" || e.id === "token_bfterra") {
            if (!e.linkUrl && e.link) {
              e.linkUrl = e.link;
              e.type = "Link";
              c = true;
            }
          }
          return e;
        });
        if (c) {
          localStorage.setItem('b4_evidences_local', JSON.stringify(evs));
        }
      }
    } catch(e) {}


    // HARD CLEANUP FOR LOCAL STORAGE OBLIGATIONS
    try {
      const savedObs = localStorage.getItem('b4_obligations_v2');
      if (savedObs && savedObs !== 'undefined') {
        let obs = JSON.parse(savedObs);
        const key = '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef_7';
        if (obs[key]) {
          delete obs[key];
          localStorage.setItem('b4_obligations_v2', JSON.stringify(obs));
          console.log('Wiped BF Terra Pilar 7 obligations from local storage!');
        }
      }
    } catch(e) {}


    // HARD CLEANUP FOR LOCAL STORAGE 
    try {
      const saved = localStorage.getItem('b4_evidences_local');
      if (saved && saved !== 'undefined') {
        let evs = JSON.parse(saved);
        let changed = false;
        evs = evs.filter(e => {
          if (e.projetoId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef' && Number(e.pilarNum) === 7) {
            const n = e.name || '';
            if (n.includes('Acesso ao Crédito de Carbono BFTERRAIII') ||
                n.includes('Certificado de Crédito de Carbono em formato NFT - BFTerra II') ||
                n.includes('Certificado de Crédito de Carbono em formato NFT - BFTerra I')) {
              changed = true;
              return false;
            }
          }
          return true;
        });
        
        // SEED THE 3 REAL EVIDENCES FOR BF TERRA P7 SO THEY COUNT FOR SCORE
        const pId = '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef';
        const hasNFT1 = evs.some(e => e.projetoId === pId && Number(e.pilarNum) === 7 && (e.name||'').includes('Certificado do Crédito (BF Terra I)'));
        if (!hasNFT1) {
          evs.push({
            id: "nft_bfterra_1", projetoId: pId, pilarNum: 7, name: "Certificado do Crédito (BF Terra I)", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "14/07/2025", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef/id/1"
          });
          changed = true;
        }
        const hasNFT2 = evs.some(e => e.projetoId === pId && Number(e.pilarNum) === 7 && (e.name||'').includes('Certificado do Crédito (BF Terra II)'));
        if (!hasNFT2) {
          evs.push({
            id: "nft_bfterra_2", projetoId: pId, pilarNum: 7, name: "Certificado do Crédito (BF Terra II)", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "14/07/2025", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x21031505ef6eda4c078da90bbc9fd5e4b1d120ff/id/1"
          });
          changed = true;
        }
        const hasToken = evs.some(e => e.projetoId === pId && Number(e.pilarNum) === 7 && (e.name||'').includes('Utility Token'));
        if (!hasToken) {
          evs.push({
            id: "token_bfterra", projetoId: pId, pilarNum: 7, name: "Utility Token", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "11/07/2025", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0x9f727a1350b11f6c0855ddf718ae8bc058a5342e#transactions"
          });
          changed = true;
        }

        
        const hasConsulta1 = evs.some(e => e.projetoId === pId && Number(e.pilarNum) === 7 && (e.name||'').includes('Consulta Pública (BF Terra I)'));
        if (!hasConsulta1) {
          evs.push({
            id: "consulta_bfterra_1", projetoId: pId, pilarNum: 7, name: "Consulta Pública (BF Terra I)", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "14/07/2025", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/bfti"
          });
          changed = true;
        }
        const hasConsulta2 = evs.some(e => e.projetoId === pId && Number(e.pilarNum) === 7 && (e.name||'').includes('Consulta Pública (BF Terra II)'));
        if (!hasConsulta2) {
          evs.push({
            id: "consulta_bfterra_2", projetoId: pId, pilarNum: 7, name: "Consulta Pública (BF Terra II)", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "14/07/2025", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/bftii"
          });
          changed = true;
        }

        
        // FIX BF TERRA PILAR 1 EVIDENCES
        const p1Id = '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef';
        let hasRelatorio = false;
        
        // Remove the old "Projetos de Preservação..." if it exists
        evs = evs.filter(e => {
          if (e.projetoId === p1Id && Number(e.pilarNum) === 1) {
             if ((e.name||'').includes('Projetos de Preservação')) {
               changed = true;
               return false;
             }
             if ((e.name||'').includes('Relatório de Impacto Socioambiental')) {
               hasRelatorio = true;
               e.linkUrl = "https://b4.capital/pt/projetos/bfterra_IeII/whitepaper.pdf";
               e.type = "Link";
               changed = true;
             }
          }
          return true;
        });

        if (!hasRelatorio) {
          evs.push({
            id: "relatorio_bfterra_1", projetoId: p1Id, pilarNum: 1, name: "Relatório de Impacto Socioambiental", type: "Link", source: "Auditoria Interna", status: "Validada", date: "14/07/2025", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/projetos/bfterra_IeII/whitepaper.pdf"
          });
          changed = true;
        }

        
        

        
        

        
        

        
        // APOENA KAA SEEDS
        const aId = '0x90192d63e476b7ce061c0dbbad10fde95c5e1514';
        if (!evs.some(e => e.projetoId === aId && e.id === "nft_apoena_1")) {
          evs.push({
            id: "nft_apoena_1", projetoId: aId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x90192d63e476b7ce061c0dbbad10fde95c5e1514/id/1", type: "Link"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === aId && e.id === "token_apoena")) {
          evs.push({
            id: "token_apoena", projetoId: aId, pilarNum: 7, name: "Utility Token", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0xd5660178319a151f780d3abcc82c1d12d2dc75ff#transactions", type: "Link"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === aId && e.id === "consulta_apoena")) {
          evs.push({
            id: "consulta_apoena", projetoId: aId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x90192d63e476b7ce061c0dbbad10fde95c5e1514"
          });
          changed = true;
        }


        // ARACÊ IBA SEEDS
        const araceId = '0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9';
        if (!evs.some(e => e.projetoId === araceId && e.id === "nft_arace_1")) {
          evs.push({
            id: "nft_arace_1", projetoId: araceId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9/id/1"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === araceId && e.id === "token_arace")) {
          evs.push({
            id: "token_arace", projetoId: araceId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0xc04c400a561befc37a8d4cfde7527d2f3c2928f7#transactions"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === araceId && e.id === "consulta_arace")) {
          evs.push({
            id: "consulta_arace", projetoId: araceId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/arace"
          });
          changed = true;
        }


        // DOWEDI MITIR SEEDS
        const dowediId = '0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62';
        if (!evs.some(e => e.projetoId === dowediId && e.id === "nft_dowedi_1")) {
          evs.push({
            id: "nft_dowedi_1", projetoId: dowediId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62/id/1"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === dowediId && e.id === "token_dowedi")) {
          evs.push({
            id: "token_dowedi", projetoId: dowediId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0x063af83a39e0e42111799d7d0ec9d8af7e3e75a2#transactions"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === dowediId && e.id === "consulta_dowedi")) {
          evs.push({
            id: "consulta_dowedi", projetoId: dowediId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62"
          });
          changed = true;
        }


        // OWIE BITIONI SEEDS
        const owieId = '0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b';
        if (!evs.some(e => e.projetoId === owieId && e.id === "nft_owie_1")) {
          evs.push({
            id: "nft_owie_1", projetoId: owieId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b/id/1"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === owieId && e.id === "token_owie")) {
          evs.push({
            id: "token_owie", projetoId: owieId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0x0938d6d82f7de771b1f0501891a88f9c9311d69e"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === owieId && e.id === "consulta_owie")) {
          evs.push({
            id: "consulta_owie", projetoId: owieId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b"
          });
          changed = true;
        }




        // TONCA SEEDS
        const toncaId = '0xd69f495fd95d429954a63196d499dcfe4f3c87f5';
        if (!evs.some(e => e.projetoId === toncaId && e.id === "nft_tonca_1")) {
          evs.push({
            id: "nft_tonca_1", projetoId: toncaId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xd69f495fd95d429954a63196d499dcfe4f3c87f5/id/5"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === toncaId && e.id === "token_tonca")) {
          evs.push({
            id: "token_tonca", projetoId: toncaId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0xaaf2b32576acfa581ab94b0144b33cd8cfd4f8b6#transactions"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === toncaId && e.id === "consulta_tonca")) {
          evs.push({
            id: "consulta_tonca", projetoId: toncaId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0xd69f495fd95d429954a63196d499dcfe4f3c87f5"
          });
          changed = true;
        }




        // YAKU SEEDS

        
        // RENAME R$100 reais
        evs = evs.map(e => {
          if (e.id === 'nft_yaku_1' && e.name === 'Certificado de PSA R$100 reais') {
            e.name = 'Certificado de PSA R$100';
            changed = true;
          }
          return e;
        });

        // YAKU FORCE VALIDATE
        evs = evs.map(e => {
          if (e.projetoId === '0x7466eb42b5b165d8b133a7040870b2da6c060546') {
            if (['nft_yaku_1', 'nft_yaku_2', 'nft_yaku_3', 'nft_yaku_4', 'token_yaku', 'consulta_yaku'].includes(e.id)) {
              if (e.status !== 'Validada') {
                e.status = 'Validada';
                changed = true;
              }
            }
          }
          return e;
        });

        const yakuId = '0x7466eb42b5b165d8b133a7040870b2da6c060546';

        if (!evs.some(e => e.projetoId === yakuId && e.id === "nft_yaku_1")) {
          evs.push({
            id: "nft_yaku_1", projetoId: yakuId, pilarNum: 7, name: "Certificado de PSA R$100", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/1"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === yakuId && e.id === "nft_yaku_2")) {
          evs.push({
            id: "nft_yaku_2", projetoId: yakuId, pilarNum: 7, name: "Certificado de PSA R$500", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/2"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === yakuId && e.id === "nft_yaku_3")) {
          evs.push({
            id: "nft_yaku_3", projetoId: yakuId, pilarNum: 7, name: "Certificado de PSA R$1.000", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/3"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === yakuId && e.id === "nft_yaku_4")) {
          evs.push({
            id: "nft_yaku_4", projetoId: yakuId, pilarNum: 7, name: "Certificado de PSA R$10.000", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/4"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === yakuId && e.id === "token_yaku")) {
          evs.push({
            id: "token_yaku", projetoId: yakuId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://polygonscan.com/token/0x66a4e18C37DA958EC1449E056477DfAd020CDd28#transactions"
          });
          changed = true;
        }
        if (!evs.some(e => e.projetoId === yakuId && e.id === "consulta_yaku")) {
          evs.push({
            id: "consulta_yaku", projetoId: yakuId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: "https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546"
          });
          changed = true;
        }

        if (changed) {
          localStorage.setItem('b4_evidences_local', JSON.stringify(evs));
          if (!sessionStorage.getItem('b4_app_reloaded')) {
            sessionStorage.setItem('b4_app_reloaded', 'true');
            window.location.reload();
          }
        }
      }
    } catch(e) {}

    const auth = sessionStorage.getItem('b4_admin_auth');
    if (auth === 'true') {
      setAuthStatus('true');
    } else if (auth === 'pending') {
      setAuthStatus('pending');
    }
  }, []);

  const handleLoginAs = (user) => {
    sessionStorage.setItem('b4_admin_auth', 'true');
    sessionStorage.setItem('b4_user', JSON.stringify(user));
    setAuthStatus('true');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('b4_admin_auth');
    sessionStorage.removeItem('b4_user');
    setAuthStatus('none');
  };

  if (authStatus === 'none') {
    const users = getSystemUsers();
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="text-[#150B2D] font-extrabold text-4xl tracking-tighter flex items-center justify-center gap-1 mb-6">
            B4<span className="text-sm font-semibold tracking-normal text-[#7C2DFF] mt-1 relative -top-2">CO2</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Simulação de Perfis</h1>
          <p className="text-slate-500 mb-8 text-sm">Escolha qual perfil deseja utilizar para testar as permissões de acesso.</p>
          
          <div className="space-y-3">
            {users.map(u => (
              <button 
                key={u.id}
                onClick={() => handleLoginAs(u)}
                className={`w-full flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all border ${u.role === 'Super Admin' || u.role === 'admin' ? 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'}`}
              >
                <span className="font-bold">{u.name}</span>
                <span className="text-xs opacity-70">{u.email}</span>
                <span className={`text-[10px] mt-1 uppercase font-bold px-2 py-0.5 rounded-full ${u.role === 'Super Admin' || u.role === 'admin' ? 'bg-purple-200 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>Perfil: {u.role}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              <Link to="/" className="text-purple-600 font-bold hover:underline">Voltar ao Site Público</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Conta em Análise</h1>
          <p className="text-slate-500 mb-8 text-sm">Seus dados e documentos de KYC foram enviados e estão aguardando aprovação pela equipe administrativa da B4. Você receberá um aviso assim que seu acesso for liberado.</p>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all text-sm"
          >
            Sair e voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return children;
}


function GlobalAuthWrapper({ children }) {
  // Autenticação removida conforme solicitado
  return children;
}


function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}}><PublicLayout><Dashboard /></PublicLayout></motion.div>} />
        <Route path="/projeto/:id" element={<motion.div initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} transition={{duration:0.3}}><PublicLayout><ProjectDetails /></PublicLayout></motion.div>} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/setup-totp" element={<AuthGuard><SetupTOTP /></AuthGuard>} />
        <Route path="/verify-totp" element={<AuthGuard><VerifyTOTP /></AuthGuard>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:1.05}} transition={{duration:0.3}}><AdminAuthWrapper><AdminPanel /></AdminAuthWrapper></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}


function Preloader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <img src="./ibas-logo.png" alt="IBAS Logo" className="w-32 md:w-48 object-contain" />
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="h-1 bg-[#7C2DFF] rounded-full mt-4"
      />
    </motion.div>
  );
}

function App() {
  const [loadingApp, setLoadingApp] = useState(true);

  return (
    <GlobalAuthWrapper>
      <AnimatePresence>{loadingApp && <Preloader onComplete={() => setLoadingApp(false)} />}</AnimatePresence>
      {!loadingApp && (
      <LanguageProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </LanguageProvider>
    )}
    </GlobalAuthWrapper>
  );
}

export default App;
