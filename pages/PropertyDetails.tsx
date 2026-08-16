'use client'

import { FormEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Home as HomeIcon, Bath, Bed, DollarSign, Heart, 
  Calendar, Phone, User, Star, X, Check, Shield, Wifi, 
  Car, Droplets, Wind, Flame, ArrowLeft, Sparkles, CreditCard 
} from 'lucide-react'

import toast from 'react-hot-toast'
import { useSession } from '@/lib/auth-client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe outside component render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PropertyDetail {
  _id: string
  title: string
  location: string
  price: number
  propertyType?: string
  rentType?: string
  bedrooms: number
  bathrooms: number
  propertySize: number
  description: string
  amenities?: string[]
  image?: string
  ownerId?: string
  ownerName?: string
  createdAt?: string
}

interface Review {
  userName?: string
  userEmail?: string
  rating: number
  comment: string
  createdAt?: string
}

interface BookingData {
  moveInDate: string
  contactNumber: string
  userInfo: string
  additionalNotes: string
}

interface NewReview {
  rating: number
  comment: string
}

const amenityIcons: Record<string, React.ReactNode> = {
  'wifi': <Wifi size={14} />,
  'parking': <Car size={14} />,
  'pool': <Droplets size={14} />,
  'ac': <Wind size={14} />,
  'heating': <Flame size={14} />,
}

// Sub-component handling card input & confirmation inside Stripe Elements context
function StripePaymentForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess: (paymentIntentId: string) => void
  onCancel: () => void 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setSubmitting(true)

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (result.error) {
        toast.error(result.error.message || 'Payment processing failed.')
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        toast.success('Payment verified!')
        onSuccess(result.paymentIntent.id)
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected payment error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50/80 border border-gray-200/60 rounded-2xl">
        <PaymentElement />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="w-1/3 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-semibold text-sm disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 text-sm"
        >
          <CreditCard size={18} />
          {submitting ? 'Processing...' : 'Pay & Confirm'}
        </button>
      </div>
    </form>
  )
}

