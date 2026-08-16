'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Building2, Mail, Lock, LogIn } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      toast.error(error.message || 'Login failed')
      setLoading(false)
      return
    }

    if (data) {
      try {
          const userRole = (data.user as any)?.role || 'tenant'
          const userPayload = { ...(data.user as any), role: userRole }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/jwt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.user.email,
            role: userRole,
          }),
        })

        const jwtData = await res.json()

        if (jwtData.token) {
          localStorage.setItem('token', jwtData.token)
          toast.success('Login successful!')
          router.push('/')
        } else {
          toast.error('Failed to issue access token')
        }
      } catch (err) {
        console.error(err)
        toast.error('Server error during token creation')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="w-10 h-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-800">PropertyHub</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

           
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
