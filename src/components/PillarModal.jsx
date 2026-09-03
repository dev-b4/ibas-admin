import React from 'react';
import { X, ExternalLink, Globe, Leaf, Users, DollarSign, Target, Activity, FileText, Info, Link as LinkIcon } from 'lucide-react';
import { getObligations, getEvidences } from '../api/mockData';
import { useState, useEffect } from 'react';
import EvidencesLogModal from './EvidencesLogModal';
import { useLanguage } from "../context/LanguageContext";
import { mockTranslations } from "../locales/mockTranslations";


const projectAssets = {
  '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef': { // BF Terra
    nfts: [
      {
        title: 'BF Terra I',
        image: '/assets/nft_bfterra_1.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef/id/1',
        date: '14 de Julho de 2025'
      },
      {
        title: 'BF Terra II',
        image: '/assets/nft_bfterra_2.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/bftII',
        date: '14 de Julho de 2025'
      }
    ],
    token: {
      title: 'BF Terra (BFTIII)',
      image: '/assets/bfterra_moeda.png',
      link: 'https://polygonscan.com/token/0x9f727a1350b11f6c0855ddf718ae8bc058a5342e#transactions',
      qty: '1,368,685.34',
      date: '11 de Julho de 2025'
    }
  },
  '0x90192d63e476b7ce061c0dbbad10fde95c5e1514': { // Apoena Kaa
    nfts: [
      {
        title: 'Apoena Kaa',
        image: '/assets/apoena-kaa-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0x90192d63e476b7ce061c0dbbad10fde95c5e1514/id/1',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Apoena Kaa Coin',
      image: '/apoena-kaa-coin.png',
      link: 'https://polygonscan.com/token/0xd5660178319a151f780d3abcc82c1d12d2dc75ff#transactions',
      qty: '1.655.674,86',
      date: '01 de Setembro de 2026'
    }
  },
  '0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9': { // Aracê Iba
    nfts: [
      {
        title: 'Aracê Iba',
        image: '/assets/arace-iba-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9/id/1',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Ativo Sustentável',
      image: '/arace-iba-coin.png',
      link: 'https://polygonscan.com/token/0xc04c400a561befc37a8d4cfde7527d2f3c2928f7#transactions',
      qty: '3.714.728,34',
      date: '01 de Setembro de 2026'
    }
  },
  '0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62': { // Dowedi Mitir
    nfts: [
      {
        title: 'Dowedi Mitir',
        image: '/assets/dowedi-mitir-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62/id/1',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Ativo Sustentável',
      image: '/dowedi-coin.png',
      link: 'https://polygonscan.com/token/0x063af83a39e0e42111799d7d0ec9d8af7e3e75a2#transactions',
      qty: '30.547',
      date: '01 de Setembro de 2026'
    }
  },
  '0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b': { // Owie Bitioni
    nfts: [
      {
        title: 'Owie Bitioni',
        image: '/assets/owie-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b/id/1',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Ativo Sustentável',
      image: '/owie-bitioni-coin.png',
      link: 'https://polygonscan.com/token/0x0938d6d82f7de771b1f0501891a88f9c9311d69e',
      qty: '363.823',
      date: '01 de Setembro de 2026'
    }
  },
  '0xd69f495fd95d429954a63196d499dcfe4f3c87f5': { // Tonca
    nfts: [
      {
        title: 'Tonca',
        image: '/assets/tonca-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0xd69f495fd95d429954a63196d499dcfe4f3c87f5/id/5',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Ativo Sustentável',
      image: '/tonca-coin.png',
      link: 'https://polygonscan.com/token/0xaaf2b32576acfa581ab94b0144b33cd8cfd4f8b6#transactions',
      qty: '8.847.687',
      date: '01 de Setembro de 2026'
    }
  },
  '0x7466eb42b5b165d8b133a7040870b2da6c060546': { // Yaku
    nfts: [
      {
        title: 'Certificado de PSA R$100',
        image: '/assets/yaku-100-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/1',
        date: '01 de Setembro de 2026'
      },
      {
        title: 'Certificado de PSA R$500',
        image: '/assets/yaku-500-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/2',
        date: '01 de Setembro de 2026'
      },
      {
        title: 'Certificado de PSA R$1.000',
        image: '/assets/yaku-1k-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/3',
        date: '01 de Setembro de 2026'
      },
      {
        title: 'Certificado de PSA R$10.000',
        image: '/assets/yaku-10k-nft.png',
        link: 'https://b4.capital/pt/consulta-publica/#projeto/0x7466eb42b5b165d8b133a7040870b2da6c060546/id/4',
        date: '01 de Setembro de 2026'
      }
    ],
    token: {
      title: 'Ativo Sustentável',
      image: '/yaku-coin.png',
      link: 'https://polygonscan.com/token/0x66a4e18C37DA958EC1449E056477DfAd020CDd28#transactions',
      qty: '610.510',
      date: '01 de Setembro de 2026'
    }
  }
};
// Aliases: new Supabase IDs for Dowedi Mitir and Owie Bitioni point to the same data
projectAssets['0x56cb7b3b1b4a57e8d5e3bf3b72e9f1d29c7a1234'] = projectAssets['0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62'];
projectAssets['0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0'] = projectAssets['0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b'];


export default function PillarModal({ pillar, projetoId, onClose }) {
  const { t, language } = useLanguage();
  const [isLogOpen, setIsLogOpen] = useState(false);

  // FORCE SEED EVIDENCES IF MISSING (Safeguard)
  useEffect(() => {
    if ((projetoId === '0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9' || projetoId === '0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62' || projetoId === '0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b' || projetoId === '0xd69f495fd95d429954a63196d499dcfe4f3c87f5') && Number(pillar.num) === 7) {
      try {
        let evs = JSON.parse(localStorage.getItem('b4_evidences_local') || "[]");
        let changed = false;
        const pAssets = projectAssets[projetoId];
        const isArace = projetoId === '0xc8b8b674a6bab9cb09b4a660b8993035c1d923b9';
        const isDowedi = projetoId === '0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62';
        const isOwie = projetoId === '0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b';
        const isTonca = projetoId === '0xd69f495fd95d429954a63196d499dcfe4f3c87f5';
        const pref = isArace ? 'arace' : isDowedi ? 'dowedi' : isOwie ? 'owie' : 'tonca';
        
        const consultaUrl = isArace ? 'https://b4.capital/pt/consulta-publica/#projeto/arace' : isDowedi ? 'https://b4.capital/pt/consulta-publica/#projeto/0xfe7dee81b1a416068a5ce01f3489bd5c9996ae62' : isOwie ? 'https://b4.capital/pt/consulta-publica/#projeto/0xc84fc3cdc3c6d0713ecc6008e50efcffc9b14b3b' : 'https://b4.capital/pt/consulta-publica/#projeto/0xd69f495fd95d429954a63196d499dcfe4f3c87f5';

        if (pAssets) {
          if (!evs.some(e => e.projetoId === projetoId && e.id === `nft_${pref}_1`)) {
            evs.push({
              id: `nft_${pref}_1`, projetoId, pilarNum: 7, name: "Certificado do Crédito", type: "Blockchain", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: pAssets.nfts[0].link
            });
            changed = true;
          }
          if (!evs.some(e => e.projetoId === projetoId && e.id === `token_${pref}`)) {
            evs.push({
              id: `token_${pref}`, projetoId, pilarNum: 7, name: "Utility Token", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: pAssets.token.link
            });
            changed = true;
          }
          if (!evs.some(e => e.projetoId === projetoId && e.id === `consulta_${pref}`)) {
            evs.push({
              id: `consulta_${pref}`, projetoId, pilarNum: 7, name: "Consulta Pública", type: "Link", source: "Ferramenta de acesso à informações registradas em blockchain.", status: "Validada", date: "01/09/2026", user: "compliance@b4.capital", linkUrl: consultaUrl
            });
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem('b4_evidences_local', JSON.stringify(evs));
          window.location.reload(); // Force reload to show points
        }
      } catch(e) {}
    }
  }, [projetoId, pillar]);


  const translateMock = (text) => {
    if (language === 'pt') return text;
    const dict = {
      'Certificado de Crédito de Carbono NFT': 'NFT Carbon Credit Certificate',
      'Certificado do Crédito de Carbono': 'Carbon Credit Certificate',
      'Link do Explorer (Acesso ao Crédito)': 'Explorer Link (Credit Access)',
      'Contrato Inteligente no Polygonscan': 'Smart Contract on Polygonscan',
      'Token ERC-721 representando o crédito de carbono registrado na Blockchain Polygon': 'ERC-721 Token representing the carbon credit registered on the Polygon Blockchain',
      'Verificação on-chain do contrato do token na rede Polygon': 'On-chain verification of the token contract on the Polygon network',
      'Aguardando...': 'Waiting...',
      'Aguardando': 'Waiting',
      'Laudo': 'Report',
      'Documento': 'Document',
      'Documento Adicional': 'Additional Document',
      'Projetos de Preservação Florestal e Sequestro de Carbono': 'Forest Preservation and Carbon Sequestration Projects',
      'Avaliação de impactos ambientais e sociais do projeto': 'Assessment of environmental and social impacts of the project',
      'Avalie os registros imutáveis dos ativos sustentáveis do projeto, assegurando segurança, transparência e rastreabilidade em cada etapa.': 'Evaluate the immutable records of the project\'s sustainable assets, ensuring security, transparency, and traceability at each stage.',
      'Em Análise': 'In Analysis',
      'Registrado': 'Registered',
      'Pilar': 'Pillar',
      'Ver Documento': 'View Document',
      'Ver Log de Alterações': 'View Change Log',

      'Auditoria Independente': 'Independent Auditing',
      'Relatório de Auditoria Independente': 'Independent Audit Report',
      'Avaliação independente das métricas de sequestro de carbono.': 'Independent evaluation of carbon sequestration metrics.',
      'Auditoria de Impacto Social': 'Social Impact Audit',
      'Avaliação das condições da comunidade local.': 'Evaluation of local community conditions.',

      'Evidências de': 'Evidences of'
    };
    return dict[text] || mockTranslations[text] || text;
  };

  
  let evidenciasParaMostrar = [];
  try {
    evidenciasParaMostrar = getEvidences().filter(e => e.projetoId === projetoId && e.pilarNum === pillar.num && e.status === 'Validada');
  } catch(e) {}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-[95%] md:w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-start p-8 border-b border-slate-100">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <Leaf size={32} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{translateMock('Pilar')} {pillar.num}</p>
              <h2 className="text-2xl font-bold text-[#150B2D]">{t(`pillars.${pillar.title}`)}</h2>
              <p className="text-sm text-slate-500 mt-1">Avalie os registros imutáveis dos ativos sustentáveis do projeto, assegurando segurança, transparência e rastreabilidade em cada etapa.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-3xl font-black text-emerald-500">{pillar.score}</span>
                <span className="text-sm font-bold text-slate-400">/100 pts</span>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded inline-block mt-1">Excelente</span>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Resultado da Avaliação */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Resultado da Avaliação</h3>
            {Number(pillar.num) === 7 && (
              <>
              
              
              {(() => {
                const pData = projectAssets[projetoId];
                if (pData) {
                  return (
                    <div className={"grid grid-cols-1 gap-4 mb-4 " + (pData.nfts.length === 2 ? "md:grid-cols-3" : "md:grid-cols-2")}>
                      {pData.nfts.map((nft, i) => (
                        <div key={'nft'+i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-full hover:border-emerald-400 hover:shadow-md transition-all group relative overflow-hidden">
                          <div className="w-full h-80 shrink-0 rounded-xl overflow-hidden relative bg-slate-50 flex items-center justify-center">
                            <img src={nft.image} alt={nft.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                               <div className="bg-white text-emerald-600 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all flex items-center gap-2 font-bold text-xs">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                                 Ver Certificado
                               </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">NFT</span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-base mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{nft.title}</h4>
                              <p className="text-xs text-slate-500 leading-snug">{projetoId === '0x7466eb42b5b165d8b133a7040870b2da6c060546' ? 'Certificado de PSA' : 'Certificado do Crédito de Carbono'}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <div className="bg-emerald-50 text-emerald-500 p-1.5 rounded-lg group-hover:bg-emerald-100 transition-colors"><Activity size={12}/></div>
                                <div>
                                  <p className="text-[9px] text-slate-400 uppercase font-bold">Registrado em</p>
                                  <p className="text-[11px] font-bold text-slate-700">{nft.date}</p>
                                </div>
                              </div>
                              <a href={nft.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors">
                                <ExternalLink size={12} /> Acesso ao Certificado
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-full relative overflow-hidden group">
                        <div className="w-full h-80 shrink-0 rounded-xl overflow-hidden relative bg-slate-50 flex items-center justify-center p-8">
                          <img src={pData.token.image} alt={pData.token.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Utility Token</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{pData.token.title}</h4>
                            <p className="text-xs text-slate-500 leading-snug">Quantidade Total: <span className="font-black text-emerald-500">{pData.token.qty}</span></p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-emerald-50 text-emerald-500 p-1.5 rounded-lg group-hover:bg-emerald-100 transition-colors"><Activity size={12}/></div>
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Registrado em</p>
                                <p className="text-[11px] font-bold text-slate-700">{pData.token.date}</p>
                              </div>
                            </div>
                            <a href={pData.token.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors">
                              <ExternalLink size={12} /> Acesso ao Ativo Sustentável
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-4">
                      {/* NFT Placeholder */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-full relative overflow-hidden">
                        <div className="w-full h-80 shrink-0 rounded-xl overflow-hidden relative bg-slate-50 flex items-center justify-center border border-dashed border-slate-300">
                          <Leaf size={48} className="text-slate-200" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">NFT</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base mb-1 leading-tight">Certificado do Crédito de Carbono</h4>
                            <p className="text-xs text-slate-500 leading-snug">Representação digital e blockchain</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3 opacity-50">
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-100 text-slate-400 p-1.5 rounded-lg"><Activity size={12}/></div>
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Registro</p>
                                <p className="text-[11px] font-bold text-slate-500">{t('modal.pending')} de emissão</p>
                              </div>
                            </div>
                            <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 text-slate-400 rounded-lg text-xs font-bold bg-slate-50 cursor-not-allowed">
                              <ExternalLink size={12} /> Acesso ao Certificado
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Token Placeholder */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-full relative overflow-hidden group">
                        <div className="w-full h-80 shrink-0 rounded-xl overflow-hidden relative bg-slate-50 flex items-center justify-center p-8 border border-dashed border-slate-300">
                           <Target size={48} className="text-slate-200" />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">Utility Token</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base mb-1 leading-tight">Ativo Sustentável</h4>
                            <p className="text-xs text-slate-500 leading-snug">Quantidade Total: <span className="font-black text-slate-400">-</span></p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3 opacity-50">
                            <div className="flex items-center gap-2">
                              <div className="bg-slate-100 text-slate-400 p-1.5 rounded-lg"><Activity size={12}/></div>
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Registro</p>
                                <p className="text-[11px] font-bold text-slate-500">{t('modal.pending')} de emissão</p>
                              </div>
                            </div>
                            <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 text-slate-400 rounded-lg text-xs font-bold bg-slate-50 cursor-not-allowed">
                              <ExternalLink size={12} /> Ativo Sustentável
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
              
              </>
            )}

            {/* Standard Obligations grid for ALL pillars */}
            {(() => {
              const isBfPilar1 = projetoId === "0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef" && pillar.num === 1;
                
                // Pull real docs from Supabase cache for this pillar
                let realDocs = [];
                try {
                  realDocs = getEvidences().filter(e => e.projetoId === projetoId && e.pilarNum === pillar.num);

// FORCE REMOVE DUPLICATES/OLD NFTs FOR BF TERRA P7
if (projetoId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef' && Number(pillar.num) === 7) {
  realDocs = realDocs.filter(e => {
    const n = e.name || '';
    if (n.includes('Acesso ao Crédito de Carbono BFTERRAIII')) return false;
    if (n.includes('Certificado de Crédito de Carbono em formato NFT - BFTerra II')) return false;
    if (n.includes('Certificado de Crédito de Carbono em formato NFT - BFTerra I')) return false;
    return true;
  });
}

                } catch(e) {}

                // Dynamic slots based on Obligations
                let obs = getObligations(projetoId, pillar.num);
                if (Number(pillar.num) === 7) {
                  // Pilar 7 top section already shows NFTs + Token via projectAssets
                  // Only show remaining obligation slots (Auditoria Smartcontract etc.) that aren't in projectAssets
                  const alreadyShown = ['Certificado do Crédito', 'Certificado de PSA R$100', 'Certificado de PSA R$500', 'Certificado de PSA R$1.000', 'Certificado de PSA R$10.000', 'Certificado do Crédito (BF Terra I)', 'Certificado do Crédito (BF Terra II)', 'Certificado de Crédito de Carbono NFT', 'Contrato Inteligente no Polygonscan', 'Utility Token', 'Consulta Pública', 'Consulta Pública (BF Terra I)', 'Consulta Pública (BF Terra II)'];
                  obs = obs.filter(o => !alreadyShown.some(s => o.nome.includes(s)));
                  realDocs = realDocs.filter(e => !alreadyShown.some(s => e.name.includes(s)));
                }

                const slots = [];
                const limit = obs.length;
                for (let i = 0; i < limit; i++) {
                  const ob = obs[i];
                  slots.push({
                    label: translateMock('Documento'),
                    defaultTitle: ob ? ob.nome : translateMock('Aguardando...'),
                    defaultDesc: ob ? ob.desc : '—',
                    defaultDate: null,
                    defaultUrl: null,
                    defaultReady: false,
                  });
                }

                // Merge real docs into slots by matching names/titles instead of raw index
                const matchedReals = new Set();
                
                const docs = slots.map((slot) => {
                  // Find a real doc that matches the slot's default title
                  let real = realDocs.find(r => r.name === slot.defaultTitle);
                  
                  if (real) {
                    matchedReals.add(real);
                    return {
                      label: real.type || slot.label,
                      title: real.name || slot.defaultTitle,
                      desc: real.desc || real.source || slot.defaultDesc,
                      date: real.date || slot.defaultDate,
                      url: real.linkUrl || real.fileUrl || real.url || real.link || slot.defaultUrl,
                      socialLinks: real.socialLinks,
                      ready: real.status === 'Validada' || real.status === 'Em Análise' || !!real.name,
                      status: real.status,
                    };
                  }
                  return {
                    label: slot.label,
                    title: slot.defaultTitle,
                    desc: slot.defaultDesc,
                    date: slot.defaultDate,
                    url: slot.defaultUrl,
                    ready: slot.defaultReady,
                    status: slot.defaultReady ? 'Validada' : null,
                  };
                });

                // Add any extra uploaded evidences that didn't match a slot
                for (const real of realDocs) {
                  if (!matchedReals.has(real)) {
                    docs.push({
                      label: real.type || translateMock('Documento'),
                      title: real.name || translateMock('Documento Adicional'),
                      desc: real.desc || real.source || '—',
                      date: real.date || null,
                      url: real.linkUrl || real.fileUrl || real.url || real.link || null,
                      ready: real.status === 'Validada' || real.status === 'Em Análise' || !!real.name,
                      status: real.status,
                    });
                  }
                }

                // Sort docs to show 'ready' (active) ones first
                
                docs.sort((a, b) => (b.ready ? 1 : 0) - (a.ready ? 1 : 0));
                
                let visibleDocs = docs;
                if (projetoId === '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef' && Number(pillar.num) === 7) {
                  visibleDocs = docs.filter(d => {
                    const t = d.title || '';
                    if (t.includes('Certificado do Crédito (BF Terra I)')) return false;
                    if (t.includes('Certificado do Crédito (BF Terra II)')) return false;
                    if (t.includes('Utility Token')) return false;
                    return true;
                  });
                }


                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {visibleDocs.map((doc, i) => (
                      <div key={i} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-full relative overflow-hidden transition-all ${doc.ready ? 'border-slate-200 hover:border-emerald-400 hover:shadow-md group' : 'border-dashed border-slate-200'}`}>
                        <div className={`w-full h-64 shrink-0 rounded-xl overflow-hidden relative flex items-center justify-center ${doc.ready ? 'bg-emerald-50' : 'bg-slate-50 border border-dashed border-slate-200'}`}>
                          {doc.ready ? (
                            <div className="flex flex-col items-center gap-3 p-6 text-center">
                              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                                <FileText size={32} />
                              </div>
                              {(() => {
                                const title = (doc && doc.title && typeof doc.title === 'string') ? (translateMock(doc.title) || '') : '';
                                let main = title;
                                let sub = '';
                                if (title.includes(' (')) {
                                  const p = title.split(' (');
                                  main = p[0];
                                  sub = '(' + p[1];
                                }
                                const formatMain = (m) => {
                                  if (m === 'Rastreabilidade do Plano Público') return <><span className="block">Rastreabilidade do</span><span className="block">Plano Público</span></>;
                                  if (m === 'Certificado do Crédito de Carbono') return <><span className="block">Certificado do</span><span className="block">Crédito de Carbono</span></>;
                                  return m;
                                };
                                return (
                                  <p className="text-xs font-bold text-emerald-700 leading-snug flex flex-col items-center">
                                    <span>{formatMain(main)}</span>
                                    {sub && <span className="text-[10px] text-emerald-600/70 font-semibold mt-1">{sub}</span>}
                                  </p>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 p-6 text-center">
                              <Leaf size={40} className="text-slate-200" />
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{translateMock('Aguardando')}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${doc.ready ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>{translateMock(doc.label)}</span>
                              {doc.ready && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${doc.status === 'Validada' ? 'text-emerald-500 bg-emerald-50' : doc.status === 'Em Análise' ? 'text-amber-500 bg-amber-50' : 'text-blue-500 bg-blue-50'}`}>{doc.status === 'Validada' ? `✓ ${t('modal.validated')}` : doc.status === 'Em Análise' ? `⏳ ${translateMock('Em Análise')}` : `📄 ${translateMock('Registrado')}`}</span>}
                            </div>
                            <h4 className={`font-bold text-base mb-1 leading-tight ${doc.ready ? 'text-slate-800' : 'text-slate-400'}`}>{translateMock(doc.title)}</h4>
                            <p className="text-xs text-slate-400 leading-snug">{translateMock(doc.desc)}</p>
                          </div>
                          <div className={`mt-4 pt-3 border-t border-slate-100 flex flex-col gap-3 ${!doc.ready ? 'opacity-40' : ''}`}>
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${doc.ready ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}><Activity size={12}/></div>
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Registrado em</p>
                                <p className={`text-[11px] font-bold ${doc.ready ? 'text-slate-700' : 'text-slate-400'}`}>{doc.date || t('modal.pending')}</p>
                              </div>
                            </div>
                            {doc.ready ? (
                              doc.label === 'Redes Sociais' && Array.isArray(doc.socialLinks) ? (
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                                  {doc.socialLinks.map((url, sIdx) => {
                                    if (!url || typeof url !== 'string') return null;
                                    const lUrl = url.toLowerCase();
                                    if (lUrl.includes('instagram.com')) {
                                      return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>;
                                    }
                                    if (lUrl.includes('linkedin.com')) {
                                      return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>;
                                    }
                                    if (lUrl.includes('twitter.com') || lUrl.includes('x.com')) {
                                      return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white rounded-full transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>;
                                    }
                                    return <a key={sIdx} href={url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white rounded-full transition-colors"><Globe size={16}/></a>;
                                  })}
                                </div>
                              ) : (
                                <a href={doc.url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-emerald-200 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors">
                                  <ExternalLink size={12} /> Ver Documento
                                </a>
                              )
                            ) : (
                              <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 text-slate-400 rounded-lg text-xs font-bold bg-slate-50 cursor-not-allowed">
                                <ExternalLink size={12} /> Aguardando
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            }
          </div>


          

          
        </div>
      </div>
      
      {isLogOpen && (
        <EvidencesLogModal 
          isOpen={isLogOpen} 
          onClose={() => setIsLogOpen(false)} 
          pillarName={t(`pillars.${pillar.title}`)}
          projetoId={projetoId}
          pillarNum={pillar.num}
        />
      )}
    </div>
  );
}
              