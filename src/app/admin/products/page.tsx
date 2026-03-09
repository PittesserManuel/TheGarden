'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/store/admin-store'
import { formatPrice } from '@/lib/utils/format'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function ProductsPage() {
  const { products, categories, fetchAll, addProduct, updateProduct, deleteProduct } = useAdminStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '', tags: '' as string, image_url: '', is_available: true, sort_order: '0'
  })

  useEffect(() => { fetchAll() }, [fetchAll])

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category_id: '', tags: '', image_url: '', is_available: true, sort_order: '0' })
    setEditId(null)
    setShowForm(false)
  }

  const openEdit = (product: any) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category_id: product.category_id || '',
      tags: (product.tags || []).join(', '),
      image_url: product.image_url || '',
      is_available: product.is_available,
      sort_order: String(product.sort_order || 0),
    })
    setEditId(product.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      category_id: form.category_id,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      image_url: form.image_url || undefined,
      is_available: form.is_available,
      sort_order: parseInt(form.sort_order) || 0,
    }

    if (editId) {
      const result = await updateProduct(editId, payload)
      if (result.success) { toast.success('Produkt aktualisiert'); resetForm() }
      else toast.error(result.error || 'Fehler')
    } else {
      const result = await addProduct(payload)
      if (result.success) { toast.success('Produkt erstellt'); resetForm() }
      else toast.error(result.error || 'Fehler')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" wirklich löschen?`)) return
    const result = await deleteProduct(id)
    if (result.success) toast.success('Gelöscht')
    else toast.error(result.error || 'Fehler')
  }

  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produkte</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-garden-600 hover:bg-garden-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Neues Produkt
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Produkt suchen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-garden-500 outline-none"
        >
          <option value="all">Alle Kategorien</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Produkt bearbeiten' : 'Neues Produkt'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preis (€) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie *</label>
              <select value={form.category_id} onChange={e => setForm(f => ({...f, category_id: e.target.value}))} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm">
                <option value="">Wählen...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (kommagetrennt)</label>
              <input type="text" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="beliebt, vegan, vegetarisch"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bild URL</label>
              <input type="url" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_available} onChange={e => setForm(f => ({...f, is_available: e.target.checked}))} id="available" />
              <label htmlFor="available" className="text-sm text-gray-700">Verfügbar</label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-garden-600 hover:bg-garden-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
              {editId ? 'Speichern' : 'Erstellen'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition">
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Produkt</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Kategorie</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Preis</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Tags</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  {product.description && <div className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</div>}
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-gray-500">
                  {product.category?.icon} {product.category?.name || '–'}
                </td>
                <td className="py-3 px-4 font-semibold">{formatPrice(product.price)}</td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {(product.tags || []).map(tag => (
                      <span key={tag} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tag === 'beliebt' ? 'bg-amber-100 text-amber-700' :
                        tag === 'vegan' ? 'bg-green-100 text-green-700' :
                        tag === 'vegetarisch' ? 'bg-emerald-100 text-emerald-700' :
                        tag === 'gesund' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {product.is_available ? (
                    <Eye className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-garden-50 text-gray-400 hover:text-garden-600 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id, product.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-gray-400 text-sm py-8 text-center">Keine Produkte gefunden.</p>
        )}
      </div>
    </div>
  )
}
