'use client'

import { useEffect } from 'react'
import { useMemberStore } from '@/lib/store/member-store'
import { formatPrice, formatDate } from '@/lib/utils/format'
import { Star, Gift, ClipboardList, LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MemberDashboardPage() {
  const { profile, member, transactions, rewards, loading, loadMemberData } = useMemberStore()
  const router = useRouter()

  useEffect(() => { loadMemberData() }, [loadMemberData])

  async function handleLogout() {
    await logout()
    useMemberStore.getState().clear()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen bg-[#faf8f0] flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="min-h-screen bg-[#faf8f0] pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Hallo, {profile?.name || profile?.username}!</h1>
            <p className="text-gray-500 mt-1">Willkommen in deinem Mitgliederbereich</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition">
            <LogOut className="w-4 h-4" /> Abmelden
          </button>
        </div>

        {/* Points Card */}
        <div className="bg-gradient-to-br from-garden-600 to-garden-800 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-amber-300" />
            <div>
              <p className="text-sm text-garden-200">Deine Treuepunkte</p>
              <p className="text-4xl font-bold">{member?.current_points || 0}</p>
            </div>
          </div>
          <p className="text-sm text-garden-200">Gesamt gesammelt: {member?.lifetime_points || 0} Punkte</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/member/rewards" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <Gift className="w-6 h-6 text-garden-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Rewards</h3>
            <p className="text-xs text-gray-400 mt-1">{rewards.length} verfügbar</p>
          </Link>
          <Link href="/member/orders" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
            <ClipboardList className="w-6 h-6 text-garden-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Bestellungen</h3>
            <p className="text-xs text-gray-400 mt-1">Bestellhistorie ansehen</p>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Punktebewegungen</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Noch keine Transaktionen.</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">{t.note || t.type}</p>
                    <p className="text-xs text-gray-400">{formatDate(t.created_at)}</p>
                  </div>
                  <span className={`text-sm font-bold ${t.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {t.points >= 0 ? '+' : ''}{t.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
