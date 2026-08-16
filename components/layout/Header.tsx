'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BarChart3,
  ChevronRight,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client' // Adjust import path to your Better Auth client instance

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/all-properties' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const Header: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null) // State to hold user data

  // Better Auth session hook
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    setUser(session?.user)
  }, [session])

  const sessionUser = session?.user as any

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setOpen(false)
          setUserMenuOpen(false)
          router.push('/')
          router.refresh()
        },
      },
    })
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/20 bg-[#FBFAF8]/80 px-6 py-4 backdrop-blur-md transition-all md:px-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#161616] text-white shadow-md transition hover:scale-105">
          <BarChart3 size={18} />
        </span>
        <span className="text-lg font-bold tracking-tight text-[#161616]">Brickwise</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
        {navLinks.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.label}
              href={link.href}
              className={
                active
                  ? "relative font-semibold text-[#161616] after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#161616] after:content-['']"
                  : 'transition hover:text-[#161616]'
              }
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Actions / Session Section */}
      <div className="flex items-center gap-4">
        {!isPending && (
          <>
            {session ? (
              /* Authenticated User Menu */
              <div className="relative hidden items-center gap-3 sm:flex">
                <Link
                  href={`/dashboard/${((sessionUser?.role || 'tenant') as string).toLowerCase()}`}
                  className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-[#161616] backdrop-blur-sm transition hover:bg-white hover:shadow-sm"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>

                {/* Profile Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 p-1.5 pr-3 text-sm font-semibold text-[#161616] backdrop-blur-sm transition hover:bg-white"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161616] text-xs text-white">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                    <span className="max-w-[100px] truncate">{session.user.name || 'Account'}</span>
                    <ChevronDown size={14} className="text-neutral-500" />
                  </button>

                  {/* Profile Glassmorphism Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/40 bg-white/80 p-2 shadow-xl backdrop-blur-lg">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-black/5 hover:text-[#161616]"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-black/5 hover:text-[#161616]"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <hr className="my-1 border-black/5" />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Unauthenticated Actions */
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/auth/login"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-70"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 rounded-full bg-[#161616] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-black hover:shadow-lg"
                >
                  Join Now <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </>
        )}

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#161616] text-white transition hover:scale-105 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-white/20 bg-[#FBFAF8]/95 px-6 pb-6 pt-4 shadow-xl backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={pathname === link.href ? 'font-semibold text-[#161616]' : 'text-neutral-500'}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 border-t border-black/5 pt-4">
            {session ? (
              <div className="flex flex-col gap-2.5">
                <div className="mb-2 flex items-center gap-3 px-1">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161616] text-xs text-white">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#161616]">{session.user.name}</span>
                    <span className="text-xs text-neutral-500">{session.user.email}</span>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-center text-sm font-semibold"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  href={`/dashboard/${((sessionUser?.role || 'tenant') as string).toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full bg-[#161616] px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/50 px-5 py-2.5 text-sm font-semibold text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-black/10 bg-white/50 px-5 py-2.5 text-center text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#161616] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Join Now <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header