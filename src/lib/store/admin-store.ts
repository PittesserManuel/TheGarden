import { create } from 'zustand'
import type { Product, Category, Order, Reward, Member, Location } from '@/lib/types/database'
import * as productActions from '@/lib/actions/products'
import * as categoryActions from '@/lib/actions/categories'
import * as orderActions from '@/lib/actions/orders'

interface AdminStore {
  products: Product[]
  categories: Category[]
  orders: Order[]
  rewards: Reward[]
  members: Member[]
  location: Location | null
  isLoading: boolean
  isInitialized: boolean

  fetchAll: (force?: boolean) => Promise<void>
  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchOrders: (filters?: { date_from?: string; date_to?: string }) => Promise<void>
  fetchTodayOrders: () => Promise<void>

  addProduct: (product: any) => Promise<{ success: boolean; error?: string }>
  updateProduct: (id: string, updates: any) => Promise<{ success: boolean; error?: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>

  addCategory: (category: any) => Promise<{ success: boolean; error?: string }>
  updateCategory: (id: string, updates: any) => Promise<{ success: boolean; error?: string }>
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>

  updateOrder: (id: string, updates: any) => Promise<{ success: boolean; error?: string }>
}

export const useAdminStore = create<AdminStore>()((set, get) => ({
  products: [],
  categories: [],
  orders: [],
  rewards: [],
  members: [],
  location: null,
  isLoading: false,
  isInitialized: false,

  fetchAll: async (force?: boolean) => {
    if (get().isInitialized && !force) return
    set({ isLoading: true })
    try {
      await Promise.all([
        get().fetchProducts(),
        get().fetchCategories(),
        get().fetchTodayOrders(),
      ])
    } catch (e) {
      console.error('[admin-store] fetchAll error:', e)
    }
    set({ isLoading: false, isInitialized: true })
  },

  fetchProducts: async () => {
    try {
      const result = await productActions.getProducts()
      if ('data' in result && result.data) set({ products: result.data as Product[] })
    } catch (e) {
      console.error('[admin-store] fetchProducts error:', e)
    }
  },

  fetchCategories: async () => {
    try {
      const result = await categoryActions.getCategories()
      if ('data' in result && result.data) set({ categories: result.data as Category[] })
    } catch (e) {
      console.error('[admin-store] fetchCategories error:', e)
    }
  },

  fetchOrders: async (filters) => {
    try {
      const result = await orderActions.getOrders(filters)
      if ('data' in result && result.data) set({ orders: result.data as Order[] })
    } catch (e) {
      console.error('[admin-store] fetchOrders error:', e)
    }
  },

  fetchTodayOrders: async () => {
    try {
      const result = await orderActions.getTodayOrders()
      if ('data' in result && result.data) set({ orders: result.data as Order[] })
    } catch (e) {
      console.error('[admin-store] fetchTodayOrders error:', e)
    }
  },

  // === Product CRUD with optimistic updates ===
  addProduct: async (product) => {
    const result = await productActions.createProduct(product)
    if ('error' in result && result.error) return { success: false, error: result.error }
    await get().fetchProducts()
    return { success: true }
  },

  updateProduct: async (id, updates) => {
    // Optimistic update
    set({
      products: get().products.map(p => p.id === id ? { ...p, ...updates } : p),
    })
    const result = await productActions.updateProduct(id, updates)
    if ('error' in result && result.error) {
      await get().fetchProducts() // Rollback
      return { success: false, error: result.error }
    }
    return { success: true }
  },

  deleteProduct: async (id) => {
    const prev = get().products
    set({ products: prev.filter(p => p.id !== id) })
    const result = await productActions.deleteProduct(id)
    if ('error' in result && result.error) {
      set({ products: prev }) // Rollback
      return { success: false, error: result.error }
    }
    return { success: true }
  },

  // === Category CRUD ===
  addCategory: async (category) => {
    const result = await categoryActions.createCategory(category)
    if ('error' in result && result.error) return { success: false, error: result.error }
    await get().fetchCategories()
    return { success: true }
  },

  updateCategory: async (id, updates) => {
    set({
      categories: get().categories.map(c => c.id === id ? { ...c, ...updates } : c),
    })
    const result = await categoryActions.updateCategory(id, updates)
    if ('error' in result && result.error) {
      await get().fetchCategories()
      return { success: false, error: result.error }
    }
    return { success: true }
  },

  deleteCategory: async (id) => {
    const prev = get().categories
    set({ categories: prev.filter(c => c.id !== id) })
    const result = await categoryActions.deleteCategory(id)
    if ('error' in result && result.error) {
      set({ categories: prev })
      return { success: false, error: result.error }
    }
    return { success: true }
  },

  // === Order Updates ===
  updateOrder: async (id, updates) => {
    set({
      orders: get().orders.map(o => o.id === id ? { ...o, ...updates } : o),
    })
    const result = await orderActions.updateOrder(id, updates)
    if ('error' in result && result.error) {
      await get().fetchTodayOrders()
      return { success: false, error: result.error }
    }
    return { success: true }
  },
}))
