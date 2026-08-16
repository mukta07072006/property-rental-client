'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Home as HomeIcon, DollarSign, Filter, ArrowUpDown } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { getUserData } from '@/context/contextApi'
interface Property {
  _id: string
  title: string
  location: string
  price: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  image?: string
}

interface Filters {
  search: string
  propertyType: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

interface Pagination {
  page: number
  totalPages: number
  total: number
}

const AllProperties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    sortBy: ''
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    fetchProperties()
  }, [filters, pagination.page])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const entries = Object.entries(filters) as Array<[keyof Filters, string]>
      entries.forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append('page', pagination.page.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.SERVER_URL || 'http://localhost:5000'}/api/properties?${params.toString()}`)
      const data = await response.json()
      // normalize property id field: backend may return `id` instead of `_id`
      const raw = data.properties || []
      const normalized = raw.map((p: any) => ({ ...p, _id: p._id || p.id }))
      setProperties(normalized)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 1,
        total: data.total || 0
      }))
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

    const { data: session, isPending } = authClient.useSession()
    const user = session?.user


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Properties</h1>
          <p className="text-gray-600">Find your perfect rental from our extensive collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-primary-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by location..."
              className="input-field"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <select
              className="input-field"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="villa">Villa</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              className="input-field"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="input-field"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            <select
              className="input-field"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{properties.length}</span> of <span className="font-semibold">{pagination.total}</span> properties
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <HomeIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'} 
                    alt={property.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                    ${property.price}/mo
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin size={16} className="mr-1" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <HomeIcon size={16} />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      {property.bathrooms} Baths
                    </span>
                    <span className="capitalize">{property.propertyType}</span>
                  </div>
                  {user ? (
                    <Link href={`/property/${property._id}`} className="btn-primary block text-center">
                      View Details
                    </Link>
                  ) : (
                    <Link href="/login" className="btn-primary block text-center">
                      View Details
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllProperties
