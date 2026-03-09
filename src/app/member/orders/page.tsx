'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatDateTime } from '@/lib/utils/format'
import { ClipboardList, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type OrderRow = {
  id: string; order_number: number; total: number; order_mode: string
  complete_status: string; created_at: string
  items: { product_name: string; quantity: number }[]
}

export default function MemberOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(product_name, quantity)')
        .order('created_at', { ascending: false })
        .limit(20)
      setOrders((data || []) as OrderRow[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-[#faf8f0] flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="min-h-screen bg-[#faf8f0] pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/member/dashboard" className="flex items-center gap-2 text-garden-600 hover:text-garden-700 text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Meine Bestellungen</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Noch keine Bestellungen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">#{order.order_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.complete_status === 'finished' ? 'bg-green-100 text-green-700' :
                      order.complete_status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.complete_status === 'finished' ? 'Fertig' : order.complete_status === 'in_progress' ? 'In Arbeit' : 'Offen'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{formatDateTime(order.created_at)}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
