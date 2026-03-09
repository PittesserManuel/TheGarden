'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from './auth-guard'

const LOC = () => process.env.NEXT_PUBLIC_LOCATION_ID!

// Get all categories
export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('location_id', LOC())
    .order('sort_order')

  if (error) return { error: error.message }
  return { data: data || [] }
}

// Create a category (admin only)
export async function createCategory(category: {
  name: string
  description?: string
  icon?: string
  station?: string
  sort_order?: number
  is_visible?: boolean
}) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('categories')
    .insert({
      location_id: LOC(),
      name: category.name,
      description: category.description || null,
      icon: category.icon || null,
      station: category.station || 'kitchen',
      sort_order: category.sort_order || 0,
      is_visible: category.is_visible ?? true,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

// Update a category (admin only)
export async function updateCategory(id: string, updates: {
  name?: string
  description?: string | null
  icon?: string | null
  station?: string
  sort_order?: number
  is_visible?: boolean
}) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()

  const { error } = await admin
    .from('categories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

// Delete a category (admin only)
export async function deleteCategory(id: string) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()
  const { error } = await admin.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
