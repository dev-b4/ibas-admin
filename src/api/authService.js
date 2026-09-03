import { supabase } from './supabaseClient'

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
  return true
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data?.user
}

export async function setupTOTP() {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
  if (error) throw error
  return data
}

export async function verifyTOTP(factorId, code) {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code
  })
  if (error) throw error
  return data
}

export async function enrollTOTP() {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
  if (error) throw error
  return { 
    qr: data.totp.qr_code, 
    secret: data.totp.secret, 
    factorId: data.id 
  }
}
