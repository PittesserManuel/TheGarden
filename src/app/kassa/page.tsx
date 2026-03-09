'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createOrder } from '@/lib/actions/orders'
import { formatPrice } from '@/lib/utils/format'
import { Minus, Plus, Trash2, ShoppingCart, X, Search, User, StickyNote, LogOut, ChefHat } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import type { Product, Category, CartItem } from '@/lib/types/database'

export default function KassaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [orderMode, setOrderMode] = useState<'dine_in' | 'to_go'>('dine_in')
  const [orderNotes, setOrderNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').eq('is_available', true).order('sort_order'),
        supabase.from('categories').select('*').eq('is_visible', true).order('sort_order'),
      ])
      setProducts((productsRes.data || []) as Product[])
      setCategories((categoriesRes.data || []) as Category[])
    }
    load()
  }, [])

  // Cart helpers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && !item.notes)
      if (existing) {
        return prev.map(item =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { id: `${product.id}-${Date.now()}`, product, quantity: 1 }]
    })
  }

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id !== cartId) return item
      const newQty = item.quantity + delta
      if (newQty <= 0) return item
      return { ...item, quantity: newQty }
    }))
  }

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartId))
  }

  const clearCart = () => {
    setCart([])
    setCustomerName('')
    setOrderNotes('')
    setOrderMode('dine_in')
  }

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart])
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [products, selectedCategory, search])

  // Determine which stations are involved
  const getStationStatus = (): Record<string, boolean> => {
    const stations: Record<string, boolean> = {}
    for (const item of cart) {
      const station = item.product.category?.station || 'kitchen'
      stations[station] = false // false = not yet finished
    }
    return stations
  }

  // Submit order
  async function handleSubmit() {
    if (cart.length === 0) { toast.error('Warenkorb ist leer'); return }
    if (!customerName.trim()) { toast.error('Kundenname erforderlich'); return }

    setIsSubmitting(true)
    try {
      const result = await createOrder({
        customer_name: customerName.trim(),
        order_mode: orderMode,
        notes: orderNotes || undefined,
        station_status: getStationStatus(),
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          notes: item.notes,
        })),
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        const orderNum = result.data?.order_number
        setLastOrderNumber(orderNum)
        toast.success(`Bestellung #${orderNum} erstellt!`)
        clearCart()
        // Auto-hide order number after 5s
        setTimeout(() => setLastOrderNumber(null), 5000)
      }
    } catch {
      toast.error('Fehler beim Erstellen der Bestellung')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-garden-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <ChefHat className="w-6 h-6 text-garden-400" />
          <h1 className="text-lg font-serif font-bold">Kassa</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="text-sm text-garden-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-garden-800">
            Admin
          </Link>
          <Link href="/worker/station/kitchen" className="text-sm text-garden-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-garden-800">
            Küche
          </Link>
        </div>
      </header>

      {/* Last order banner */}
      {lastOrderNumber && (
        <div className="bg-green-500 text-white px-4 py-2 text-center font-bold text-lg animate-pulse">
          Bestellung #{lastOrderNumber} erstellt!
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categories */}
          <div className="px-4 py-3 bg-white border-b border-gray-200 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === 'all' ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Alle
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.id ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2 bg-white border-b border-gray-200 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-garden-500 outline-none"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-garden-300 transition text-left active:scale-95"
                >
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-garden-600 font-bold text-lg">{formatPrice(product.price)}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          tag === 'vegan' ? 'bg-green-100 text-green-700' :
                          tag === 'vegetarisch' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0">
          {/* Cart Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-garden-600" />
                <span className="font-semibold text-gray-900">Warenkorb</span>
                {totalItems > 0 && (
                  <span className="bg-garden-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-700 transition">
                  Leeren
                </button>
              )}
            </div>
          </div>

          {/* Customer Name + Mode */}
          <div className="px-4 py-3 border-b border-gray-200 space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Kundenname *"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-garden-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderMode('dine_in')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  orderMode === 'dine_in' ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Vor Ort
              </button>
              <button
                onClick={() => setOrderMode('to_go')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  orderMode === 'to_go' ? 'bg-garden-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                To Go
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Warenkorb ist leer</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Toggle */}
          {cart.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <button onClick={() => setShowNotes(!showNotes)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-garden-600 transition">
                <StickyNote className="w-4 h-4" />
                {showNotes ? 'Notiz ausblenden' : 'Notiz hinzufügen'}
              </button>
              {showNotes && (
                <textarea
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="Notizen zur Bestellung..."
                  rows={2}
                  className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-garden-500 outline-none"
                />
              )}
            </div>
          )}

          {/* Total + Submit */}
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-900">Gesamt</span>
              <span className="text-2xl font-bold text-garden-600">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-garden-600 hover:bg-garden-700 text-white py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? 'Wird erstellt...' : 'Bestellung aufgeben'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
