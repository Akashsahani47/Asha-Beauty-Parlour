'use client'
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Package,
  IndianRupee,
  Clock,
  Users,
  Star,
  Filter,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter } from 'next/navigation'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { token } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [token])

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getallService`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to fetch services')
      
      const data = await response.json()
      if (data.success) {
        setServices(data.services || data.data || [])
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = () => {
    router.push('/admin/services/create')
  }

  const handleEditService = (serviceId) => {
    router.push(`/admin/services/${serviceId}`)
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to delete service')
      
      setServices(prev => prev.filter(service => service._id !== serviceId))
    } catch (error) {
      setError(error.message)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(services.map(service => service.category))]

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
         
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 animate-pulse">
                <div className="h-6 lg:h-8 bg-[#413329]/10 rounded-lg mb-2"></div>
                <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Controls Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8 animate-pulse">
            <div className="h-12 lg:h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-2xl"></div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-lg border border-white/40 p-4 lg:p-6 animate-pulse">
                <div className="h-40 lg:h-48 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-xl lg:rounded-2xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-5 lg:h-6 bg-[#413329]/10 rounded-lg w-3/4"></div>
                  <div className="h-4 lg:h-5 bg-[#413329]/5 rounded-lg w-full"></div>
                  <div className="h-4 lg:h-5 bg-[#413329]/5 rounded-lg w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
         
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Services
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-lg px-2">
            Manage your beauty services and treatments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-rose-500/20 text-rose-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center space-y-3 lg:space-y-0 lg:space-x-3">
              <div className="flex items-center space-x-2 justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <span className="text-base lg:text-lg font-semibold text-center">{error}</span>
              </div>
              <button 
                onClick={fetchServices} 
                className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors text-sm lg:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{services.length}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Total Services</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {services.filter(s => s.isActive).length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Active</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{categories.length}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Categories</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <button
              onClick={handleCreateService}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-3 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              <span className="text-xs lg:text-sm">Add Service</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-sm lg:text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 lg:gap-3 flex-wrap w-full lg:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 lg:px-4 py-2 lg:py-3 bg-white/50 border border-white/60 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 transition-all duration-300 backdrop-blur-sm text-sm lg:text-base flex-1 lg:flex-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={fetchServices}
                className="px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center text-sm lg:text-base"
              >
                <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-6 lg:p-16 text-center">
            <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-8 shadow-2xl">
              <Package className="w-8 h-8 lg:w-16 lg:h-16 text-[#413329]" />
            </div>
            <h3 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-3 lg:mb-4">
              No Services Found
            </h3>
            <p className="text-[#413329]/70 text-base lg:text-xl mb-6 lg:mb-12 max-w-md mx-auto leading-relaxed">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No services match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first service!'
              }
            </p>
            <button 
              onClick={handleCreateService}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm lg:text-base"
            >
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 inline mr-2" />
              Create First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredServices.map((service) => (
              <div key={service._id} className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500 group hover:scale-105">
                {/* Service Image */}
                <div className="h-40 lg:h-48 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] relative overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={service.images[0]} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 lg:w-16 lg:h-16 text-[#413329]/40" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-xl text-xs lg:text-sm font-semibold backdrop-blur-sm ${
                      service.isActive 
                        ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-500/20 text-rose-700 border border-rose-200'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                <div className="p-4 lg:p-6">
                  {/* Service Info */}
                  <div className="mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-bold text-[#413329] mb-2 line-clamp-1">{service.name}</h3>
                    <p className="text-[#413329]/70 text-sm lg:text-base line-clamp-2 mb-3 lg:mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between text-sm lg:text-base">
                      <div className="flex items-center space-x-1 lg:space-x-2 text-[#413329]/70">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-semibold">{service.price}</span>
                      </div>
                      <div className="flex items-center space-x-1 lg:space-x-2 text-[#413329]/70">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Category and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 lg:px-3 py-1 bg-[#FFE2D6] text-[#413329] rounded-xl text-xs lg:text-sm font-medium">
                        {service.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <button
                        onClick={() => handleEditService(service._id)}
                        className="p-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Services