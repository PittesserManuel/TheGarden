'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from './auth-guard'

const LOC = () => process.env.NEXT_PUBLIC_LOCATION_ID!

// Get all products
export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('location_id', LOC())
    .order('sort_order')

  if (error) return { error: error.message }
  return { data: data || [] }
}

// Get single product by ID
export async function getProduct(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

// Create a product (admin only)
export async function createProduct(product: {
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  tags?: string[]
  is_available?: boolean
  sort_order?: number
}) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('products')
    .insert({
      location_id: LOC(),
      category_id: product.category_id,
      name: product.name,
      description: product.description || null,
      price: product.price,
      image_url: product.image_url || null,
      tags: product.tags || [],
      is_available: product.is_available ?? true,
      sort_order: product.sort_order || 0,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

// Update a product (admin only)
export async function updateProduct(id: string, updates: {
  category_id?: string
  name?: string
  description?: string | null
  price?: number
  image_url?: string | null
  tags?: string[]
  is_available?: boolean
  sort_order?: number
}) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()

  const { error } = await admin
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

// Delete a product (admin only)
export async function deleteProduct(id: string) {
  try { await requireAdmin() } catch (e: any) { return { error: e?.message || 'Keine Berechtigung' } }
  const admin = createAdminClient()
  const { error } = await admin.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}
