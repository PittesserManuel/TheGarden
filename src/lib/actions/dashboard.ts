'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from './auth-guard'
import type { DashboardStats } from '@/lib/types/database'

const LOC = () => process.env.NEXT_PUBLIC_LOCATION_ID!

export async function getDashboardStats(days: 10 | 30 | 90 = 30): Promise<{ data?: DashboardStats; error?: string }> {
  try {
    await requireAdmin()
  } catch (e: any) {
    return { error: e?.message || 'Keine Berechtigung' }
  }

  try {
    const admin = createAdminClient()
    const locationId = LOC()

    const now = new Date()
    const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(now)

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    const startStr = startDate.toISOString()

    // 1. Orders for date range
    const { data: chartOrders, error: chartErr } = await admin
      .from('orders')
      .select('total, created_at')
      .eq('location_id', locationId)
      .gte('created_at', startStr)
      .order('created_at', { ascending: true })

    if (chartErr) return { error: chartErr.message }

    // 2. Aggregate by day
    const dayMap = new Map<string, { revenue: number; orders: number }>()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(d)
      dayMap.set(dateStr, { revenue: 0, orders: 0 })
    }

    let ordersToday = 0
    let revenueToday = 0

    for (const order of chartOrders || []) {
      const orderDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(new Date(order.created_at))
      const price = Number(order.total) || 0

      const existing = dayMap.get(orderDate)
      if (existing) {
        existing.revenue += price
        existing.orders += 1
      }

      if (orderDate === todayStr) {
        ordersToday++
        revenueToday += price
      }
    }

    const revenueData = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({ date, revenue: stats.revenue, orders: stats.orders }))

    // 3. Top products
    const { data: salesOrders } = await admin
      .from('orders')
      .select('items:order_items(product_name, quantity)')
      .eq('location_id', locationId)
      .gte('created_at', startStr)

    const productMap = new Map<string, { quantity: number; revenue: number }>()
    for (const order of salesOrders || []) {
      for (const item of (order as any).items || []) {
        if (!item.product_name) continue
        const existing = productMap.get(item.product_name) || { quantity: 0, revenue: 0 }
        existing.quantity += item.quantity || 1
        productMap.set(item.product_name, existing)
      }
    }
    const topProducts = Array.from(productMap.entries())
      .map(([name, stats]) => ({ name, quantity: stats.quantity, revenue: stats.revenue }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // 4. Recent orders
    const { data: recentOrders } = await admin
      .from('orders')
      .select(`
        *,
        items:order_items(product_name, quantity, unit_price, status)
      `)
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })
      .limit(8)

    return {
      data: {
        ordersToday,
        revenueToday,
        revenueData,
        topProducts,
        recentOrders: (recentOrders || []) as any,
      },
    }
  } catch (err: any) {
    return { error: err?.message || 'Dashboard-Daten konnten nicht geladen werden' }
  }
}
