// ===== OPENING HOURS =====

export type DaySchedule = {
  open: string    // "HH:MM" e.g. "11:00"
  close: string   // "HH:MM" e.g. "22:00"
  closed: boolean
}

export type OpeningHours = {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

// ===== LOCATION =====

export type Location = {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  opening_hours: OpeningHours
  theme_colors: {
    primary: string
    secondary: string
  }
  features: {
    member_system: boolean
    delivery: boolean
  }
  created_at: string
}

// ===== PROFILES =====

export type UserRole = 'admin' | 'worker' | 'customer'

export type Profile = {
  id: string
  username: string
  name: string | null
  role: UserRole
  email: string
  phone: string | null
  location_id: string | null
  created_at: string
}

// ===== CATEGORIES =====

export type Category = {
  id: string
  location_id: string
  name: string
  description: string | null
  icon: string | null
  station: string // 'kitchen' | 'bar' | 'dessert'
  sort_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

// ===== PRODUCTS =====

export type Product = {
  id: string
  location_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  tags: string[] // 'beliebt', 'vegan', 'vegetarisch', 'gesund'
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

// ===== ORDERS =====

export type OrderMode = 'dine_in' | 'to_go'
export type PaidStatus = 'unpaid' | 'paid'
export type CompleteStatus = 'unfinished' | 'in_progress' | 'finished'
export type PickupStatus = 'open' | 'picked_up'

export type StationStatus = {
  kitchen?: boolean
  bar?: boolean
  dessert?: boolean
}

export type Order = {
  id: string
  location_id: string
  order_number: number
  customer_name: string | null
  order_mode: OrderMode
  complete_status: CompleteStatus
  paid_status: PaidStatus
  pickup_status: PickupStatus
  station_status: StationStatus
  member_id: string | null
  total: number
  notes: string | null
  created_by: string | null
  created_at: string
  items?: OrderItem[]
}

// ===== ORDER ITEMS =====

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  notes: string | null
  status: CompleteStatus
}

// ===== ORDER COUNTER =====

export type OrderCounter = {
  location_id: string
  current_number: number
}

// ===== MEMBERS & LOYALTY =====

export type Member = {
  id: string
  user_id: string
  location_id: string
  current_points: number
  lifetime_points: number
  created_at: string
  profile?: Profile
}

export type PointTransactionType = 'earned' | 'redeemed' | 'adjusted'

export type PointTransaction = {
  id: string
  member_id: string
  points: number
  type: PointTransactionType
  order_id: string | null
  note: string | null
  created_at: string
}

// ===== REWARDS =====

export type RewardType = 'free_product' | 'discount'

export type Reward = {
  id: string
  location_id: string
  name: string
  description: string | null
  type: RewardType
  product_id: string | null
  discount_amount: number | null
  point_cost: number
  is_active: boolean
  sort_order: number
  created_at: string
  product?: Product
}

// ===== CART (Client-side für Kassa) =====

export type CartItem = {
  id: string // unique cart line id
  product: Product
  quantity: number
  notes?: string
  is_reward?: boolean
}

// ===== DASHBOARD =====

export type DashboardStats = {
  ordersToday: number
  revenueToday: number
  revenueData: { date: string; revenue: number; orders: number }[]
  topProducts: { name: string; quantity: number; revenue: number }[]
  recentOrders: Order[]
}
