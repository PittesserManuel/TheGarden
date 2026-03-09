'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import { Users, Search, Star } from 'lucide-react'

type MemberRow = {
  id: string
  current_points: number
  lifetime_points: number
  created_at: string
  profile: { name: string | null; username: string; email: string; phone: string | null } | null
}

export default function MembersPage() {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('members')
        .select('*, profile:profiles(name, username, email, phone)')
        .order('lifetime_points', { ascending: false })

      setMembers((data || []) as any)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = members.filter(m => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      m.profile?.name?.toLowerCase().includes(s) ||
      m.profile?.username?.toLowerCase().includes(s) ||
      m.profile?.email?.toLowerCase().includes(s)
    )
  })

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" />
    </div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mitglieder</h1>
        <span className="text-sm text-gray-400">{members.length} Mitglieder</span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mitglied suchen..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Keine Mitglieder gefunden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Mitglied</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Username</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Punkte</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Gesamt</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Mitglied seit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{m.profile?.name || '–'}</div>
                    <div className="text-xs text-gray-400">{m.profile?.email}</div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-gray-500">@{m.profile?.username}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-gray-900">{m.current_points}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center hidden md:table-cell text-gray-400">{m.lifetime_points}</td>
                  <td className="py-3 px-4 hidden lg:table-cell text-gray-400">{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
