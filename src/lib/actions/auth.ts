'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Look up email by username
export async function getEmailByUsername(username: string): Promise<{ email?: string; error?: string }> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('email')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (!data) return { error: 'Benutzer nicht gefunden' }
  return { email: data.email }
}

// Login as admin or worker
export async function loginAdmin(username: string, password: string) {
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('email, role')
    .eq('username', username.toLowerCase().trim())
    .single()

  if (!profile) return { error: 'Benutzer nicht gefunden' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: profile.email, password })
  if (error) return { error: error.message }

  if (!['admin', 'worker'].includes(profile.role)) {
    await supabase.auth.signOut()
    return { error: 'Keine Berechtigung' }
  }

  return { success: true, role: profile.role as 'admin' | 'worker' }
}

// Login a member (customer)
export async function loginMember(username: string, password: string) {
  const lookup = await getEmailByUsername(username)
  if (lookup.error) return { error: lookup.error }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: lookup.email!, password })
  if (error) return { error: error.message }
  return { success: true }
}

// Register a new member
export async function registerMember(data: {
  username: string
  password: string
  name: string
  phone?: string
}) {
  const cleanUsername = data.username.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '')
  if (!cleanUsername || cleanUsername.length < 3) {
    return { error: 'Benutzername muss mindestens 3 Zeichen haben (Buchstaben, Zahlen, Punkt, Bindestrich).' }
  }

  // Check if username is already taken
  const admin = createAdminClient()
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('username', cleanUsername)
    .single()

  if (existing) return { error: 'Benutzername bereits vergeben.' }

  const email = `${cleanUsername}@thegarden.local`

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: {
      data: {
        username: cleanUsername,
        name: data.name,
        phone: data.phone || '',
        role: 'customer',
      },
    },
  })
  if (error) return { error: error.message }
  return { success: true }
}

// Logout current user
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Explicitly delete ALL Supabase auth cookies
  const { cookies: getCookies } = await import('next/headers')
  const cookieStore = await getCookies()
  const allCookies = cookieStore.getAll()
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.delete(cookie.name)
    }
  }
}

// Get current session and profile
export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return { session, profile }
}

// Get current member data (for logged-in customers)
export async function getCurrentMember() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: member } = await supabase
    .from('members')
    .select('*, profile:profiles(*)')
    .eq('user_id', session.user.id)
    .single()

  return member
}
