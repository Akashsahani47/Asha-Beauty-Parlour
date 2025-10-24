'use client'
import React, { useState, useEffect, useRef } from 'react'
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
  RefreshCw,
  Bell,
  IndianRupee
} from 'lucide-react'
import useUserStore from '@/store/useStore'

const Orders = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const { token } = useUserStore()
  
  // Use useRef to persist known order IDs across renders
  const knownOrderIds = useRef(new Set())

  // Fetch bookings when component mounts AND when token becomes available
  useEffect(() => {
    if (token) {
      fetchBookings()
    } else {
      setLoading(false)
      setError('Please login to access bookings')
    }
  }, [token])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token || !autoRefresh) return;

    const interval = setInterval(() => {
      fetchBookings(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [token, autoRefresh]);

  const fetchBookings = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }
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
        const newBookings = data.bookings || [];
        
        // If auto-refresh, detect TRULY new orders
        if (isAutoRefresh) {
          detectNewOrders(newBookings);
        } else {
          // For manual refresh, reset known orders
          const orderIds = newBookings.map(booking => booking._id);
          knownOrderIds.current = new Set(orderIds);
          setNewOrdersCount(0); // Clear any existing notifications
        }
        
        setBookings(newBookings)
        setError('')
      } else {
        throw new Error(data.message || 'Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      if (!isAutoRefresh) {
        setError(error.message)
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false)
      }
    }
  }

  // Smart function to detect only truly new orders
  const detectNewOrders = (newBookings) => {
    if (!newBookings.length) return;

    const newOrderIds = new Set(newBookings.map(booking => booking._id));
    const currentKnownIds = knownOrderIds.current;

    // Find orders that exist in new data but not in known data
    const trulyNewOrders = newBookings.filter(booking => !currentKnownIds.has(booking._id));
    
    if (trulyNewOrders.length > 0) {
      setNewOrdersCount(trulyNewOrders.length);
      
      // Update known orders with the new ones
      trulyNewOrders.forEach(order => {
        knownOrderIds.current.add(order._id);
      });
    }
  }

  // Clear new orders notification
  const clearNewOrdersNotification = () => {
    setNewOrdersCount(0);
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
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 transition-all duration-500 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-6 lg:mb-12">
            <div className="animate-pulse">
              <div className="h-10 lg:h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-48 lg:w-80 mx-auto mb-4 lg:mb-6"></div>
              <div className="h-4 lg:h-6 bg-[#413329]/10 rounded-lg w-64 lg:w-96 mx-auto"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4 mb-6 lg:mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 animate-pulse">
                <div className="h-6 lg:h-8 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-lg mb-2"></div>
                <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8 animate-pulse">
            <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 lg:h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-xl lg:rounded-2xl"></div>
              ))}
            </div>
          </div>

          {/* Cards Skeleton */}
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 transition-all duration-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
<div className="text-center mb-12">
         
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-4">
            Bookings Management
          </h1>
          <p className="text-[#413329]/70 text-lg">
            Manage and monitor all customer bookings in one place
          </p>
        </div>
        {/* New Orders Notification */}
        {newOrdersCount > 0 && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-emerald-300/50 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
              <div className="flex items-center space-x-2 lg:space-x-3 justify-center lg:justify-start">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 animate-bounce text-emerald-600" />
                <span className="font-semibold text-emerald-800 text-sm lg:text-base text-center lg:text-left">
                  🎉 {newOrdersCount} new order(s) just came in!
                </span>
              </div>
              <button 
                onClick={clearNewOrdersNotification}
                className="text-emerald-700 hover:text-emerald-800 font-semibold px-3 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-300 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-rose-500/20 text-rose-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center space-y-3 lg:space-y-0 lg:space-x-3">
              <div className="flex items-center space-x-2 justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <span className="text-base lg:text-lg font-semibold text-center">{error}</span>
              </div>
              <button 
                onClick={() => fetchBookings()}
                className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors text-sm lg:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{bookings.length}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Total Bookings</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Pending</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Confirmed</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {bookings.filter(b => b.paymentStatus === 'paid').length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Paid</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-1 lg:mb-2">
              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <div className="text-xl lg:text-2xl font-bold text-[#413329]">
                {autoRefresh ? 'ON' : 'OFF'}
              </div>
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Auto-Refresh</div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="grid grid-cols-1 gap-3 lg:gap-4 lg:grid-cols-5">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-sm lg:text-base transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] appearance-none transition-all duration-300 backdrop-blur-sm text-sm lg:text-base"
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
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] appearance-none transition-all duration-300 backdrop-blur-sm text-sm lg:text-base"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 border-2 flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-base ${
                autoRefresh 
                  ? 'bg-emerald-500/20 text-emerald-700 border-emerald-300 hover:bg-emerald-500/30' 
                  : 'bg-gray-500/20 text-gray-700 border-gray-300 hover:bg-gray-500/30'
              }`}
            >
              <RefreshCw className={`w-4 h-4 lg:w-5 lg:h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchBookings()}
              disabled={!token}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              Refresh Now
            </button>
          </div>
        </div>

        {/* Mobile Bookings Cards */}
        <div className="lg:hidden">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-4 py-3 text-white">
              <h2 className="text-lg font-bold">All Bookings ({filteredBookings.length})</h2>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 p-8 text-center">
              <User className="w-12 h-12 text-[#413329]/40 mx-auto mb-4" />
              <p className="text-[#413329]/60 text-lg">
                {bookings.length === 0 ? 'No bookings found' : 'No bookings matching your criteria'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[#413329]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#413329] text-base truncate">
                          {booking.user?.name || 'Unknown User'}
                        </h3>
                        <p className="text-[#413329]/70 text-sm truncate">
                          {booking.service?.name || 'Unknown Service'}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className="w-3 h-3 text-[#413329]/60 flex-shrink-0" />
                          <span className="text-[#413329]/70 text-xs">{booking.userPhone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-xl border text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-[#413329]/70">
                      <Calendar className="w-3 h-3 mr-2 text-[#413329]/60 flex-shrink-0" />
                      <span className="text-xs">{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center text-[#413329]/70">
                      <Clock className="w-3 h-3 mr-2 text-[#413329]/60 flex-shrink-0" />
                      <span className="text-xs">{formatTime(booking.startTime)}</span>
                    </div>
                  </div>

                  {/* Payment & Amount */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4 text-[#413329] mr-1" />
                      <span className="font-semibold text-[#413329] text-sm">
                        {booking.totalAmount || 0}
                      </span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getPaymentBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus || 'pending'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#413329]/10">
                    <div className="text-[#413329]/40 text-xs">
                      {booking.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-[#413329]/10 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-[#413329]/60" />
                      </button>
                      <button className="p-1 hover:bg-[#413329]/10 rounded-lg transition-colors" title="Edit Booking">
                        <Edit className="w-4 h-4 text-[#413329]/60" />
                      </button>
                      <button className="p-1 hover:bg-rose-500/10 rounded-lg transition-colors" title="Cancel Booking">
                        <Trash2 className="w-4 h-4 text-rose-500/60" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Bookings Table */}
        <div className="hidden lg:block bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Bookings ({filteredBookings.length})</h2>
              <button 
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                disabled={!token || filteredBookings.length === 0}
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