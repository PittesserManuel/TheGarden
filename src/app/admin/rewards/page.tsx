'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { Plus, Pencil, Trash2, Gift } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import type { Reward, Product } from '@/lib/types/database'
import { formatPrice } from '@/lib/utils/format'

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', type: 'free_product' as 'free_product' | 'discount',
    product_id: '', discount_amount: '', point_cost: '100', is_active: true, sort_order: '0',
  })

  async function loadData() {
    const supabase = createClient()
    const [rewardsRes, productsRes] = await Promise.all([
      supabase.from('rewards').select('*').order('sort_order'),
      supabase.from('products').select('id, name, price').order('name'),
    ])
    setRewards((rewardsRes.data || []) as Reward[])
    setProducts((productsRes.data || []) as Product[])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', type: 'free_product', product_id: '', discount_amount: '', point_cost: '100', is_active: true, sort_order: '0' })
    setEditId(null)
    setShowForm(false)
  }

  const openEdit = (r: Reward) => {
    setForm({
      name: r.name, description: r.description || '', type: r.type,
      product_id: r.product_id || '', discount_amount: String(r.discount_amount || ''),
      point_cost: String(r.point_cost), is_active: r.is_active, sort_order: String(r.sort_order),
    })
    setEditId(r.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const payload = {
      name: form.name, description: form.description || null, type: form.type,
      product_id: form.product_id || null, discount_amount: form.discount_amount ? parseFloat(form.discount_amount) : null,
      point_cost: parseInt(form.point_cost), is_active: form.is_active, sort_order: parseInt(form.sort_order) || 0,
      location_id: process.env.NEXT_PUBLIC_LOCATION_ID!,
    }

    if (editId) {
      const { error } = await supabase.from('rewards').update(payload).eq('id', editId)
      if (error) toast.error(error.message)
      else { toast.success('Gespeichert'); resetForm(); loadData() }
    } else {
      const { error } = await supabase.from('rewards').insert(payload)
      if (error) toast.error(error.message)
      else { toast.success('Erstellt'); resetForm(); loadData() }
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" wirklich löschen?`)) return
    const supabase = createClient()
    const { error } = await supabase.from('rewards').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Gelöscht'); loadData() }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" /></div>

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-garden-600 hover:bg-garden-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
          <Plus className="w-4 h-4" /> Neuer Reward
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Reward bearbeiten' : 'Neuer Reward'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as any}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm">
                <option value="free_product">Gratis Produkt</option><option value="discount">Rabatt</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
            {form.type === 'free_product' && (
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Produkt</label>
                <select value={form.product_id} onChange={e => setForm(f => ({...f, product_id: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm">
                  <option value="">Wählen...</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.price)})</option>)}</select></div>
            )}
            {form.type === 'discount' && (
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Rabatt (€)</label>
                <input type="number" step="0.01" value={form.discount_amount} onChange={e => setForm(f => ({...f, discount_amount: e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
            )}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Punkte-Kosten *</label>
              <input type="number" value={form.point_cost} onChange={e => setForm(f => ({...f, point_cost: e.target.value}))} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
            <div className="flex items-center gap-2 self-end pb-1">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))} id="active" />
              <label htmlFor="active" className="text-sm text-gray-700">Aktiv</label></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-garden-600 hover:bg-garden-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">{editId ? 'Speichern' : 'Erstellen'}</button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition">Abbrechen</button>
          </div>
        </form>
      )}

      {rewards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Noch keine Rewards angelegt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{r.name}</h3>
                  {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.type === 'free_product' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {r.type === 'free_product' ? 'Gratis Produkt' : `Rabatt ${formatPrice(r.discount_amount || 0)}`}
                    </span>
                    <span className="text-xs text-gray-400">{r.point_cost} Punkte</span>
                    {!r.is_active && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">Inaktiv</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-garden-50 text-gray-400 hover:text-garden-600 transition"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(r.id, r.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
