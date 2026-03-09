'use client'

import { useEffect, useState, useCallback } from 'react'
import { ShoppingCart, Euro, RefreshCw, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { RevenueChart } from './revenue-chart'
import { formatPrice, formatTime } from '@/lib/utils/format'

type DayStats = { date: string; revenue: number; orders: number }
type RecentOrder = {
  id: string; order_number: number; customer_name: string | null
  total: number; complete_status: string; created_at: string
  items: { product_name: string; quantity: number }[]
}
type ProductStat = { name: string; quantity: number; revenue: number }
type Period = 10 | 30 | 90

export default function DashboardPage() {
  const [ordersToday, setOrdersToday] = useState(0)
  const [revenueToday, setRevenueToday] = useState(0)
  const [revenueData, setRevenueData] = useState<DayStats[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<ProductStat[]>([])
  const [period, setPeriod] = useState<Period>(30)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async (days: Period, showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    else setIsLoading(true)

    const result = await getDashboardStats(days)
    if (result.data) {
      setOrdersToday(result.data.ordersToday)
      setRevenueToday(result.data.revenueToday)
      setRevenueData(result.data.revenueData)
      setRecentOrders(result.data.recentOrders as any)
      setTopProducts(result.data.topProducts || [])
    }
    setIsLoading(false)
    setIsRefreshing(false)
  }, [])

  useEffect(() => { fetchData(period) }, [period, fetchData])

  const totalPeriodRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalPeriodOrders = revenueData.reduce((sum, d) => sum + d.orders, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => fetchData(period, true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-garden-600 hover:bg-garden-50 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Aktualisieren
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Bestellungen heute</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{ordersToday}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-50 text-green-600">
              <Euro className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-500">Umsatz heute</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(revenueToday)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Umsatzentwicklung</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {formatPrice(totalPeriodRevenue)} Umsatz &middot; {totalPeriodOrders} Bestellungen &middot; Letzte {period} Tage
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {([10, 30, 90] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                    period === p ? 'bg-white text-garden-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p} Tage
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-2 pb-4">
          <RevenueChart data={revenueData} period={period} />
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-garden-600" />
            <h2 className="text-lg font-semibold text-gray-900">Meistverkaufte Produkte</h2>
            <span className="text-sm text-gray-400 ml-auto">Letzte {period} Tage</span>
          </div>
          <div className="space-y-3">
            {topProducts.slice(0, 8).map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-50 text-orange-600' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                    <span className="text-sm font-bold text-garden-600 shrink-0 ml-2">{product.quantity}x</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-garden-500/70 rounded-full transition-all"
                      style={{ width: `${(product.quantity / topProducts[0].quantity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Letzte Bestellungen</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">Noch keine Bestellungen vorhanden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Kunde</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Produkte</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Betrag</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Uhrzeit</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold">#{order.order_number}</td>
                    <td className="py-3 px-4">{order.customer_name || '–'}</td>
                    <td className="py-3 px-4 text-gray-500 max-w-[200px] truncate hidden sm:table-cell">
                      {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') || '–'}
                    </td>
                    <td className="py-3 px-4 font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4 text-gray-500">{formatTime(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.complete_status === 'finished' ? 'bg-green-100 text-green-700' :
                        order.complete_status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.complete_status === 'finished' ? 'Fertig' :
                         order.complete_status === 'in_progress' ? 'In Arbeit' : 'Offen'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
