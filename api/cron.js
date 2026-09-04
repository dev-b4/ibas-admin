// api/cron.js — Vercel Serverless Cron
// Dispara todo dia às 17h36 (Brasília) e salva snapshot completo no Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALCHEMY_TIMEOUT_MS = 5000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SPECIAL_OBLIGATIONS = {
  '0xc88d4860d4ddb7a7621b4a919360b4775d93a5ef_7': 6,
  '0x7466eb42b5b165d8b133a7040870b2da6c060546_7': 7,
};
const DEFAULT_OBS_COUNT = { 1:4, 2:4, 3:4, 4:4, 5:4, 6:4, 7:4, 8:4, 9:4, 10:5, 11:5 };

function getObligationCount(projetoId, pilarNum) {
  const key = `${projetoId}_${pilarNum}`;
  return SPECIAL_OBLIGATIONS[key] || DEFAULT_OBS_COUNT[pilarNum] || 4;
}

function calcPilar(projetoId, pilarNum, evidences, maxScore) {
  const evs = evidences.filter(e => e.projeto_id === projetoId && e.pilar_num === pilarNum && e.status === 'Validada');
  if (evs.length === 0) return 0;
  const required = getObligationCount(projetoId, pilarNum);
  return Math.min(maxScore, Math.round(evs.length * (maxScore / required)));
}

function generateScore(projetoId, evidences) {
  const scores = {
    p1:  calcPilar(projetoId, 1, evidences, 100),
    p2:  calcPilar(projetoId, 2, evidences, 100),
    p3:  calcPilar(projetoId, 3, evidences, 100),
    p4:  calcPilar(projetoId, 4, evidences, 100),
    p5:  calcPilar(projetoId, 5, evidences, 100),
    p6:  calcPilar(projetoId, 6, evidences, 100),
    p7:  calcPilar(projetoId, 7, evidences, 100),
    p8:  calcPilar(projetoId, 8, evidences, 100),
    p9:  calcPilar(projetoId, 9, evidences, 100),
    p10: calcPilar(projetoId, 10, evidences, 50),
    p11: calcPilar(projetoId, 11, evidences, 50),
  };
  scores.total = Object.values(scores).reduce((a, b) => a + b, 0);
  return scores;
}

async function fetchCompensado(address) {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ALCHEMY_TIMEOUT_MS);
    const url = `https://polygon-mainnet.g.alchemy.com/v2/demo/getNFTsForCollection?contractAddress=${address}&withMetadata=true`;
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    let total = 0;
    for (const nft of (data.nfts || [])) {
      const attr = (nft.metadata?.attributes || []).find(a => a.trait_type === 'Compensação' || a.trait_type === 'Compensado');
      if (attr) total += parseFloat(attr.value) || 0;
    }
    return total;
  } catch { return 0; }
}

async function fetchPtax() {
  try {
    const today = new Date();
    const d = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}-${today.getFullYear()}`;
    const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${d}'&$top=1&$format=json`);
    const data = await res.json();
    if (data?.value?.length > 0) return data.value[data.value.length - 1].cotacaoVenda;
  } catch {}
  return 5.1625;
}

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`[IBAS CRON] Snapshot do dia ${today}...`);

    const [{ data: projects }, { data: evidences }] = await Promise.all([
      supabase.from('projects').select('*'),
      supabase.from('evidences').select('*'),
    ]);

    const ptax = await fetchPtax();

    const isListed  = s => ['Listado', 'Listed'].includes(s);
    const isCustody = s => ['Em Custódia', 'Custódia', 'Custodiado', 'Custodied'].includes(s);
    const validProjs = projects.filter(p => isListed(p.status) || isCustody(p.status));

    const totalListed   = validProjs.filter(p => isListed(p.status)).length;
    const totalCustody  = validProjs.filter(p => isCustody(p.status)).length;
    const totalProjects = validProjs.length;

    let listedWeight = 0, custodyWeight = 0;
    if (totalListed === 0)        custodyWeight = 1 / totalCustody;
    else if (totalCustody === 0)  listedWeight  = 1 / totalListed;
    else {
      const base = 1 / totalProjects;
      custodyWeight = base / 2;
      listedWeight  = (1 - custodyWeight * totalCustody) / totalListed;
    }
    const getWeight = s => isListed(s) ? listedWeight : isCustody(s) ? custodyWeight : 0;

    const compensations = {};
    await Promise.all(validProjs.map(async p => {
      compensations[p.id] = p.id.startsWith('0x') ? await fetchCompensado(p.id) : 0;
    }));

    const projectData = validProjs.map(p => {
      const scores  = generateScore(p.id, evidences);
      const peso    = getWeight(p.status);
      const comp    = compensations[p.id] || 0;
      const bonus   = comp / 1000;
      const impacto = ((scores.total * peso) / 1.67) + bonus;
      return { p, scores, peso, comp, bonus, impacto };
    });

    const ibasIndex = projectData.reduce((acc, d) => acc + d.impacto, 0);

    const { data: prevRow } = await supabase
      .from('ibas_daily_snapshots')
      .select('ibas_index, ibas_max, ibas_min')
      .lt('date', today)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    const prevIndex    = prevRow?.ibas_index || ibasIndex;
    const variationPct = ((ibasIndex - prevIndex) / prevIndex) * 100;
    const ibas_max     = Math.max(ibasIndex, prevRow?.ibas_max || ibasIndex);
    const ibas_min     = Math.min(ibasIndex, prevRow?.ibas_min || ibasIndex);

    await supabase.from('ibas_daily_snapshots').upsert({
      date: today, ibas_index: ibasIndex, ibas_prev: prevIndex,
      variation_pct: variationPct, ibas_max, ibas_min,
      b4trii_ptax: ptax, total_projects: totalProjects,
      total_listados: totalListed, total_custodiados: totalCustody,
    }, { onConflict: 'date' });

    const projectRows = projectData.map(({ p, scores, peso, comp, bonus, impacto }) => ({
      date: today, projeto_id: p.id, nome: p.nome, status: p.status,
      score: scores.total, peso, impacto, compensado: comp, bonus_compensacao: bonus,
      p1: scores.p1, p2: scores.p2, p3: scores.p3, p4: scores.p4,
      p5: scores.p5, p6: scores.p6, p7: scores.p7, p8: scores.p8,
      p9: scores.p9, p10: scores.p10, p11: scores.p11,
    }));
    await supabase.from('ibas_project_snapshots').upsert(projectRows, { onConflict: 'date,projeto_id' });

    const evidenceRows = evidences.map(e => ({
      date: today, projeto_id: e.projeto_id,
      projeto_nome: projects.find(p => p.id === e.projeto_id)?.nome || '',
      pilar_num: e.pilar_num, evidence_id: e.id, nome: e.name,
      status: e.status, tipo: e.type || 'Link',
      link: e.link_url || e.file_url || '',
    }));

    const { data: existingEvs } = await supabase
      .from('ibas_evidence_snapshots').select('evidence_id').eq('date', today);
    const existingIds = new Set((existingEvs || []).map(e => e.evidence_id));
    const newEvRows = evidenceRows.filter(r => !existingIds.has(r.evidence_id));
    if (newEvRows.length > 0) {
      await supabase.from('ibas_evidence_snapshots').insert(newEvRows);
    }

    console.log(`[IBAS CRON] OK! IBAS=${ibasIndex.toFixed(4)} | Projetos=${totalProjects} | Docs=${newEvRows.length}`);
    return res.status(200).json({
      success: true, date: today, ibas_index: ibasIndex,
      variation_pct: variationPct, total_projects: totalProjects,
      evidence_count: newEvRows.length,
    });

  } catch (err) {
    console.error('[IBAS CRON] Erro:', err);
    return res.status(500).json({ error: err.message });
  }
}
