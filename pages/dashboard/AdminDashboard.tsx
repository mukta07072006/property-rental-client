'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Building2, Calendar, DollarSign, LogOut, Edit2, Trash2, Check, X, Eye, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

type AdminUser = {
  _id: string
  name: string
  email: string
  role: 'tenant' | 'owner' | 'admin'
}

type AdminProperty = {
  _id: string
  title: string
  ownerName: string
  location: string
  price: number
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

type AdminBooking = {
  _id: string
  tenantName: string
  tenantEmail: string
  propertyTitle: string
  amount: number
  status: string
  createdAt: string
}

type AdminTransaction = {
  _id: string
  transactionId?: string
  propertyId?: string
  propertyTitle?: string
  tenantName?: string
  tenantEmail?: string
  ownerName?: string
  ownerEmail?: string
  amount: number
  date?: string
  createdAt?: string
}

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [newRole, setNewRole] = useState('')

  const normalizeResponseArray = <T,>(data: unknown, fallbackKey?: string): T[] => {
    if (Array.isArray(data)) return data as T[]

    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>
      const possibleKeys = [fallbackKey, 'data', 'result', 'users', 'properties', 'bookings', 'transactions']

      for (const key of possibleKeys) {
        if (!key) continue
        const value = record[key]
        if (Array.isArray(value)) return value as T[]
      }
    }

    return []
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedRole = storedUser ? JSON.parse(storedUser)?.role : null
    const currentRole = user?.role || storedRole

    if (!currentRole || currentRole !== 'admin') {
      toast.error('Admin access required')
      router.push('/')
      return
    }

    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'properties') {
      fetchProperties()
    } else if (activeTab === 'bookings') {
      fetchBookings()
    } else if (activeTab === 'transactions') {
      fetchTransactions()
    }
  }, [activeTab, user, router])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setUsers(normalizeResponseArray<AdminUser>(data, 'users'))
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/properties`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setProperties(normalizeResponseArray<AdminProperty>(data, 'properties'))
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setBookings(normalizeResponseArray<AdminBooking>(data, 'bookings'))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/transactions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setTransactions(normalizeResponseArray<AdminTransaction>(data, 'transactions'))
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role })
      })

      if (response.ok) {
        toast.success('Role updated successfully')
        fetchUsers()
      } else {
        toast.error('Failed to update role')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handlePropertyAction = async (propertyId: string, action: 'approved' | 'rejected', reason = '') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/admin/properties/${propertyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: action, rejectionReason: reason })
      })

      if (response.ok) {
        toast.success(`Property ${action} successfully`)
        setShowRejectionModal(false)
        setRejectionReason('')
        fetchProperties()
      } else {
        toast.error(`Failed to ${action} property`)
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast.success('Property deleted successfully')
        fetchProperties()
      } else {
        toast.error('Failed to delete property')
      }
    } catch (error) {
      toast.error('An error occurred')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users size={20} />
            All Users
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === 'properties'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Building2 size={20} />
            All Properties
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar size={20} />
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <DollarSign size={20} />
            Transactions
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Users</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((userItem) => (
                        <tr key={userItem._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{userItem.name}</td>
                          <td className="py-3 px-4">{userItem.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              userItem.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={userItem.role}
                              onChange={(e) => handleChangeRole(userItem._id, e.target.value)}
                            >
                              <option value="tenant">Tenant</option>
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>
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

        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Properties</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{property.title}</td>
                          <td className="py-3 px-4">{property.ownerName}</td>
                          <td className="py-3 px-4">{property.location}</td>
                          <td className="py-3 px-4 font-semibold">${property.price}/mo</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {property.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handlePropertyAction(property._id, 'approved')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedProperty(property)
                                      setShowRejectionModal(true)
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              {property.status === 'rejected' && (
                                <button
                                  onClick={() => {
                                      setSelectedProperty(property)
                                      setShowRejectionModal(true)
                                    }}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="View rejection reason"
                                >
                                  <Eye size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
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

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{booking.tenantName}</p>
                              <p className="text-sm text-gray-600">{booking.tenantEmail}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{booking.propertyTitle}</td>
                          <td className="py-3 px-4 font-semibold">${booking.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Property ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{transaction.transactionId || transaction._id}</td>
                          <td className="py-3 px-4">{transaction.propertyId|| 'N/A'}</td>
                          <td className="py-3 px-4">{transaction.tenantEmail || 'N/A'}</td>
                          <td className="py-3 px-4">{transaction.ownerEmail || 'N/A'}</td>
                          <td className="py-3 px-4 font-semibold">${transaction.amount}</td>
                          <td className="py-3 px-4">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedProperty.status === 'rejected' ? 'Rejection Reason' : 'Reject Property'}
                </h3>
                <button
                  onClick={() => {
                    setShowRejectionModal(false)
                    setSelectedProperty(null)
                    setRejectionReason('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {selectedProperty.status === 'rejected' ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    <strong>Rejection Reason:</strong>
                  </p>
                  <p className="bg-gray-50 p-4 rounded-lg">{selectedProperty.rejectionReason || 'No reason provided'}</p>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handlePropertyAction(selectedProperty._id, 'rejected', rejectionReason)
                }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please provide a reason for rejection
                    </label>
                    <textarea
                      required
                      className="input-field"
                      rows={4}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why this property is being rejected..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Submit Rejection
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
