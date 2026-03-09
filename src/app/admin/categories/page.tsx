'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/store/admin-store'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const STATIONS = [
  { value: 'kitchen', label: 'Küche' },
  { value: 'bar', label: 'Bar' },
  { value: 'dessert', label: 'Dessert' },
]

export default function CategoriesPage() {
  const { categories, fetchAll, addCategory, updateCategory, deleteCategory } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', icon: '', station: 'kitchen', sort_order: '0', is_visible: true
  })

  useEffect(() => { fetchAll() }, [fetchAll])

  const resetForm = () => {
    setForm({ name: '', description: '', icon: '', station: 'kitchen', sort_order: '0', is_visible: true })
    setEditId(null)
    setShowForm(false)
  }

  const openEdit = (cat: any) => {
    setForm({
      name: cat.name, description: cat.description || '', icon: cat.icon || '',
      station: cat.station || 'kitchen', sort_order: String(cat.sort_order || 0), is_visible: cat.is_visible
    })
    setEditId(cat.id)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name, description: form.description || undefined, icon: form.icon || undefined,
      station: form.station, sort_order: parseInt(form.sort_order) || 0, is_visible: form.is_visible,
    }

    if (editId) {
      const r = await updateCategory(editId, payload)
      if (r.success) { toast.success('Gespeichert'); resetForm() } else toast.error(r.error || 'Fehler')
    } else {
      const r = await addCategory(payload)
      if (r.success) { toast.success('Erstellt'); resetForm() } else toast.error(r.error || 'Fehler')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" wirklich löschen?`)) return
    const r = await deleteCategory(id)
    if (r.success) toast.success('Gelöscht')
    else toast.error(r.error || 'Fehler')
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kategorien</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 bg-garden-600 hover:bg-garden-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
          <Plus className="w-4 h-4" /> Neue Kategorie
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
              <input type="text" value={form.icon} onChange={e => setForm(f => ({...f, icon: e.target.value}))} placeholder="🍽️"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
              <select value={form.station} onChange={e => setForm(f => ({...f, station: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm">
                {STATIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 self-end pb-1">
              <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({...f, is_visible: e.target.checked}))} id="visible" />
              <label htmlFor="visible" className="text-sm text-gray-700">Sichtbar</label>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Kategorie</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Station</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Sortierung</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium">Sichtbar</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="mr-2">{cat.icon}</span>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  {cat.description && <span className="text-xs text-gray-400 ml-2">{cat.description}</span>}
                </td>
                <td className="py-3 px-4 hidden sm:table-cell text-gray-500 capitalize">{cat.station}</td>
                <td className="py-3 px-4 hidden md:table-cell text-gray-400">{cat.sort_order}</td>
                <td className="py-3 px-4 text-center">
                  {cat.is_visible ? <Eye className="w-4 h-4 text-green-500 mx-auto" /> : <EyeOff className="w-4 h-4 text-gray-300 mx-auto" />}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-garden-50 text-gray-400 hover:text-garden-600 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="text-gray-400 text-sm py-8 text-center">Keine Kategorien vorhanden.</p>}
      </div>
    </div>
  )
}
