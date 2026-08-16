'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, Heart, User, LogOut, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { authClient } from '@/lib/auth-client'

const TenantDashboard = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession()
  const user = session?.user as any
  const router = useRouter()

  interface BookingItem {
    _id: string
    propertyTitle: string
    createdAt?: string
    amount: number
    status: string
    paymentStatus?: string
  }

  interface FavoriteItem {
    _id: string
    image?: string
    title: string
    location: string
    price: number
  }

  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  // Guard: wait for session before fetching
  useEffect(() => {
    if (!user) return
    if (activeTab === 'bookings') {
      fetchBookings()
    } else if (activeTab === 'favorites') {
      fetchFavorites()
    }
  }, [activeTab, user])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/bookings/mine?email=${user?.email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/favorites?email=${user?.email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch favorites')
      const data = await response.json()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!user?.email) {
      toast.error('Please log in')
      return
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/favorites/${propertyId}?email=${user.email}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.ok) {
        toast.success('Removed from favorites')
        fetchFavorites()
      } else {
        toast.error('Failed to remove favorite')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/')
    } catch {
      toast.error('Logout failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading while session is resolving
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Show fallback if no user after session loads
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
          <Link href="/login" className="text-primary-600 hover:underline font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tenant Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {[
            { id: 'bookings', label: 'My Bookings', Icon: Calendar },
            { id: 'favorites', label: 'Favorites', Icon: Heart },
            { id: 'profile', label: 'Profile', Icon: User }
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No bookings yet.{' '}
                  <Link href="/all-properties" className="text-primary-600 hover:underline">
                    Browse properties
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking: BookingItem) => (
                        <tr key={booking._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">{booking.propertyTitle}</td>
                          <td className="py-3 px-4">
                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="py-3 px-4 font-semibold">${booking.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus || 'pending')}`}>
                              {booking.paymentStatus || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">My Favorites</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No favorites yet.{' '}
                  <Link href="/all-properties" className="text-primary-600 hover:underline">
                    Browse properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((property: FavoriteItem) => (
                    <div key={property._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                        alt={property.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-600">${property.price}/mo</span>
                          <button
                            onClick={() => handleRemoveFavorite(property._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove from favorites"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{user.name || 'Unknown'}</h3>
                <p className="text-gray-600">{user.email || 'No email'}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium capitalize">
                  {user.role || 'tenant'}
                </span>
              </div>
            </div>
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-800 mb-4">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <p className="font-medium">{user.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <p className="font-medium">{user.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Role</label>
                  <p className="font-medium capitalize">{user.role || 'tenant'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TenantDashboard