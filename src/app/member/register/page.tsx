'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerMember } from '@/lib/actions/auth'
import { User, Lock, Phone, UserCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function MemberRegisterPage() {
  const [form, setForm] = useState({ username: '', name: '', phone: '', password: '', passwordConfirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)
    try {
      const result = await registerMember({
        username: form.username,
        password: form.password,
        name: form.name,
        phone: form.phone || undefined,
      })
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/member/dashboard')
      }
    } catch {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-[#faf8f0] flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Registrierung</h1>
          <p className="text-gray-500">Erstelle ein Konto und sammle Treuepunkte</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Benutzername</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={update('username')}
                  placeholder="max.muster"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none transition"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Max Mustermann"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+43 664 1234567"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min. 6 Zeichen"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passwort bestätigen</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.passwordConfirm}
                  onChange={update('passwordConfirm')}
                  placeholder="Passwort wiederholen"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-garden-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-garden-600 hover:bg-garden-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Wird erstellt...' : 'Konto erstellen'}
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">Bereits ein Konto? </span>
            <Link href="/member/login" className="text-garden-600 hover:text-garden-700 text-sm font-semibold">
              Anmelden
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
