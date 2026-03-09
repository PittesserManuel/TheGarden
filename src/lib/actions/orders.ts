'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireStaff } from './auth-guard'

const LOC = () => process.env.NEXT_PUBLIC_LOCATION_ID!

// Input sanitization
function sanitizeText(text: string | undefined | null, maxLength: number): string {
  if (!text) return ''
  return text.trim().replace(/[^\S\n]+/g, ' ').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').slice(0, maxLength)
}

// Atomic order number (CAS with retry)
async function getNextOrderNumber(admin: ReturnType<typeof createAdminClient>, locationId: string): Promise<number> {
  for (let attempt = 0; attempt < 15; attempt++) {
    const { data: counter } = await admin
      .from('order_counters')
      .select('current_number')
      .eq('location_id', locationId)
      .single()

    const currentNumber = counter?.current_number || 0

    if (currentNumber === 0) {
      // First order — try to set counter to 1
      const { error } = await admin
        .from('order_counters')
        .upsert({ location_id: locationId, current_number: 1 })
      if (!error) return 1
      continue
    }

    // CAS: update only if counter matches what we read
    const nextNumber = currentNumber + 1
    const { data: updated } = await admin
      .from('order_counters')
      .update({ current_number: nextNumber })
      .eq('location_id', locationId)
      .eq('current_number', currentNumber)
      .select('current_number')

    if (updated && updated.length > 0) return nextNumber

    // CAS failed — retry
    await new Promise(r => setTimeout(r, Math.random() * 50 + 10))
  }

  throw new Error('Bestellnummer konnte nicht vergeben werden')
}

type OrderItemInput = {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  notes?: string
}

type CreateOrderInput = {
  customer_name: string
  order_mode: 'dine_in' | 'to_go'
  notes?: string
  items: OrderItemInput[]
  member_id?: string
  station_status?: Record<string, boolean>
}

// Create an order (staff only)
export async function createOrder(input: CreateOrderInput) {
  const { userId } = await requireStaff()
  const admin = createAdminClient()
  const locationId = LOC()

  const customerName = sanitizeText(input.customer_name, 100)
  if (!customerName) return { error: 'Name ist erforderlich' }
  if (!input.items || input.items.length === 0) return { error: 'Keine Artikel in der Bestellung' }
  if (!['dine_in', 'to_go'].includes(input.order_mode)) return { error: 'Ungültiger Bestellmodus' }

  // Server-side price verification
  const productIds = Array.from(new Set(input.items.map(i => i.product_id)))
  const { data: dbProducts } = await admin
    .from('products')
    .select('id, price')
    .in('id', productIds)

  if (!dbProducts || dbProducts.length === 0) return { error: 'Produkte nicht gefunden' }

  let verifiedTotal = 0
  const verifiedItems: OrderItemInput[] = []

  for (const item of input.items) {
    const dbProduct = dbProducts.find((p: any) => p.id === item.product_id)
    if (!dbProduct) return { error: `Produkt nicht gefunden: ${item.product_name}` }

    const verifiedPrice = Number(dbProduct.price)
    verifiedTotal += verifiedPrice * item.quantity
    verifiedItems.push({ ...item, unit_price: verifiedPrice })
  }

  // Determine stations involved
  const stationStatus = input.station_status || {}

  try {
    // Get order number atomically
    const orderNumber = await getNextOrderNumber(admin, locationId)

    // Insert order
    const { data: order, error: orderErr } = await admin
      .from('orders')
      .insert({
        location_id: locationId,
        order_number: orderNumber,
        customer_name: customerName,
        order_mode: input.order_mode,
        total: verifiedTotal,
        notes: sanitizeText(input.notes, 500) || null,
        station_status: stationStatus,
        member_id: input.member_id || null,
        created_by: userId,
      })
      .select()
      .single()

    if (orderErr) return { error: orderErr.message }

    // Insert order items
    const { error: itemsErr } = await admin
      .from('order_items')
      .insert(
        verifiedItems.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: sanitizeText(item.notes, 200) || null,
        }))
      )

    if (itemsErr) return { error: itemsErr.message }

    // Award loyalty points if member
    if (input.member_id) {
      const pointsEarned = Math.floor(verifiedTotal) // 1 point per euro
      if (pointsEarned > 0) {
        await admin.from('point_transactions').insert({
          member_id: input.member_id,
          points: pointsEarned,
          type: 'earned',
          order_id: order.id,
          note: `Bestellung #${orderNumber}`,
        })
        // Update member points directly
        const { data: memberData } = await admin
          .from('members')
          .select('current_points, lifetime_points')
          .eq('id', input.member_id)
          .single()
        if (memberData) {
          await admin.from('members').update({
            current_points: (memberData.current_points || 0) + pointsEarned,
            lifetime_points: (memberData.lifetime_points || 0) + pointsEarned,
          }).eq('id', input.member_id)
        }
      }
    }

    return { data: order }
  } catch (err: any) {
    return { error: err?.message || 'Bestellung konnte nicht erstellt werden' }
  }
}

// Get all orders (admin)
export async function getOrders(filters?: { date_from?: string; date_to?: string }) {
  await requireStaff()
  const admin = createAdminClient()

  let query = admin
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('location_id', LOC())
    .order('created_at', { ascending: false })

  if (filters?.date_from) query = query.gte('created_at', filters.date_from)
  if (filters?.date_to) query = query.lte('created_at', filters.date_to)

  const { data, error } = await query.limit(100)
  if (error) return { error: error.message }
  return { data: data || [] }
}

// Get today's orders
export async function getTodayOrders() {
  await requireStaff()
  const admin = createAdminClient()

  const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(new Date())
  const startOfDay = `${todayStr}T00:00:00+01:00`

  const { data, error } = await admin
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('location_id', LOC())
    .gte('created_at', startOfDay)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }
  return { data: data || [] }
}

// Update order status
export async function updateOrder(id: string, updates: {
  complete_status?: string
  paid_status?: string
  pickup_status?: string
  station_status?: Record<string, boolean>
}) {
  await requireStaff()
  const admin = createAdminClient()

  const { error } = await admin.from('orders').update(updates).eq('id', id)
  if (error) return { error: error.message }
  return { success: true }
}

// Update order item status
export async function updateOrderItemStatus(itemId: string, status: string) {
  await requireStaff()
  const admin = createAdminClient()

  const { error } = await admin.from('order_items').update({ status }).eq('id', itemId)
  if (error) return { error: error.message }

  // Check if all items in the order are finished -> mark order as finished
  const { data: item } = await admin.from('order_items').select('order_id').eq('id', itemId).single()
  if (item) {
    const { data: allItems } = await admin
      .from('order_items')
      .select('status')
      .eq('order_id', item.order_id)

    if (allItems) {
      const allFinished = allItems.every((i: any) => i.status === 'finished')
      const anyInProgress = allItems.some((i: any) => i.status === 'in_progress')

      if (allFinished) {
        await admin.from('orders').update({ complete_status: 'finished' }).eq('id', item.order_id)
      } else if (anyInProgress) {
        await admin.from('orders').update({ complete_status: 'in_progress' }).eq('id', item.order_id)
      }
    }
  }

  return { success: true }
}
