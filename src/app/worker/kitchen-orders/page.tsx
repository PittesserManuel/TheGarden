'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatTime, formatPrice } from '@/lib/utils/format'
import { RefreshCw, ClipboardList } from 'lucide-react'
import Link from 'next/link'

type OrderRow = {
  id: string; order_number: number; customer_name: string | null
  order_mode: string; total: number; complete_status: string
  paid_status: string; created_at: string
  items: { product_name: string; quantity: number; status: string }[]
}

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(new Date())
    const { data } = await supabase
      .from('orders')
      .select('*, items:order_items(product_name, quantity, status)')
      .gte('created_at', `${todayStr}T00:00:00+01:00`)
      .order('created_at', { ascending: false })
    setOrders((data || []) as OrderRow[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen">
      <header className="bg-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-garden-400" />
          <h1 className="text-xl font-bold">Alle Bestellungen heute</h1>
          <span className="bg-garden-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">{orders.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/worker/station/kitchen" className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">Station</Link>
          <Link href="/kassa" className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">Kassa</Link>
          <button onClick={load} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-gray-600 border-t-garden-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">#{order.order_number}</span>
                    <span className="text-sm text-gray-400">{order.customer_name || '–'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.order_mode === 'dine_in' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>{order.order_mode === 'dine_in' ? 'Vor Ort' : 'To Go'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-garden-400">{formatPrice(order.total)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.complete_status === 'finished' ? 'bg-green-500/20 text-green-400' :
                      order.complete_status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{order.complete_status === 'finished' ? 'Fertig' : order.complete_status === 'in_progress' ? 'In Arbeit' : 'Offen'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.paid_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                    }`}>{order.paid_status === 'paid' ? 'Bezahlt' : 'Unbezahlt'}</span>
                    <span className="text-sm text-gray-500">{formatTime(order.created_at)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
