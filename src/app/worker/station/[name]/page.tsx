'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateOrderItemStatus } from '@/lib/actions/orders'
import { formatTime } from '@/lib/utils/format'
import { RefreshCw, ChefHat, Clock } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

const STATION_LABELS: Record<string, string> = {
  kitchen: 'Küche',
  bar: 'Bar',
  dessert: 'Dessert',
}

const STATIONS = ['kitchen', 'bar', 'dessert']

type OrderWithItems = {
  id: string
  order_number: number
  customer_name: string | null
  order_mode: string
  created_at: string
  notes: string | null
  items: {
    id: string
    product_name: string
    quantity: number
    notes: string | null
    status: string
  }[]
}

export default function StationPage() {
  const params = useParams()
  const stationName = params.name as string
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    else setIsLoading(true)

    const supabase = createClient()
    const todayStr = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(new Date())
    const startOfDay = `${todayStr}T00:00:00+01:00`

    // Fetch today's orders that include items for this station
    const { data } = await supabase
      .from('orders')
      .select(`
        id, order_number, customer_name, order_mode, created_at, notes,
        items:order_items(id, product_name, quantity, notes, status)
      `)
      .gte('created_at', startOfDay)
      .order('created_at', { ascending: true })

    if (data) {
      // Filter: only show orders that have items belonging to this station
      // AND where at least one item is not 'finished'
      const filtered = (data as any[]).filter(order => {
        // Check if this order involves this station
        const stationStatus = order.station_status || {}
        const hasStation = stationName in stationStatus || stationName === 'kitchen'

        // Check if any items are not finished
        const hasUnfinished = order.items?.some((i: any) => i.status !== 'finished')

        return hasStation && hasUnfinished
      })
      setOrders(filtered)
    }

    setIsLoading(false)
    setIsRefreshing(false)
  }, [stationName])

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => fetchOrders(true), 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function handleStatusChange(itemId: string, currentStatus: string) {
    const nextStatus = currentStatus === 'unfinished' ? 'in_progress' : 'finished'
    const result = await updateOrderItemStatus(itemId, nextStatus)
    if (result.success) {
      // Update locally
      setOrders(prev => prev.map(order => ({
        ...order,
        items: order.items.map(item =>
          item.id === itemId ? { ...item, status: nextStatus } : item
        ),
      })))
      if (nextStatus === 'finished') toast.success('Fertig!')
    } else {
      toast.error(result.error || 'Fehler')
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'unfinished': return 'bg-red-500'
      case 'in_progress': return 'bg-amber-500'
      case 'finished': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'unfinished': return 'Neu'
      case 'in_progress': return 'In Arbeit'
      case 'finished': return 'Fertig'
      default: return status
    }
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-garden-400" />
          <h1 className="text-xl font-bold">{STATION_LABELS[stationName] || stationName}</h1>
          <span className="bg-garden-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {orders.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Station tabs */}
          {STATIONS.map(s => (
            <Link
              key={s}
              href={`/worker/station/${s}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                stationName === s ? 'bg-garden-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {STATION_LABELS[s]}
            </Link>
          ))}
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/kassa" className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
            Kassa
          </Link>
        </div>
      </header>

      {/* Orders Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-gray-600 border-t-garden-500 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Clock className="w-16 h-16 mb-4 text-gray-600" />
            <p className="text-xl font-medium">Keine offenen Bestellungen</p>
            <p className="text-sm mt-1">Auto-Refresh alle 30 Sekunden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map(order => {
              const hasNew = order.items.some(i => i.status === 'unfinished')
              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border-2 overflow-hidden ${
                    hasNew ? 'border-red-500 bg-gray-800' : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  {/* Order Header */}
                  <div className={`px-4 py-3 flex items-center justify-between ${hasNew ? 'bg-red-500/20' : 'bg-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">#{order.order_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.order_mode === 'dine_in' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {order.order_mode === 'dine_in' ? 'Vor Ort' : 'To Go'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{formatTime(order.created_at)}</span>
                  </div>

                  {/* Customer */}
                  {order.customer_name && (
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                      {order.customer_name}
                    </div>
                  )}

                  {/* Items */}
                  <div className="p-4 space-y-2">
                    {order.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => item.status !== 'finished' && handleStatusChange(item.id, item.status)}
                        disabled={item.status === 'finished'}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                          item.status === 'finished'
                            ? 'bg-green-500/10 opacity-50'
                            : item.status === 'in_progress'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer'
                              : 'bg-red-500/10 hover:bg-red-500/20 cursor-pointer'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full shrink-0 ${statusColor(item.status)}`} />
                        <div className="flex-1 text-left">
                          <span className="font-medium">{item.quantity}x {item.product_name}</span>
                          {item.notes && <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>}
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === 'finished' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {statusLabel(item.status)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-400 italic">
                      {order.notes}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
