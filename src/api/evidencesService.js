import { supabase } from './supabaseClient'

const useMockFallback = !import.meta.env.VITE_SUPABASE_URL

export async function fetchEvidences(projectId) {
  if (useMockFallback) {
    const localData = JSON.parse(localStorage.getItem('mockEvidences') || '[]');
    return localData.filter(e => e.project_id === projectId);
  }
  const { data, error } = await supabase.from('evidences').select('*').eq('project_id', projectId)
  if (error) throw error
  return data
}

export async function saveEvidence(evidence) {
  if (useMockFallback) {
    const localData = JSON.parse(localStorage.getItem('mockEvidences') || '[]');
    const newEv = { ...evidence, id: Date.now().toString(), created_at: new Date().toISOString() };
    localStorage.setItem('mockEvidences', JSON.stringify([...localData, newEv]));
    return newEv;
  }
  const { data, error } = await supabase.from('evidences').insert(evidence).select()
  if (error) throw error
  return data[0]
}

export async function updateEvidence(id, evidence) {
  if (useMockFallback) {
    const localData = JSON.parse(localStorage.getItem('mockEvidences') || '[]');
    const index = localData.findIndex(e => e.id === id);
    if(index > -1) {
      localData[index] = { ...localData[index], ...evidence };
      localStorage.setItem('mockEvidences', JSON.stringify(localData));
      return localData[index];
    }
    return null;
  }
  const { data, error } = await supabase.from('evidences').update(evidence).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function deleteEvidence(id) {
  if (useMockFallback) {
    const localData = JSON.parse(localStorage.getItem('mockEvidences') || '[]');
    localStorage.setItem('mockEvidences', JSON.stringify(localData.filter(e => e.id !== id)));
    return true;
  }
  const { error } = await supabase.from('evidences').delete().eq('id', id)
  if (error) throw error
  return true
}
