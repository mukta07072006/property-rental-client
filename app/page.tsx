'use client'

import React, { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  Home as HomeIcon,
  Star,
  Shield,
  Clock,
  Heart,
  BedDouble,
  Bath,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import DimensionStatsGrid, { StatsGrid } from '@/components/layout/Stats'
import Stats from '@/components/layout/Stats'

// Types & Interfaces
interface SearchParams {
  location: string
  propertyType: string
  minPrice: string
  maxPrice: string
}

interface Property {
  _id: string
  title: string
  location: string
  price: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  image: string
}

interface Review {
  name: string
  email: string
  rating: number
  comment: string
  date: string
}

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

// Light street-map backdrop for the hero (swap with your own asset anytime)

const Home: React.FC = () => {
  const router = useRouter()

  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  })

  const featuredProperties: Property[] = [
    {
      _id: '1',
      title: 'Modern Apartment in Downtown',
      location: 'New York, NY',
      price: 2500,
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    },
    {
      _id: '2',
      title: 'Cozy Family House',
      location: 'Los Angeles, CA',
      price: 3500,
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 3,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    },
    {
      _id: '3',
      title: 'Luxury Penthouse',
      location: 'Miami, FL',
      price: 5000,
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    },
    {
      _id: '4',
      title: 'Studio Apartment',
      location: 'Chicago, IL',
      price: 1200,
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    },
    {
      _id: '5',
      title: 'Beachfront Villa',
      location: 'San Diego, CA',
      price: 4500,
      propertyType: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    },
    {
      _id: '6',
      title: 'Urban Loft',
      location: 'Seattle, WA',
      price: 2800,
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    },
      {
      _id: '7',
      title: 'Studio Apartment',
      location: 'Chicago, IL',
      price: 1200,
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    },
     {
      _id: '8',
      title: 'Luxury Penthouse',
      location: 'Miami, FL',
      price: 5000,
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    },
  ]

  const heroProperty = featuredProperties[2]
  const isValidObjectId = (val: any) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val)

  const mapPins = [
    { top: '22%', left: '14%', img: featuredProperties[0].image },
    { top: '38%', left: '26%', img: featuredProperties[1].image },
    { top: '60%', left: '18%', img: featuredProperties[3].image },
    { top: '30%', left: '38%', img: featuredProperties[4].image },
    { top: '26%', left: '82%', img: featuredProperties[5].image },
    { top: '56%', left: '78%', img: featuredProperties[1].image },
  ]

  const stats = [
    { value: '20K+', label: ['Happy', 'Customers'] },
    { value: '150K+', label: ['Properties', 'Listed'] },
    { value: '120+', label: ['Cities', 'Covered'] },
    { value: '4.9/5', label: ['Average', 'Rating'] },
  ]

  const reviews: Review[] = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      rating: 5,
      comment: 'Amazing platform! Found my dream apartment within days. The booking process was seamless.',
      date: '2024-01-15',
    },
    {
      name: 'Michael Chen',
      email: 'michael@example.com',
      rating: 5,
      comment: 'Great experience as a property owner. Easy to list properties and manage bookings.',
      date: '2024-01-10',
    },
    {
      name: 'Emily Davis',
      email: 'emily@example.com',
      rating: 4,
      comment: 'Very user-friendly interface. The search filters helped me find exactly what I needed.',
      date: '2024-01-08',
    },
    {
      name: 'James Wilson',
      email: 'james@example.com',
      rating: 5,
      comment: 'Secure payment system and excellent customer support. Highly recommended!',
      date: '2024-01-05',
    },
  ]

  const features: Feature[] = [
    { icon: Shield, title: 'Secure Payments', description: 'All transactions are protected with Stripe payment gateway' },
    { icon: Clock, title: 'Instant Booking', description: 'Book your property instantly with our streamlined process' },
    { icon: Heart, title: 'Verified Listings', description: 'All properties are verified by our team for quality assurance' },
  ]

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    const keys: Array<keyof SearchParams> = ['location', 'propertyType', 'minPrice', 'maxPrice']

    keys.forEach((key) => {
      const value = searchParams[key]
      if (value) params.append(key, value)
    })

    router.push(`/all-properties?${params.toString()}`)
  }

   const { data: session, isPending } = authClient.useSession();
   const user = session?.user;
  console.log('User session:', session) // Log the user session to the console

  return (
    <div className="min-h-screen bg-[#E9E7E2] px-3 py-4 text-[#161616] antialiased md:px-6 md:py-8">
      {/* ============ ROUNDED PAGE CARD ============ */}
      <div className="mx-auto max-w-full overflow-hidden rounded-[24px] border border-black/5 bg-[#F7F6F2] shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
    

        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
           <img
              src="/map.png"
              alt="City map"
              className="pointer-events-none absolute inset-x-0 bottom-0 top-28 w-full object-cover opacity-10 brightness-110 contrast-75"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-300 bg-gradient-to-b from-white/95 to-transparent" />
          <div className="relative z-10 px-6 pt-14 text-center md:pt-16">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-1.5 text-[11px] font-semibold text-neutral-600 shadow-sm"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#E4573D] text-white">
                <Sparkles size={9} />
              </span>
              Now live in 120+ cities
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl"
            >
              Easily Find Your Perfect Rental
              <br />
              to Love
              <span className="mx-2 inline-block h-[0.72em] w-[1.5em] translate-y-[0.1em] overflow-hidden rounded-full ring-1 ring-black/10">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200"
                  alt="Cozy home"
                  className="h-full w-full object-cover"
                />
              </span>
              Where You Live
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-sm text-neutral-500 md:text-base"
            >
              Take control of your next move — browse verified listings, transparent pricing and instant booking across
              thousands of rental properties.
            </motion.p>
          </div>

          {/* Search bar (floats over the map) */}
          <div className="relative z-30 mx-auto mt-10 h-4xl max-w-1/2">
            <form
              onSubmit={handleSearch}
              className="flex flex-col items-stretch gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.14)] md:flex-row md:items-center md:gap-0 md:p-2 md:pl-6"
            >
              <div className="flex-1 md:pr-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={14} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400 md:hidden" />
                  <input
                    type="text"
                    placeholder="All Locations"
                    className="w-full bg-transparent pt-0.5 text-sm font-semibold outline-none placeholder:text-neutral-400 md:pl-0"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="hidden h-8 w-px bg-neutral-200 md:block" />

              <div className="flex-1 md:px-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Property Type
                </label>
                <select
                  className="w-full cursor-pointer bg-transparent pt-0.5 text-sm font-semibold outline-none"
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({ ...searchParams, propertyType: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <div className="hidden h-8 w-px bg-neutral-200 md:block" />

              <div className="flex-1 md:px-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Budget
                </label>
                <input
                  type="number"
                  placeholder="$500 - $5,000"
                  className="w-full bg-transparent pt-0.5 text-sm font-semibold outline-none placeholder:text-neutral-400"
                  value={searchParams.maxPrice}
                  onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                />
              </div>

              <button
                type="submit"
                aria-label="Search"
                className="grid h-11 w-11 shrink-0 place-items-center self-end rounded-full bg-[#161616] text-white transition hover:bg-[#E4573D] md:self-auto"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Map hero */}
          <div className="relative -mt-6 h-[560px] overflow-hidden">
           
            

            {/* Circular property pins */}
            {mapPins.map((pin, i) => (
              <motion.img
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                src={pin.img}
                alt="Property"
                style={{ top: pin.top, left: pin.left }}
                className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full object-cover shadow-lg ring-2 ring-white transition hover:scale-110"
              />
            ))}

            {/* Featured property card */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="absolute left-1/2 top-14 w-[272px] -translate-x-1/2 rounded-2xl bg-white p-3 shadow-[0_28px_70px_rgba(0,0,0,0.20)]"
            >
              <div className="relative">
                <img src={heroProperty.image} alt={heroProperty.title} className="h-32 w-full rounded-xl object-cover" />
                <span className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold shadow">
                  New
                </span>
              </div>
              <div className="px-1.5 pb-1 pt-3">
                <h3 className="text-sm font-bold">{heroProperty.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin size={12} /> {heroProperty.location}
                </p>
                <div className="mt-3 flex items-center gap-3 border-y border-neutral-100 py-2 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <BedDouble size={12} /> {heroProperty.bedrooms} bed
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={12} /> {heroProperty.bathrooms} bath
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <HomeIcon size={12} /> {heroProperty.propertyType}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2.5">
                  <p className="text-sm font-extrabold">
                    ${heroProperty.price.toLocaleString()}
                    <span className="text-[10px] font-medium text-neutral-400">/mo</span>{' '}
                    <span className="text-[10px] font-bold text-emerald-500">• Available</span>
                  </p>
                  <Link
                    href={user ? (isValidObjectId(heroProperty._id) ? `/property/${heroProperty._id}` : '/all-properties') : '/login'}
                    className="text-xs font-bold text-[#E4573D] transition hover:opacity-70"
                  >
                    View Now
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Count bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="absolute left-1/2 top-[420px] grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-[#161616] text-xs font-bold text-white shadow-xl ring-4 ring-white/70"
            >
              20
            </motion.div>
          </div>
        </section>

          <Stats/>
       
        {/* ============ REASON TO CHOOSE US ============ */}
        <section className="grid gap-12 px-6 py-16 md:grid-cols-2 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-[#E4573D]">- Reason to choose us</p>
            <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight md:text-4xl">
              Discover the value behind smart rental decisions
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-500">
              We handle the heavy lifting by verifying every listing, analyzing the numbers, and finding high-performing
              homes for you.
            </p>
            <Link
              href="/all-properties"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#161616] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Find the best for you <ChevronRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* AI search card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-black/5 bg-[#EFEEEA] p-5"
            >
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs text-neutral-400 shadow-sm">
                <Search size={12} /> Search with AI
              </div>
              <h3 className="mt-8 text-sm font-bold">Smart Suggestions</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                AI scans listings to find your best-fit property.
              </p>
            </motion.div>

            {/* Trusted card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-black/5 bg-[#EFEEEA] p-5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#161616] text-white">
                <ShieldCheck size={18} />
              </div>
              <h3 className="mt-8 text-sm font-bold">99% Trusted Platform</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                Users trust our picks and return for more deals.
              </p>
            </motion.div>

            {/* Dotted map card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative min-h-[260px] overflow-hidden rounded-2xl border border-black/5 bg-[#EFEEEA] p-5 sm:col-span-2"
            >
              <div className="absolute inset-0 [background-image:radial-gradient(#d9d6cf_1.2px,transparent_1.2px)] [background-size:12px_12px]" />

              <svg
                className="absolute left-[10%] top-12 h-24 w-1/2 text-neutral-400"
                viewBox="0 0 300 100"
                fill="none"
              >
                <path d="M10 20 C 110 95, 200 5, 290 65" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" />
              </svg>

              <span className="absolute left-[18%] top-8 rounded-full bg-[#E4573D] px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                $1,200/mo
              </span>

              {/* Stacked photo */}
              <div className="absolute right-5 top-6 w-44">
                <div className="absolute inset-0 -rotate-6 rounded-xl bg-white/70 shadow-md" />
                <div className="relative rotate-3 rounded-xl bg-white p-2 shadow-xl">
                  <img
                    src={featuredProperties[0].image}
                    alt={featuredProperties[0].title}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <p className="mt-2 truncate px-1 text-[11px] font-bold">{featuredProperties[0].title}</p>
                  <p className="px-1 pb-1 text-[10px] text-neutral-400">{featuredProperties[0].location}</p>
                </div>
              </div>

              <div className="relative mt-32 max-w-[260px]">
                <h3 className="text-sm font-bold">Live Where It Matters</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  We pinpoint high-demand, high-quality neighborhoods backed by market data.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ FEATURED PROPERTIES ============ */}
        <section className="px-6 pb-16 md:px-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-[#E4573D]">- Featured properties</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Hand-picked homes for you</h2>
            </div>
            <Link
              href="/all-properties"
              className="hidden items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-[#161616] md:flex"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold shadow">
                    ${property.price.toLocaleString()}/mo
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-[#161616]/80 px-3 py-1 text-[10px] font-semibold capitalize text-white">
                    {property.propertyType}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{property.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin size={12} /> {property.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={14} /> {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath size={14} /> {property.bathrooms} Baths
                    </span>
                    <Link
                      href={user ? (isValidObjectId(property._id) ? `/property/${property._id}` : '/all-properties') : '/login'}
                      aria-label="View details"
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#161616] text-white transition hover:bg-[#E4573D]"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ WHY CHOOSE US (FEATURES) ============ */}
        <section className="border-y border-black/5 bg-[#FBFAF8] px-6 py-14 md:px-12">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#161616] text-white">
                    <IconComponent size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ============ REVIEWS ============ */}
        <section className="px-6 py-16 md:px-12">
          <div className="mb-10">
            <p className="text-xs font-bold text-[#E4573D]">- Customer reviews</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">What our customers say</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {reviews.map((review, index) => (
              <motion.div
                key={review.email}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E4573D]/10 font-bold text-[#E4573D]">
                      {review.name.charAt(0)}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold">{review.name}</h4>
                      <p className="text-[11px] text-neutral-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-[#E4573D] text-[#E4573D]' : 'text-neutral-200'}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ TOP LOCATIONS ============ */}
        <section className="px-6 pb-16 md:px-12">
          <div className="mb-10">
            <p className="text-xs font-bold text-[#E4573D]">- Top locations</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Popular destinations for renters</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { city: 'New York', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', count: 320 },
              { city: 'Los Angeles', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600', count: 260 },
              { city: 'Miami', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600', count: 190 },
              { city: 'Chicago', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', count: 150 },
            ].map((loc, index) => (
              <motion.div
                key={loc.city}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={`/all-properties?location=${encodeURIComponent(loc.city)}`}
                  className="group relative block h-44 overflow-hidden rounded-2xl"
                >
                  <img
                    src={loc.img}
                    alt={loc.city}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="font-bold">{loc.city}</p>
                    <p className="text-[11px] opacity-80">{loc.count}+ properties</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

     
    </div>
  )
}

export default Home