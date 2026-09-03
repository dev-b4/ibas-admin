import { supabase } from './supabaseClient'

const useMockFallback = !import.meta.env.VITE_SUPABASE_URL

export async function fetchProjects() {
  if (useMockFallback) {
    return [
      { id: '1', name: 'Arace', score: 85.5 },
      { id: '2', name: 'Apoena', score: 92.0 },
      { id: '3', name: 'Yaku', score: 78.3 },
      { id: '4', name: 'Consultas', score: 88.9 },
      { id: '5', name: 'Tonca', score: 95.1 },
      { id: '6', name: 'Dowedi', score: 81.4 },
      { id: '7', name: 'NFTs', score: 73.2 }
    ].sort((a, b) => b.score - a.score);
  }
  const { data, error } = await supabase.from('projects').select('*').order('score', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchProjectById(id) {
  if (useMockFallback) return { id, name: 'Mock Project', score: 80 };
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function upsertProject(project) {
  if (useMockFallback) return { ...project, id: project.id || Date.now().toString() };
  const { data, error } = await supabase.from('projects').upsert(project).select()
  if (error) throw error
  return data[0]
}

export async function deleteProject(id) {
  if (useMockFallback) return true;
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  return true
}