const PropertyDetails = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data, isPending } = useSession()
  const user = data?.user
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    moveInDate: '',
    contactNumber: '',
    userInfo: '',
    additionalNotes: ''
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 5,
    comment: ''
  })
  const [hoveredStar, setHoveredStar] = useState(0)
  const [lastBookingPayload, setLastBookingPayload] = useState<any>(null)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const resolved = await fetchProperty()
      if (!mounted) return
      if (resolved) {
        await fetchReviews(resolved._id || (resolved as any).id || id)
      } else {
        await fetchReviews(id)
      }

      // if (user) checkFavorite()
    })()

    return () => { mounted = false }
  }, [id, user])

  const fetchProperty = async () => {
    let resolved: any = null
    try {
      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/properties/${id}`)
          const data = await response.json()
          resolved = data?.property || data?.data || data
        } catch (err) {
          console.warn('Direct property fetch failed', err)
        }
      }

      if (!resolved || !(resolved._id || (resolved as any).id)) {
        try {
          const searchRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/properties?search=${encodeURIComponent(id || '')}`)
          const searchData = await searchRes.json()
          const arr = searchData.properties || searchData.data || searchData || []
          if (Array.isArray(arr)) {
            const found = arr.find((p: any) => p._id === id || p.id === id || p.slug === id || p.title === id)
            if (found) resolved = found
          }
        } catch (err) {
          console.warn('Search property fetch failed', err)
        }
      }

      if (!resolved || !(resolved._id || (resolved as any).id)) {
        try {
          const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/properties`)
          const allData = await allRes.json()
          const allArr = allData.properties || allData.data || allData || []
          if (Array.isArray(allArr)) {
            const found = allArr.find((p: any) => p._id === id || p.id === id || p.slug === id || p.title === id)
            if (found) resolved = found
          }
        } catch (err) {
          console.warn('Fallback property fetch failed', err)
        }
      }

      setProperty(resolved)
      return resolved
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async (propId?: string) => {
    const pid = propId || id
    if (!pid) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/reviews/property/${pid}`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  // const checkFavorite = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/favorites?email=${user?.email}`)
  //     const data = await response.json()
  //     setIsFavorite(data.some((p: any) => p._id === id))
  //   } catch (error) {
  //     console.error('Error checking favorite:', error)
  //   }
  // }

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error('Please login to add to favorites')
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId: id,
          userEmail: user.email
        })
      })

      if (response.ok) {
        setIsFavorite(true)
        toast.success('Added to favorites!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to add to favorites')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user || !user.email) {
      toast.error('You must be logged in to book a property.')
      return
    }

    if (!property) {
      toast.error('Property details are not loaded yet.')
      return
    }

    try {
      const payload = {
        propertyId: (property as any)._id || (property as any).id || id,
        tenantEmail: user.email,
        tenantName: user.name || user.email,
        ownerId: (property as any).ownerId || (property as any).owner?._id || (property as any).owner || '',
        ownerName: property.ownerName || (property as any).owner?.name || '',
        ownerEmail: (property as any).ownerEmail || (property as any).owner?.email || '',
        propertyTitle: property.title || (property as any).name || '',
        propertyLocation: property.location || (property as any).address || '',
        amount: (property as any).price ?? (property as any).amount ?? 0,
        image: property.image || (property as any).photo || '',
        ...bookingData
      }

      console.log('Booking payload created:', payload)
      setLastBookingPayload(payload)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: payload.amount,
          bookingData: payload
        })
      })

      const data = await response.json()

      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret)
        setIsPaying(true)
      } else {
        toast.error(data.error || 'Failed to initialize payment gateway')
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      toast.error('An error occurred while setting up the payment')
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!lastBookingPayload) return

    try {
      const finalPayload = {
        ...lastBookingPayload,
        paymentStatus: 'paid',
        status: 'pending',
        paymentId: paymentIntentId
      }

      const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalPayload)
      })

      const bookingData = await bookingResponse.json()
      const bookingId = bookingData?._id || bookingData?.booking?._id || bookingData?.data?._id || null

      const transactionPayload = {
        transactionId: paymentIntentId,
        bookingId,
        propertyId: lastBookingPayload.propertyId,
        tenantEmail: lastBookingPayload.tenantEmail,
        ownerEmail: lastBookingPayload.ownerEmail,
        amount: Number(lastBookingPayload.amount || 0),
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        createdAt: new Date().toISOString(),
      }

      const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(transactionPayload)
      })

      const transactionData = await transactionResponse.json()

      if (bookingResponse.ok && transactionResponse.ok) {
        toast.success('Payment, booking, and transaction saved successfully!')
        setShowBookingModal(false)
        setIsPaying(false)
        setClientSecret(null)
      } else {
        const message = transactionData?.error || bookingData?.error || 'Payment succeeded, but saving the booking/transaction failed.'
        toast.error(message)
      }
    } catch (error) {
      console.error('Booking or transaction save error:', error)
      toast.error('An error occurred while saving your booking and transaction details')
    }
  }

  const handleReviewSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId: id,
          userEmail: user?.email,
          userName: user?.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      })

      if (response.ok) {
        toast.success('Review submitted!')
        setNewReview({ rating: 5, comment: '' })
        fetchReviews()
      } else {
        toast.error('Failed to submit review')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const key = amenity.toLowerCase()
    return amenityIcons[key] || <Sparkles size={14} />
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-full border-2 border-gray-200 border-t-primary-500 backdrop-blur-sm"
        />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-xl shadow-gray-200/50 rounded-3xl p-10 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HomeIcon size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Property Not Found</h2>
          <p className="text-gray-500 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/all-properties" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 rounded-xl transition-all duration-300 font-medium"
          >
            <ArrowLeft size={18} />
            Browse Properties
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to listings
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="relative mb-8 rounded-3xl overflow-hidden group shadow-2xl shadow-gray-200/50">
              <div className="relative h-[28rem] md:h-[32rem]">
                <img
                  src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
                    <Shield size={16} className="text-emerald-600" />
                    <span className="text-gray-800 text-sm font-semibold">Verified Property</span>
                  </div>
                </div>

                <div className="absolute top-6 right-6">
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-3 shadow-lg">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">${property.price}</span>
                      <span className="text-gray-600 text-sm">
                        {property.rentType === 'monthly' ? '/mo' : property.rentType === 'weekly' ? '/wk' : '/day'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
                    {property.title}
                  </motion.h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin size={18} className="text-primary-300" />
                    <span className="text-lg drop-shadow-md">{property.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <Bed size={22} />, label: 'Bedrooms', value: property.bedrooms },
                    { icon: <Bath size={22} />, label: 'Bathrooms', value: property.bathrooms },
                    { icon: <HomeIcon size={22} />, label: 'Sq Ft', value: property.propertySize },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg shadow-gray-100/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
                        {stat.icon}
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                      <span className="text-gray-500 text-sm mt-1">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-lg shadow-gray-100/50">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-primary-500" />
                    About this property
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-[15px]">{property.description}</p>
                </motion.div>

                {property.amenities && property.amenities.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-lg shadow-gray-100/50">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                      <Check size={20} className="text-emerald-500" />
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {property.amenities.map((amenity: string, index: number) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * index }} className="group flex items-center gap-2.5 bg-white/80 border border-gray-200/60 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
                          <span className="text-primary-500">{getAmenityIcon(amenity)}</span>
                          <span className="text-gray-700 text-sm font-medium capitalize">{amenity}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-lg shadow-gray-100/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>
                      <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200/60 rounded-full px-3 py-1 shadow-sm">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-800 text-sm font-medium">{averageRating}</span>
                        <span className="text-gray-400 text-sm">({reviews.length})</span>
                      </div>
                    </div>
                  </div>

                  {user && (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-white/80 border border-gray-200/60 rounded-2xl shadow-sm">
                      <h4 className="text-gray-700 font-medium mb-4 text-sm uppercase tracking-wider">Write a review</h4>
                      <div className="mb-4">
                        <div className="flex gap-1.5 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({...newReview, rating: star})}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star size={26} className={`transition-colors duration-200 ${star <= (hoveredStar || newReview.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Share your experience with this property..."
                          className="w-full bg-white/80 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none text-sm shadow-inner"
                          rows={3}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="px-6 py-2.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 rounded-xl transition-all duration-300 text-sm font-medium shadow-sm">
                        Submit Review
                      </button>
                    </form>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Star size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      reviews.map((review, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="bg-white/80 border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center border border-gray-200/60">
                                <span className="text-gray-700 font-semibold text-sm">{review.userName?.charAt(0).toUpperCase() || 'U'}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{review.userName || 'Anonymous'}</h4>
                                <p className="text-gray-400 text-xs">{review.userEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed pl-14">{review.comment}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-lg shadow-gray-100/50">
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => {
                          setIsPaying(false)
                          setShowBookingModal(true)
                        }}
                        className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                      >
                        <Calendar size={18} />
                        Book Now
                      </button>
                      <button
                        onClick={handleAddToFavorites}
                        className={`p-3.5 rounded-xl border transition-all duration-300 shadow-sm ${
                          isFavorite 
                            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
                            : 'bg-white/80 border-gray-200/60 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                        }`}
                      >
                        <Heart size={20} className={isFavorite ? 'fill-red-500' : ''} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: <User size={18} />, label: 'Owner', value: property.ownerName || 'Property Owner' },
                        { icon: <DollarSign size={18} />, label: 'Rent Type', value: property.rentType || 'Monthly' },
                        { icon: <Calendar size={18} />, label: 'Listed On', value: property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/60 border border-gray-100/60">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-primary-500">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">{item.label}</p>
                            <p className="text-gray-800 text-sm font-medium capitalize">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-xl border border-emerald-200/60 rounded-3xl p-6 shadow-lg shadow-gray-100/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Shield size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-800 font-semibold text-sm">Secure Booking</h4>
                        <p className="text-gray-500 text-xs">Verified & Protected</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Your booking is protected by our secure payment system and verified property checks.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal & Stripe Payment View */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowBookingModal(false)
              setIsPaying(false)
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {isPaying ? 'Complete Payment' : 'Book Property'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {isPaying ? 'Enter payment details to confirm' : 'Complete your booking details'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setIsPaying(false)
                  }}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-gray-50/80 border border-gray-200/60 rounded-2xl p-4 mb-6 flex items-center gap-4">
                <img 
                  src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'} 
                  alt={property.title}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <h4 className="text-gray-800 font-medium text-sm line-clamp-1">{property.title}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">{property.location}</p>
                  <p className="text-primary-600 font-semibold text-sm mt-1">${property.price}
                    <span className="text-gray-400 font-normal text-xs">
                      {property.rentType === 'monthly' ? '/mo' : property.rentType === 'weekly' ? '/wk' : '/day'}
                    </span>
                  </p>
                </div>
              </div>

              {!isPaying ? (
                /* Step 1: Booking Form */
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Move-in Date</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-white/80 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all text-sm shadow-inner"
                      value={bookingData.moveInDate}
                      onChange={(e) => setBookingData({...bookingData, moveInDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Contact Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-white/80 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all text-sm shadow-inner"
                      placeholder="+1 234 567 890"
                      value={bookingData.contactNumber}
                      onChange={(e) => setBookingData({...bookingData, contactNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      className="w-full bg-white/80 border border-gray-200/80 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all resize-none text-sm shadow-inner"
                      rows={3}
                      placeholder="Any special requests or notes..."
                      value={bookingData.additionalNotes}
                      onChange={(e) => setBookingData({...bookingData, additionalNotes: e.target.value})}
                    />
                  </div>
                  
                  <div className="bg-gray-50/80 border border-gray-200/60 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-sm">Subtotal</span>
                      <span className="text-gray-700 text-sm">${property.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-500 text-sm">Service Fee</span>
                      <span className="text-gray-700 text-sm">$0</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="text-gray-800 font-medium">Total</span>
                      <span className="text-2xl font-bold text-primary-600">${property.price}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                  >
                    <CreditCard size={18} />
                    Proceed to Payment
                  </button>
                </form>
              ) : (
                /* Step 2: Stripe Payment Form */
                clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm 
                      onSuccess={(paymentId) => handlePaymentSuccess(paymentId)} 
                      onCancel={() => setIsPaying(false)} 
                    />
                  </Elements>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Panel */}
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          className="mb-2 px-3 py-2 rounded-lg bg-black text-white text-sm shadow-lg"
        >
          {showDebugPanel ? 'Hide Debug' : 'Show Debug'}
        </button>
        {showDebugPanel && (
          <div className="w-80 max-h-96 overflow-auto bg-white/95 border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
            <div className="mb-2 font-semibold text-sm">Fetched Property</div>
            <pre className="whitespace-pre-wrap break-words text-[11px] text-gray-700">{JSON.stringify(property, null, 2)}</pre>
            <div className="mt-3 mb-2 font-semibold text-sm">Last Booking Payload</div>
            <pre className="whitespace-pre-wrap break-words text-[11px] text-gray-700">{JSON.stringify(lastBookingPayload, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetails