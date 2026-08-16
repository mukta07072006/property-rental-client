'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, Chip, Spinner } from '@heroui/react'
import {
  CircleDollar, House, Calendar, ArrowRightFromLine,
  Plus, TrashBin, PencilToLine, Check, Xmark
} from '@gravity-ui/icons'
import toast from 'react-hot-toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { authClient } from '@/lib/auth-client'
import { API_BASE_URL } from '@/lib/config'

const OwnerDashboard = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('analytics')
  const [analytics, setAnalytics] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newProperty, setNewProperty] = useState({
    title: '', description: '', address: '', city: '', state: '', zip: '',
    propertyType: 'apartment', price: '', rentType: 'monthly', bedrooms: '',
    bathrooms: '', propertySize: '', availableFrom: '', amenities: '', image: ''
  })

  const { data: session } = authClient.useSession()
  const user = session?.user
  console.log('OwnerDashboard user:', user)

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics()
    else if (activeTab === 'properties') fetchProperties()
    else if (activeTab === 'bookings') fetchBookings()
  }, [activeTab])

  const fetchAnalytics = async () => {
    if (!user?.id) return
    // setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/owner/analytics?ownerId=${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setAnalytics(await res.json())
    } catch { console.error('Analytics error') }
    finally { setLoading(false) }
  }

  const fetchProperties = async () => {
  if (!user?.id) return
  setLoading(true)
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties/owner/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    const data = await res.json()
    setProperties(Array.isArray(data) ? data : (data.properties || []))
  } catch (err) {
    console.error('Properties error:', err)
  } finally {
    setLoading(false)
  }
}
  console.log('properties:', properties)

  const fetchBookings = async () => {
    if (!user?.id) return
    setLoading(true)

  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/owner?ownerId=${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    const data = await res.json()
    setBookings(data)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newProperty,
          location: `${newProperty.city}${newProperty.state ? ', ' + newProperty.state : ''}`,
          price: parseFloat(newProperty.price),
          bedrooms: parseInt(newProperty.bedrooms),
          bathrooms: parseInt(newProperty.bathrooms),
          propertySize: parseInt(newProperty.propertySize),
          amenities: newProperty.amenities.split(',').map(a => a.trim()),
          ownerId: user.id, ownerName: user.name, ownerEmail: user.email
        })
      })
      if (res.ok) {
        toast.success('Property added!')
        setIsModalOpen(false)
        setNewProperty({
          title: '', description: '', address: '', city: '', state: '', zip: '',
          propertyType: 'apartment', price: '', rentType: 'monthly', bedrooms: '',
          bathrooms: '', propertySize: '', availableFrom: '', amenities: '', image: ''
        })
        fetchProperties()
      } else toast.error('Failed to add')
    } catch { toast.error('Error occurred') }
  }

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Delete this property?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) { toast.success('Deleted'); fetchProperties() }
      else toast.error('Failed to delete')
    } catch { toast.error('Error') }
  }

  const handleBookingAction = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) { toast.success(`Booking ${status}`); fetchBookings() }
      else toast.error('Failed')
    } catch { toast.error('Error') }
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', Icon: CircleDollar },
    { id: 'properties', label: 'Properties', Icon: House },
    { id: 'bookings', label: 'Bookings', Icon: Calendar }
  ]

  const stats = [
    { label: 'Earnings', value: `$${analytics?.totalEarnings || 0}`, Icon: CircleDollar },
    { label: 'Properties', value: analytics?.totalProperties || 0, Icon: House },
    { label: 'Bookings', value: analytics?.totalBookings || 0, Icon: Calendar }
  ]

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-colors"

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <Card className="p-6 bg-white rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Owner Dashboard</h1>
            <p className="text-sm text-gray-400">Manage listings and bookings</p>
          </div>
          <Button variant="ghost" className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 text-sm"
            onPress={() => router.push('/')}>
            <ArrowRightFromLine className="size-4 mr-1" />
            Logout
          </Button>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(({ id, label, Icon }) => (
            <Button key={id} onPress={() => setActiveTab(id)}
              className={`rounded-full px-5 py-2 text-sm font-medium flex items-center gap-2 transition-all ${activeTab === id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}>
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {loading ? <div className="flex justify-center py-12"><Spinner /></div> : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stats.map((s, i) => (
                    <Card key={i} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                      </div>
                      <div className="p-2.5 bg-gray-100 rounded-xl text-slate-700">
                        <s.Icon className="size-5" />
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Earnings</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={analytics?.monthlyEarnings || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: 12 }} />
                      <Line type="monotone" dataKey="earnings" stroke="#0f172a" strokeWidth={2} dot={{ r: 3, fill: '#0f172a' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Properties */}
        {activeTab === 'properties' && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-900">My Properties</h3>
              <Button onPress={() => setIsModalOpen(true)}
                className="bg-slate-900 text-white rounded-full px-4 py-2 text-sm flex items-center gap-1 hover:bg-slate-800">
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            {loading ? <div className="flex justify-center py-12"><Spinner /></div>
              : properties.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">No properties yet.</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                          <th className="pb-3 font-medium">Property</th>
                          <th className="pb-3 font-medium">Location</th>
                          <th className="pb-3 font-medium">Price</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map(p => (
                          <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 font-medium text-slate-800">{p.title}</td>
                            <td className="py-3 text-gray-500">{p.location}</td>
                            <td className="py-3 font-medium">${p.price}/mo</td>
                            <td className="py-3">
                              <Chip size="sm" className="rounded-full bg-gray-100 text-gray-700 text-xs">{p.status || 'Active'}</Chip>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button isIconOnly size="sm" variant="ghost" className="rounded-full text-gray-400 hover:text-slate-700">
                                  <PencilToLine className="size-4" />
                                </Button>
                                <Button isIconOnly size="sm" variant="ghost" className="rounded-full text-red-500 hover:bg-red-50"
                                  onPress={() => handleDeleteProperty(p._id)}>
                                  <TrashBin className="size-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
          </Card>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <Card className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Booking Requests</h3>

            {loading ? <div className="flex justify-center py-12"><Spinner /></div>
              : bookings.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">No bookings yet.</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase">
                          <th className="pb-3 font-medium">Tenant</th>
                          <th className="pb-3 font-medium">Property</th>
                          <th className="pb-3 font-medium">Amount</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Payment Status</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                       {
                        bookings.length > 0 ?  bookings.map(b => (
                          <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3">
                              <p className="font-medium text-slate-800">{b.tenantName}</p>
                              <p className="text-xs text-gray-400">{b.tenantEmail}</p>
                            </td>
                            <td className="py-3 text-gray-600">{b.propertyTitle}</td>
                            <td className="py-3 font-medium">${b.amount}</td>
                            <td className="py-3">
                              <Chip size="sm" className={`rounded-full text-xs capitalize ${b.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                {b.status}
                              </Chip>
                            </td>
                            <td className="py-3">
                              <Chip size="sm" className={`rounded-full text-xs capitalize ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                {b.paymentStatus}
                              </Chip>
                            </td>
                            <td className="py-3 text-right">
                              {b.status === 'pending' && (
                                <div className="flex justify-end gap-1">
                                  <Button isIconOnly size="sm" className="rounded-full bg-slate-900 text-white"
                                    onPress={() => handleBookingAction(b._id, 'approved')}>
                                    <Check className="size-4" />
                                  </Button>
                                  <Button isIconOnly size="sm" className="rounded-full bg-gray-100 text-gray-700"
                                    onPress={() => handleBookingAction(b._id, 'rejected')}>
                                    <Xmark className="size-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )) : <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No bookings yet.</td></tr>
                       }
                      </tbody>
                    </table>
                  </div>
                )}
          </Card>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <form onSubmit={handleAddProperty}>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="font-bold text-slate-900">Add Property</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <Xmark className="size-5" />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <input required placeholder="Title" className={inputClass}
                    value={newProperty.title} onChange={e => setNewProperty({ ...newProperty, title: e.target.value })} />

                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Address" className={inputClass}
                      value={newProperty.address} onChange={e => setNewProperty({ ...newProperty, address: e.target.value })} />
                    <input required placeholder="City" className={inputClass}
                      value={newProperty.city} onChange={e => setNewProperty({ ...newProperty, city: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <input required placeholder="State" className={inputClass}
                      value={newProperty.state} onChange={e => setNewProperty({ ...newProperty, state: e.target.value })} />
                    <input required placeholder="ZIP" className={inputClass}
                      value={newProperty.zip} onChange={e => setNewProperty({ ...newProperty, zip: e.target.value })} />
                    <input required type="date" className={inputClass}
                      value={newProperty.availableFrom} onChange={e => setNewProperty({ ...newProperty, availableFrom: e.target.value })} />
                  </div>

                  <textarea required placeholder="Description" rows={3} className={inputClass + ' resize-none'}
                    value={newProperty.description} onChange={e => setNewProperty({ ...newProperty, description: e.target.value })} />

                  <div className="grid grid-cols-2 gap-3">
                    <select className={inputClass}
                      value={newProperty.propertyType} onChange={e => setNewProperty({ ...newProperty, propertyType: e.target.value })}>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="villa">Villa</option>
                    </select>
                    <select className={inputClass}
                      value={newProperty.rentType} onChange={e => setNewProperty({ ...newProperty, rentType: e.target.value })}>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <input required type="number" placeholder="Price" className={inputClass}
                      value={newProperty.price} onChange={e => setNewProperty({ ...newProperty, price: e.target.value })} />
                    <input required type="number" placeholder="Beds" className={inputClass}
                      value={newProperty.bedrooms} onChange={e => setNewProperty({ ...newProperty, bedrooms: e.target.value })} />
                    <input required type="number" placeholder="Baths" className={inputClass}
                      value={newProperty.bathrooms} onChange={e => setNewProperty({ ...newProperty, bathrooms: e.target.value })} />
                    <input required type="number" placeholder="Sq Ft" className={inputClass}
                      value={newProperty.propertySize} onChange={e => setNewProperty({ ...newProperty, propertySize: e.target.value })} />
                  </div>

                  <input placeholder="Amenities (comma separated)" className={inputClass}
                    value={newProperty.amenities} onChange={e => setNewProperty({ ...newProperty, amenities: e.target.value })} />

                  <input type="url" placeholder="Image URL" className={inputClass}
                    value={newProperty.image} onChange={e => setNewProperty({ ...newProperty, image: e.target.value })} />
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                  <Button type="button" variant="ghost" className="text-gray-600" onPress={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-slate-900 text-white rounded-full px-5 hover:bg-slate-800">Create</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard