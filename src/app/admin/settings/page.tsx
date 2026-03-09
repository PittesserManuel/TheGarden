'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Montag', tuesday: 'Dienstag', wednesday: 'Mittwoch', thursday: 'Donnerstag',
  friday: 'Freitag', saturday: 'Samstag', sunday: 'Sonntag',
}

type DaySchedule = { open: string; close: string; closed: boolean }
type LocationData = {
  id: string; name: string; address: string; phone: string; email: string
  opening_hours: Record<string, DaySchedule>
  features: { member_system: boolean; delivery: boolean }
}

export default function SettingsPage() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('locations').select('*').single()
      if (data) setLocation(data as any)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!location) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('locations').update({
      name: location.name, address: location.address, phone: location.phone, email: location.email,
      opening_hours: location.opening_hours, features: location.features,
    }).eq('id', location.id)

    if (error) toast.error(error.message)
    else toast.success('Einstellungen gespeichert')
    setSaving(false)
  }

  const updateField = (field: string, value: string) => setLocation(l => l ? { ...l, [field]: value } : l)
  const updateHours = (day: string, field: string, value: string | boolean) =>
    setLocation(l => l ? { ...l, opening_hours: { ...l.opening_hours, [day]: { ...l.opening_hours[day], [field]: value } } } : l)
  const updateFeature = (key: string, value: boolean) =>
    setLocation(l => l ? { ...l, features: { ...l.features, [key]: value } } : l)

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" /></div>
  if (!location) return <p className="text-gray-500 py-8 text-center">Keine Location gefunden.</p>

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-garden-600 hover:bg-garden-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Speichern...' : 'Speichern'}
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Restaurant-Informationen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={location.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input type="text" value={location.address || ''} onChange={e => updateField('address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input type="text" value={location.phone || ''} onChange={e => updateField('phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input type="email" value={location.email || ''} onChange={e => updateField('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm" /></div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Öffnungszeiten</h2>
        <div className="space-y-3">
          {DAYS.map(day => {
            const schedule = location.opening_hours?.[day] || { open: '09:00', close: '22:00', closed: false }
            return (
              <div key={day} className="flex items-center gap-4">
                <span className="w-28 text-sm font-medium text-gray-700">{DAY_LABELS[day]}</span>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!schedule.closed} onChange={e => updateHours(day, 'closed', !e.target.checked)} />
                  <span className="text-sm text-gray-500">Offen</span>
                </label>
                {!schedule.closed && (
                  <>
                    <input type="time" value={schedule.open} onChange={e => updateHours(day, 'open', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <span className="text-gray-400">–</span>
                    <input type="time" value={schedule.close} onChange={e => updateHours(day, 'close', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Features</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={location.features?.member_system ?? true} onChange={e => updateFeature('member_system', e.target.checked)} />
            <div><span className="text-sm font-medium text-gray-700">Mitgliedersystem</span>
              <p className="text-xs text-gray-400">Kunden können sich registrieren und Treuepunkte sammeln</p></div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={location.features?.delivery ?? false} onChange={e => updateFeature('delivery', e.target.checked)} />
            <div><span className="text-sm font-medium text-gray-700">Lieferung</span>
              <p className="text-xs text-gray-400">Lieferservice aktivieren</p></div>
          </label>
        </div>
      </div>
    </div>
  )
}
