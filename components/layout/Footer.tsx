'use client'
import React from 'react'
import Link from 'next/link'
import { BarChart3, Send,  ArrowRight } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Trust & Safety', href: '/trust' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    properties: [
      { label: 'Apartments', href: '/all-properties?type=apartment' },
      { label: 'Houses', href: '/all-properties?type=house' },
      { label: 'Studios', href: '/all-properties?type=studio' },
      { label: 'Villas', href: '/all-properties?type=villa' },
    ],
  }

  const socialLinks = [
    {  href: '#', label: 'Facebook' },
    {  href: '#', label: 'Twitter' },
    {  href: '#', label: 'Instagram' },
    {  href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-[#161616] px-6 pt-16 pb-8 text-white md:px-12">
      <div className="mx-auto max-w-[1200px]">
        
        {/* ================= TOP: NEWSLETTER CTA ================= */}
        <div className="mb-16 grid items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:grid-cols-2 md:p-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Get the best properties <br /> in your inbox
            </h3>
            <p className="mt-3 max-w-sm text-sm text-neutral-400">
              Subscribe to our newsletter and never miss out on the latest verified rental listings and market insights.
            </p>
          </div>
          
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-5 transition focus-within:border-[#E4573D]"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4573D] text-white transition hover:bg-[#d14a2e]"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* ================= MIDDLE: LINKS GRID ================= */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#161616]">
                <BarChart3 size={18} />
              </span>
              <span className="text-xl font-bold tracking-tight">Brickwise</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
              Discover thousands of verified rental properties. Book securely and move in with total confidence.
            </p>
            
            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-neutral-400 transition hover:border-[#E4573D] hover:bg-[#E4573D] hover:text-white"
                >
                 
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-neutral-300 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= BOTTOM: COPYRIGHT BAR ================= */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-neutral-500">
            © {currentYear} Brickwise. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer