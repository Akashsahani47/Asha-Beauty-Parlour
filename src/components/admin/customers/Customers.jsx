'use client'
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  AlertCircle,
  RefreshCw,
  MoreVertical
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter } from 'next/navigation'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { token } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      fetchCustomers()
    }
  }, [token])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to fetch customers')
      
      const data = await response.json()
      if (data.success) {
        setCustomers(data.customers || [])
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewCustomer = (customerId) => {
    router.push(`/admin/customer/${customerId}`)
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          {/* Mobile Header Skeleton */}
          <div className="text-center mb-6 lg:mb-12">
            <div className="animate-pulse">
              <div className="h-12 lg:h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-64 lg:w-80 mx-auto mb-4 lg:mb-6"></div>
              <div className="h-4 lg:h-6 bg-[#413329]/10 rounded-lg w-72 lg:w-96 mx-auto"></div>
            </div>
          </div>

          {/* Mobile Stats Skeleton */}
          <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 animate-pulse">
                <div className="h-6 lg:h-8 bg-[#413329]/10 rounded-lg mb-2"></div>
                <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Mobile Search Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8 animate-pulse">
            <div className="h-12 lg:h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-2xl"></div>
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="space-y-3 lg:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-lg border border-white/40 p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#413329]/10 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 lg:h-5 bg-[#413329]/10 rounded-lg w-3/4"></div>
                    <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#413329] to-[#5D4A3A] rounded-2xl lg:rounded-3xl shadow-2xl mb-4 lg:mb-6">
            <Users className="w-8 h-8 lg:w-10 lg:h-10 text-[#FFE2D6]" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Customers
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-lg px-2">
            Manage and view all customer information
          </p>
        </div>

        {/* Error Message - Mobile Optimized */}
        {error && (
          <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-rose-500/20 text-rose-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center space-y-3 lg:space-y-0 lg:space-x-3">
              <div className="flex items-center space-x-2 justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <span className="text-base lg:text-lg font-semibold text-center">{error}</span>
              </div>
              <button 
                onClick={fetchCustomers} 
                className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors text-sm lg:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{customers.length}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Total</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {customers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">New This Month</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <button
              onClick={fetchCustomers}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-3 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full"
            >
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              <span className="text-xs lg:text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search - Mobile Optimized */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Customers List - Mobile Cards */}
        <div className="lg:hidden">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-4 py-3 text-white">
              <h2 className="text-lg font-bold">All Customers ({filteredCustomers.length})</h2>
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 p-8 text-center">
              <Users className="w-12 h-12 text-[#413329]/40 mx-auto mb-4" />
              <p className="text-[#413329]/60 text-lg">
                {customers.length === 0 ? 'No customers found' : 'No customers matching your search'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div key={customer._id} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-[#413329]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#413329] text-base truncate">{customer.name}</h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Mail className="w-3 h-3 text-[#413329]/60 flex-shrink-0" />
                          <span className="text-[#413329]/70 text-sm truncate">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Phone className="w-3 h-3 text-[#413329]/60 flex-shrink-0" />
                            <span className="text-[#413329]/70 text-sm">{customer.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 mt-2">
                          <Calendar className="w-3 h-3 text-[#413329]/60 flex-shrink-0" />
                          <span className="text-[#413329]/60 text-xs">Joined {formatDate(customer.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-2">
                      <button
                        onClick={() => handleViewCustomer(customer._id)}
                        className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Customer ID - Hidden on mobile but available if needed */}
                  <div className="mt-2 pt-2 border-t border-[#413329]/10">
                    <p className="text-[#413329]/40 text-xs truncate">ID: {customer._id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customers Table - Desktop Only */}
        <div className="hidden lg:block bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-6 py-4 text-white">
            <h2 className="text-xl font-bold">All Customers ({filteredCustomers.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#413329]/10">
                  <th className="text-left p-4 font-semibold text-[#413329]">Customer</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Contact</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Member Since</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[#413329]/60">
                      {customers.length === 0 ? 'No customers found' : 'No customers matching your search'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-b border-[#413329]/5 hover:bg-white/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#413329]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#413329]">{customer.name}</div>
                            <div className="text-sm text-[#413329]/60">ID: {customer._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-[#413329]/60" />
                            <span>{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center space-x-2 text-sm text-[#413329]/60">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 text-sm text-[#413329]/60">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(customer.createdAt)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewCustomer(customer._id)}
                          className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-4 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customers