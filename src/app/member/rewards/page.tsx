'use client'

import { useEffect } from 'react'
import { useMemberStore } from '@/lib/store/member-store'
import { formatPrice } from '@/lib/utils/format'
import { Gift, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MemberRewardsPage() {
  const { member, rewards, loading, loadMemberData } = useMemberStore()

  useEffect(() => { loadMemberData() }, [loadMemberData])

  if (loading) {
    return <div className="min-h-screen bg-[#faf8f0] flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-3 border-garden-300 border-t-garden-600 rounded-full animate-spin" />
    </div>
  }

  const currentPoints = member?.current_points || 0

  return (
    <div className="min-h-screen bg-[#faf8f0] pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/member/dashboard" className="flex items-center gap-2 text-garden-600 hover:text-garden-700 text-sm mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Rewards</h1>
          <div className="flex items-center gap-1 bg-garden-50 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-garden-700">{currentPoints} Punkte</span>
          </div>
        </div>

        {rewards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Noch keine Rewards verfügbar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rewards.map(reward => {
              const canRedeem = currentPoints >= reward.point_cost
              return (
                <div key={reward.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${canRedeem ? 'border-garden-200' : 'border-gray-100 opacity-60'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{reward.name}</h3>
                      {reward.description && <p className="text-sm text-gray-500 mt-1">{reward.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          reward.type === 'free_product' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {reward.type === 'free_product' ? 'Gratis Produkt' : `${formatPrice(reward.discount_amount || 0)} Rabatt`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-gray-900">{reward.point_cost}</span>
                      </div>
                      <span className={`text-xs ${canRedeem ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                        {canRedeem ? 'Einlösbar an der Kassa' : 'Nicht genug Punkte'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
