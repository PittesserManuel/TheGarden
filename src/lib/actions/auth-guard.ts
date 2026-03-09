'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Verify the caller is an authenticated admin.
 * Returns the user ID on success, or throws an error.
 */
export async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error(`Nicht authentifiziert: ${error?.message || 'Kein User'}`)
  }

  const admin = createAdminClient()
  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileErr) {
    throw new Error(`Profil-Fehler: ${profileErr.message}`)
  }

  if (!profile || profile.role !== 'admin') {
    throw new Error('Keine Admin-Berechtigung')
  }

  return user.id
}

/**
 * Verify the caller is an authenticated admin or worker.
 * Returns the user ID and role on success.
 */
export async function requireStaff(): Promise<{ userId: string; role: string }> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error(`Nicht authentifiziert: ${error?.message || 'Kein User'}`)
  }

  const admin = createAdminClient()
  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileErr) {
    throw new Error(`Profil-Fehler: ${profileErr.message}`)
  }

  if (!profile || !['admin', 'worker'].includes(profile.role)) {
    throw new Error('Keine Berechtigung')
  }

  return { userId: user.id, role: profile.role }
}
