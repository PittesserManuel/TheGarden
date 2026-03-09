import { create } from 'zustand'
import type { Member, Profile, PointTransaction, Reward } from '@/lib/types/database'
import { createClient } from '@/lib/supabase/client'

type MemberState = {
  profile: Profile | null
  member: Member | null
  transactions: PointTransaction[]
  rewards: Reward[]
  loading: boolean

  // Actions
  loadMemberData: () => Promise<void>
  clear: () => void
}

export const useMemberStore = create<MemberState>((set) => ({
  profile: null,
  member: null,
  transactions: [],
  rewards: [],
  loading: false,

  loadMemberData: async () => {
    set({ loading: true })
    const supabase = createClient()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        set({ profile: null, member: null, transactions: [], rewards: [], loading: false })
        return
      }

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // Load member
      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      // Load transactions if member exists
      let transactions: PointTransaction[] = []
      if (member) {
        const { data } = await supabase
          .from('point_transactions')
          .select('*')
          .eq('member_id', member.id)
          .order('created_at', { ascending: false })
          .limit(50)
        transactions = data || []
      }

      // Load available rewards
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      set({
        profile: profile || null,
        member: member || null,
        transactions,
        rewards: rewards || [],
        loading: false,
      })
    } catch (error) {
      console.error('Failed to load member data:', error)
      set({ loading: false })
    }
  },

  clear: () => set({ profile: null, member: null, transactions: [], rewards: [], loading: false }),
}))
