'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Home } from 'lucide-react'

export default function AboutPage() {
  const testimonials = [
    {
      quote: "Finding a verified luxury apartment used to take weeks. The curated recommendations here made my move completely seamless.",
      name: "Emma Rodriguez",
      title: "Design Consultant",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      quote: "Finally, a rental platform that understands premium aesthetics. The property verification saves hours of browsing.",
      name: "Sarah Chen",
      title: "Architectural Director",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
    },
    {
      quote: "The quality of modern stays on this platform is unmatched. Every home I've booked has matched the exact specs listed.",
      name: "Maria Santos",
      title: "Remote Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      quote: "The instant booking and verified landlord profiles give total peace of mind. It’s like having a personal housing concierge.",
      name: "Jessica Park",
      title: "Real Estate Investor",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-28">

        {/* SECTION 1: Bento Grid / Why Choose Us */}
        <section className="text-center">
          {/* Header Pill */}
          <div className="inline-block mb-4">
            <span className="bg-neutral-200/60 border border-neutral-300/50 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
              Innovation
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            Why modern renters choose LUXURA
          </h1>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto mb-16">
            Exceptional property curation and transparent booking systems that set the standard for modern living.
          </p>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
            
            {/* Left Large Card (Tall) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-5 bg-neutral-200/50 rounded-3xl p-8 flex flex-col justify-between min-h-[480px]"
            >
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" 
                  alt="Curated Living" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold leading-snug text-neutral-900 mb-6">
                  Curated by real estate experts to deliver architectural excellence and unmatched comfort.
                </h3>
                <Link 
                  href="/all-properties"
                  className="inline-flex items-center gap-3 bg-neutral-900 text-white text-xs font-semibold px-6 py-3.5 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Explore Properties
                  <span className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                    <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Right Side Stack */}
            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Top Left Medium Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-neutral-200/50 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div className="h-32 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                    alt="Trusted Network" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-neutral-900 leading-snug">
                  Trusted by <span className="text-neutral-400 font-normal">discerning tenants worldwide.</span>
                </h4>
              </motion.div>

              {/* Top Right Metric Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-neutral-200/50 rounded-3xl p-6 flex items-center justify-between"
              >
                <div>
                  <div className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">98%</div>
                  <p className="text-neutral-500 text-xs mt-2">Verified landlord satisfaction rate.</p>
                </div>
                <div className="w-16 h-28 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Home size={32} />
                </div>
              </motion.div>

              {/* Bottom Wide Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 bg-neutral-200/50 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative"
              >
                <div className="max-w-xs z-10">
                  <h3 className="text-xl font-bold text-neutral-900 leading-snug">
                    Elevates lifestyle standards and <span className="text-neutral-400 font-normal">transforms house hunting into a luxury experience.</span>
                  </h3>
                </div>
                <div className="w-full md:w-64 h-44 rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" 
                    alt="Luxury Interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* SECTION 2: Testimonials Slider / Grid */}
        <section className="text-center">
          {/* Header Pill */}
          <div className="inline-block mb-4">
            <span className="bg-neutral-200/60 border border-neutral-300/50 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
              Testimonials
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            What our clients say
          </h2>
          <p className="text-neutral-500 text-sm md:text-base max-w-xl mx-auto mb-16">
            Hear from industry leaders and tenants who trust LUXURA for their most important living moments.
          </p>

          {/* Testimonials Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-8">
            {testimonials.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="bg-neutral-200/50 rounded-3xl p-6 flex flex-col justify-between h-72 border border-transparent hover:border-neutral-300 transition-all duration-300"
              >
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  "{item.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-300/40">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">{item.name}</h5>
                    <p className="text-[10px] text-neutral-400 font-medium">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-start items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-neutral-200/80 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-full bg-neutral-200/80 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}