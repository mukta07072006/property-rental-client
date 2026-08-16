'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Rental Inquiry',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API submission
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent.')
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Rental Inquiry',
        message: ''
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* SECTION 1: Header */}
        <section className="text-center max-w-2xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-neutral-200/60 border border-neutral-300/50 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
              Get in Touch
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            We’re here to help you find home
          </h1>
          <p className="text-neutral-500 text-sm md:text-base">
            Have questions about a listing, verified properties, or host partnerships? Reach out to our dedicated support team.
          </p>
        </section>

        {/* SECTION 2: Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-5">

            {/* Main Image Banner Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-neutral-200/50 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800" 
                  alt="Customer Concierge" 
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative z-10">
                <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center mb-4">
                  <MessageSquare size={16} />
                </span>
                <h3 className="text-xl font-bold text-neutral-900">Personalized Concierge</h3>
                <p className="text-neutral-600 text-xs mt-1">Direct support from our property verification specialists.</p>
              </div>
            </motion.div>

            {/* Direct Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-neutral-200/50 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-300/60 flex items-center justify-center text-neutral-800 mb-6">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">Email Us</p>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5">support@luxura.com</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-neutral-200/50 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-300/60 flex items-center justify-center text-neutral-800 mb-6">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">Call Us</p>
                  <p className="text-xs font-bold text-neutral-900 mt-0.5">+1 (800) 458-9872</p>
                </div>
              </motion.div>

            </div>

            {/* Office & Hours */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-neutral-200/50 rounded-3xl p-6 flex flex-col justify-between gap-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-300/60 flex items-center justify-center text-neutral-800 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Headquarters</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">740 Park Avenue, 12th Floor, New York, NY 10021</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-neutral-300/40">
                <div className="w-8 h-8 rounded-full bg-neutral-300/60 flex items-center justify-center text-neutral-800 shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Support Hours</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">Monday – Friday: 9am – 8pm EST</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 bg-neutral-200/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">Send us a message</h3>
              <p className="text-neutral-500 text-xs md:text-sm mb-8">
                Fill out the form below and a luxury housing advisor will respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-2xl px-4 py-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-2xl px-4 py-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-2xl px-4 py-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Inquiry Type</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-2xl px-4 py-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-800 transition-colors"
                    >
                      <option value="Rental Inquiry">Rental Inquiry</option>
                      <option value="Property Verification">Property Verification</option>
                      <option value="Host Partnership">Host Partnership</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us about your rental preferences or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-neutral-100/80 border border-neutral-300/60 rounded-2xl p-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-800 transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-neutral-900 text-white text-xs font-semibold px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <span className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                    <ArrowRight size={12} />
                  </span>
                </button>

              </form>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  )
}