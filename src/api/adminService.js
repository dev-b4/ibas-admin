import { supabase } from './supabaseClient'

export async function fetchAdminUsers() {
  const { data, error } = await supabase.from('admin_users').select('*')
  if (error) throw error
  return data
}

export async function createAdminUser(userData) {
  const { data, error } = await supabase.from('admin_users').insert(userData).select()
  if (error) throw error
  return data[0]
}

export async function updateAdminUser(id, userData) {
  const { data, error } = await supabase.from('admin_users').update(userData).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function logAction(action, target, details) {
  const user = await supabase.auth.getUser()
  const { data, error } = await supabase.from('action_logs').insert({
    admin_id: user?.data?.user?.id,
    action,
    target,
    details
  }).select()
  if (error) throw error
  return data[0]
}

export async function fetchActionLogs() {
  const { data, error } = await supabase.from('action_logs').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}
