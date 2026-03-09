'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ClipboardList,
  Users,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  ChefHat,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produkte', icon: Package },
  { href: '/admin/categories', label: 'Kategorien', icon: FolderOpen },
  { href: '/admin/orders', label: 'Bestellungen', icon: ClipboardList },
  { href: '/admin/members', label: 'Mitglieder', icon: Users },
  { href: '/admin/rewards', label: 'Rewards', icon: Gift },
  { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-garden-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-garden-800">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-garden-400" />
              <div>
                <h1 className="text-lg font-serif font-bold">The Garden</h1>
                <p className="text-xs text-garden-400">Admin Panel</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-garden-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-garden-700 text-white'
                      : 'text-garden-300 hover:bg-garden-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Quick Links */}
          <div className="px-3 py-2 border-t border-garden-800">
            <Link
              href="/kassa"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-garden-300 hover:bg-garden-800 hover:text-white transition"
            >
              <ClipboardList className="w-5 h-5" />
              Kassa öffnen
            </Link>
          </div>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-garden-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-garden-300 hover:bg-red-900/30 hover:text-red-300 transition w-full"
            >
              <LogOut className="w-5 h-5" />
              Abmelden
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-gray-500 hover:text-garden-600 transition">
            Website ansehen &rarr;
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
