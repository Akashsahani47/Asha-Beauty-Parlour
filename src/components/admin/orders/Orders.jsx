'use client'
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock4,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react'
import useUserStore from '@/store/useStore'

const Orders = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const { token } = useUserStore()

  // Fetch bookings when component mounts AND when token becomes available
  useEffect(() => {
    if (token) {
      fetchBookings()
    } else {
      setLoading(false)
      setError('Please login to access bookings')
    }
  }, [token])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')

      if (!token) {
        setError('Authentication token not found. Please login again.')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (response.status === 401) {
        throw new Error('Unauthorized: Please check your admin permissions')
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setBookings(data.bookings || [])
      } else {
        throw new Error(data.message || 'Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings based on search term and filters
  const filteredBookings = bookings.filter(booking => {
    const userName = booking.user?.name || 'Unknown User'
    const userEmail = booking.user?.email || ''
    const serviceName = booking.service?.name || 'Unknown Service'
    const userPhone = booking.userPhone || ''
    
    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userPhone.includes(searchTerm) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-700 border-blue-300'
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-300'
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-700 border-rose-300'
      default:
        return 'bg-amber-500/20 text-amber-700 border-amber-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock4 className="w-4 h-4" />
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-700'
      case 'failed':
        return 'bg-rose-500/20 text-rose-700'
      case 'refunded':
        return 'bg-purple-500/20 text-purple-700'
      default:
        return 'bg-amber-500/20 text-amber-700'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0  transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-80 mx-auto mb-6"></div>
              <div className="h-6 bg-[#413329]/10 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 mb-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-2xl"></div>
              ))}
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-[#413329]/10">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-[#413329]/10 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-[#413329]/10 rounded-lg w-32"></div>
                      <div className="h-3 bg-[#413329]/5 rounded-lg w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#413329]/10 rounded-lg w-20"></div>
                    <div className="h-3 bg-[#413329]/5 rounded-lg w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
      

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-rose-500/20 text-rose-700 rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg font-semibold">{error}</span>
              <button 
                onClick={fetchBookings}
                className="ml-4 bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 text-center">
            <div className="text-2xl font-bold text-[#413329]">{bookings.length}</div>
            <div className="text-[#413329]/60 text-sm">Total Bookings</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 text-center">
            <div className="text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-[#413329]/60 text-sm">Pending</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 text-center">
            <div className="text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-[#413329]/60 text-sm">Confirmed</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 text-center">
            <div className="text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.paymentStatus === 'paid').length}
            </div>
            <div className="text-[#413329]/60 text-sm">Paid</div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] appearance-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-5 h-5" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] appearance-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchBookings}
              disabled={!token}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Bookings ({filteredBookings.length})</h2>
              <button 
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                disabled={!token}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#413329]/10">
                  <th className="text-left p-4 font-semibold text-[#413329]">Customer & Service</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Timing</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Amount & Payment</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Status</th>
                  <th className="text-left p-4 font-semibold text-[#413329]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#413329]/60">
                      {bookings.length === 0 ? 'No bookings found' : 'No bookings matching your criteria'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-[#413329]/5 hover:bg-white/50 transition-colors">
                      {/* Customer & Service Info */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl flex items-center justify-center">
                            <User className="w-5 h-5 text-[#413329]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#413329]">
                              {booking.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-[#413329]/60">
                              {booking.service?.name || 'Unknown Service'}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-[#413329]/50 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{booking.userPhone || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Timing Info */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-[#413329]/60" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-[#413329]/60">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Amount & Payment */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-[#413329]">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                          <div className="text-sm text-[#413329]/60 capitalize">
                            {booking.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus || 'pending'}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-2xl border ${getStatusBadge(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="font-semibold capitalize">{booking.status}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-[#413329]/10 rounded-xl transition-colors" title="View Details">
                            <Eye className="w-4 h-4 text-[#413329]/60" />
                          </button>
                          <button className="p-2 hover:bg-[#413329]/10 rounded-xl transition-colors" title="Edit Booking">
                            <Edit className="w-4 h-4 text-[#413329]/60" />
                          </button>
                          <button className="p-2 hover:bg-rose-500/10 rounded-xl transition-colors" title="Cancel Booking">
                            <Trash2 className="w-4 h-4 text-rose-500/60" />
                          </button>
                        </div>
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

export default Orders