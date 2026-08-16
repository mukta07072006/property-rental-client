'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Camera, Save, Edit3, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })

  // Populate form data once the session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        location: (session.user as any).location || '',
        bio: (session.user as any).bio || ''
      })
    }
  }, [session])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Call your backend API or authClient method to update user profile
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-900" size={28} />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-neutral-900">Access Denied</h2>
        <p className="text-xs text-neutral-500 mt-1">Please log in to view your profile settings.</p>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER BADGE */}
        <div className="text-center">
          <div className="inline-block mb-2">
            <span className="bg-neutral-200/60 border border-neutral-300/50 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
              Account
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Personal Profile
          </h1>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-200/50 rounded-3xl p-6 text-center relative overflow-hidden flex flex-col items-center"
            >
              <div className="relative mb-4 group">
                <img 
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=171717&color=fff`} 
                  alt={user.name || 'User Avatar'} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors shadow-md">
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">{user.email}</p>

              {(user as any).role && (
                <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-3 py-1 rounded-full capitalize">
                  <ShieldCheck size={14} />
                  {(user as any).role}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: PERSONAL INFO FORM */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-200/50 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-neutral-300/50">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Personal Information</h3>
                  <p className="text-xs text-neutral-500">Manage your personal account details.</p>
                </div>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isEditing ? (
                    <><Save size={14} /> {loading ? 'Saving...' : 'Save'}</>
                  ) : (
                    <><Edit3 size={14} /> Edit</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-xl px-4 py-2.5 text-xs text-neutral-900 disabled:opacity-70 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-xl px-4 py-2.5 text-xs text-neutral-900 opacity-60 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    placeholder="Add phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-xl px-4 py-2.5 text-xs text-neutral-900 disabled:opacity-70 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">Location</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    placeholder="Add your location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-xl px-4 py-2.5 text-xs text-neutral-900 disabled:opacity-70 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-neutral-400 mb-1">Bio</label>
                <textarea 
                  rows={4}
                  disabled={!isEditing}
                  placeholder="Write a short bio about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-xl p-4 text-xs text-neutral-900 disabled:opacity-70 focus:outline-none focus:border-neutral-800 resize-none transition-colors"
                />
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  )
}