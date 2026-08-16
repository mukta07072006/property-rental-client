'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Building2, Mail, Lock, User, Camera, UserPlus } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const userRole = formData.role?.trim() || 'tenant'

    const { data, error } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.photo || undefined,
      role: userRole,
      callback: '/'
    })

    if (error) {
      toast.error(error.message || 'Registration failed')
      setLoading(false)
      return
    }

    if (data) {
      const storedUser = { ...data.user, role: userRole }
      localStorage.setItem('user', JSON.stringify(storedUser))
      toast.success('Account created successfully!')
      router.push('/')
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
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join thousands of renters and property owners</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  className="input-field pl-10"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.photo}
                  onChange={(e) => setFormData({...formData, photo: e.target.value})}
                />
              </div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Tenant"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
              
            </div>

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
                  minLength={6}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Create Account'}
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
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
