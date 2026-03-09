'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/store/admin-store'
import { formatPrice, formatDateTime } from '@/lib/utils/format'
import { RefreshCw, Filter } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function OrdersPage() {
  const { orders, fetchTodayOrders, fetchOrders, updateOrder } = useAdminStore()
  const [filter, setFilter] = useState<'today' | 'all'>('today')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (filter === 'today') fetchTodayOrders()
    else fetchOrders()
  }, [filter, fetchTodayOrders, fetchOrders])

  async function handleRefresh() {
    setIsRefreshing(true)
    if (filter === 'today') await fetchTodayOrders()
    else await fetchOrders()
    setIsRefreshing(false)
  }

  async function togglePaid(orderId: string, currentStatus: string) {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid'
    const r = await updateOrder(orderId, { paid_status: newStatus })
    if (r.success) toast.success(newStatus === 'paid' ? 'Als bezahlt markiert' : 'Als unbezahlt markiert')
    else toast.error(r.error || 'Fehler')
  }

  async function togglePickup(orderId: string, currentStatus: string) {
    const newStatus = currentStatus === 'picked_up' ? 'open' : 'picked_up'
    const r = await updateOrder(orderId, { pickup_status: newStatus })
    if (r.success) toast.success(newStatus === 'picked_up' ? 'Abgeholt' : 'Status zurückgesetzt')
    else toast.error(r.error || 'Fehler')
  }

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bestellungen</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${filter === 'today' ? 'bg-white text-garden-600 shadow-sm' : 'text-gray-500'}`}
            >
              Heute
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${filter === 'all' ? 'bg-white text-garden-600 shadow-sm' : 'text-gray-500'}`}
            >
              Alle
            </button>
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-garden-600 hover:bg-garden-50 rounded-lg transition disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Keine Bestellungen vorhanden.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">#{order.order_number}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.order_mode === 'dine_in' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {order.order_mode === 'dine_in' ? 'Vor Ort' : 'To Go'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.complete_status === 'finished' ? 'bg-green-100 text-green-700' :
                    order.complete_status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.complete_status === 'finished' ? 'Fertig' :
                     order.complete_status === 'in_progress' ? 'In Arbeit' : 'Offen'}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{formatDateTime(order.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{order.customer_name || 'Unbekannt'}</p>
                  <div className="text-xs text-gray-400">
                    {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                  </div>
                  {order.notes && <p className="text-xs text-gray-400 mt-1 italic">Notiz: {order.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => togglePaid(order.id, order.paid_status)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        order.paid_status === 'paid'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {order.paid_status === 'paid' ? '✓ Bezahlt' : 'Unbezahlt'}
                    </button>
                    <button
                      onClick={() => togglePickup(order.id, order.pickup_status)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        order.pickup_status === 'picked_up'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {order.pickup_status === 'picked_up' ? '✓ Abgeholt' : 'Offen'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
