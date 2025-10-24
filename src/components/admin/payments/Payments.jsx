'use client'
import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  IndianRupee,
  User,
  Package,
  Calendar,
  Phone,
  AlertCircle,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter } from 'next/navigation'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    paidBookings: 0,
    pendingBookings: 0,
    razorpayEarnings: 0,
    offlineEarnings: 0
  })
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })

  const { token } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [token, pagination.currentPage, paymentMethodFilter, paymentStatusFilter])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (paymentMethodFilter !== 'all') params.append('paymentMethod', paymentMethodFilter)
      if (paymentStatusFilter !== 'all') params.append('paymentStatus', paymentStatusFilter)
      params.append('page', pagination.currentPage)
      params.append('limit', pagination.limit)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/payments?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch payments')
      
      const data = await response.json()
      if (data.success) {
        setPayments(data.payments || [])
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages || 1,
          total: data.total || 0
        }))
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/payments/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleMarkAsPaid = async (paymentId) => {
    if (!confirm('Are you sure you want to mark this payment as paid?')) return
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/payments/${paymentId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentStatus: 'paid' })
        }
      )

      if (!response.ok) throw new Error('Failed to update payment status')
      
      const data = await response.json()
      if (data.success) {
        // Update local state
        setPayments(prev => prev.map(payment => 
          payment._id === paymentId 
            ? { ...payment, paymentStatus: 'paid' }
            : payment
        ))
        // Refresh stats
        fetchStats()
      }
    } catch (error) {
      setError(error.message)
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }))
    }
  }

  const handleFirstPage = () => handlePageChange(1)
  const handleLastPage = () => handlePageChange(pagination.totalPages)
  const handlePrevPage = () => handlePageChange(pagination.currentPage - 1)
  const handleNextPage = () => handlePageChange(pagination.currentPage + 1)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userPhone?.includes(searchTerm)
    
    return matchesSearch
  })

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'bg-emerald-500/20 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          label: 'Paid'
        }
      case 'failed':
        return {
          color: 'bg-rose-500/20 text-rose-700 border-rose-200',
          icon: XCircle,
          label: 'Failed'
        }
      case 'refunded':
        return {
          color: 'bg-purple-500/20 text-purple-700 border-purple-200',
          icon: CheckCircle,
          label: 'Refunded'
        }
      default:
        return {
          color: 'bg-amber-500/20 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Pending'
        }
    }
  }

  const getPaymentMethodConfig = (method) => {
    switch (method) {
      case 'razorpay':
        return {
          color: 'bg-blue-500/20 text-blue-700 border-blue-200',
          label: 'Razorpay'
        }
      case 'pay_after_service':
        return {
          color: 'bg-orange-500/20 text-orange-700 border-orange-200',
          label: 'Offline'
        }
      case 'free':
        return {
          color: 'bg-green-500/20 text-green-700 border-green-200',
          label: 'Free'
        }
      default:
        return {
          color: 'bg-gray-500/20 text-gray-700 border-gray-200',
          label: 'Unknown'
        }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-6 lg:mb-12">
            <div className="animate-pulse">
              <div className="h-12 lg:h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-64 lg:w-80 mx-auto mb-4 lg:mb-6"></div>
              <div className="h-4 lg:h-6 bg-[#413329]/10 rounded-lg w-72 lg:w-96 mx-auto"></div>
            </div>
          </div>

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

          {/* Payments Skeleton */}
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
         
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Payments
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-lg px-2">
            Manage and track all payment transactions
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
                onClick={fetchPayments} 
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
            <div className="text-xl lg:text-2xl font-bold text-[#413329] flex items-center justify-center">
              <IndianRupee className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
              {stats.totalEarnings}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Total Earnings</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{pagination.total}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Total Bookings</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{stats.paidBookings}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Paid</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">{stats.pendingBookings}</div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">Pending</div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg lg:text-xl font-bold text-[#413329] flex items-center">
                  <IndianRupee className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
                  {stats.razorpayEarnings}
                </div>
                <div className="text-[#413329]/60 text-sm lg:text-base">Razorpay Earnings</div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg lg:text-xl font-bold text-[#413329] flex items-center">
                  <IndianRupee className="w-4 h-4 lg:w-5 lg:h-5 mr-1" />
                  {stats.offlineEarnings}
                </div>
                <div className="text-[#413329]/60 text-sm lg:text-base">Offline Earnings</div>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
            </div>
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
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-sm lg:text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 lg:gap-3 flex-wrap w-full lg:w-auto">
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="px-3 lg:px-4 py-2 lg:py-3 bg-white/50 border border-white/60 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 transition-all duration-300 backdrop-blur-sm text-sm lg:text-base flex-1 lg:flex-none"
              >
                <option value="all">All Methods</option>
                <option value="razorpay">Razorpay</option>
                <option value="pay_after_service">Offline</option>
                <option value="free">Free</option>
              </select>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 lg:px-4 py-2 lg:py-3 bg-white/50 border border-white/60 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 transition-all duration-300 backdrop-blur-sm text-sm lg:text-base flex-1 lg:flex-none"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                onClick={fetchPayments}
                className="px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center text-sm lg:text-base"
              >
                <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
          <div className="text-[#413329]/70 text-sm lg:text-base mb-2 lg:mb-0">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} payments
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-1 lg:space-x-2">
              {/* First Page */}
              <button
                onClick={handleFirstPage}
                disabled={pagination.currentPage === 1}
                className="p-2 bg-white/80 backdrop-blur-lg border border-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
              >
                <ChevronsLeft className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              </button>

              {/* Previous Page */}
              <button
                onClick={handlePrevPage}
                disabled={pagination.currentPage === 1}
                className="p-2 bg-white/80 backdrop-blur-lg border border-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 lg:px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    pagination.currentPage === page
                      ? 'bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] shadow-lg'
                      : 'bg-white/80 backdrop-blur-lg border border-white/60 text-[#413329] hover:bg-white/90'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Page */}
              <button
                onClick={handleNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 bg-white/80 backdrop-blur-lg border border-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              </button>

              {/* Last Page */}
              <button
                onClick={handleLastPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 bg-white/80 backdrop-blur-lg border border-white/60 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-300"
              >
                <ChevronsRight className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              </button>
            </div>
          )}
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-6 lg:p-16 text-center">
            <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-8 shadow-2xl">
              <CreditCard className="w-8 h-8 lg:w-16 lg:h-16 text-[#413329]" />
            </div>
            <h3 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-3 lg:mb-4">
              No Payments Found
            </h3>
            <p className="text-[#413329]/70 text-base lg:text-xl mb-6 lg:mb-12 max-w-md mx-auto leading-relaxed">
              {searchTerm || paymentMethodFilter !== 'all' || paymentStatusFilter !== 'all'
                ? 'No payments match your current filters. Try adjusting your search criteria.'
                : 'No payment transactions found yet.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredPayments.map((payment) => {
                const statusConfig = getPaymentStatusConfig(payment.paymentStatus)
                const methodConfig = getPaymentMethodConfig(payment.paymentMethod)
                const StatusIcon = statusConfig.icon

                return (
                  <div key={payment._id} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#413329] text-base truncate">
                          {payment.service?.name}
                        </h3>
                        <p className="text-[#413329]/60 text-sm truncate">
                          {payment.user?.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-semibold border ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-xl text-xs font-semibold border ${methodConfig.color}`}>
                          {methodConfig.label}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#413329]/60">Amount:</span>
                        <span className="font-semibold text-[#413329] flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {payment.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#413329]/60">Date:</span>
                        <span className="font-semibold text-[#413329]">{formatDate(payment.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#413329]/60">Time:</span>
                        <span className="font-semibold text-[#413329]">{formatTime(payment.startTime)}</span>
                      </div>
                    </div>

                    {/* Action Button for Pending Offline Payments */}
                    {payment.paymentMethod === 'pay_after_service' && payment.paymentStatus === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-[#413329]/10">
                        <button
                          onClick={() => handleMarkAsPaid(payment._id)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Paid
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
              <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-6 py-4 text-white">
                <h2 className="text-xl font-bold">All Payments ({pagination.total})</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#413329]/10">
                      <th className="text-left p-4 font-semibold text-[#413329]">Customer & Service</th>
                      <th className="text-left p-4 font-semibold text-[#413329]">Amount</th>
                      <th className="text-left p-4 font-semibold text-[#413329]">Payment Method</th>
                      <th className="text-left p-4 font-semibold text-[#413329]">Status</th>
                      <th className="text-left p-4 font-semibold text-[#413329]">Date & Time</th>
                      <th className="text-left p-4 font-semibold text-[#413329]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => {
                      const statusConfig = getPaymentStatusConfig(payment.paymentStatus)
                      const methodConfig = getPaymentMethodConfig(payment.paymentMethod)
                      const StatusIcon = statusConfig.icon

                      return (
                        <tr key={payment._id} className="border-b border-[#413329]/5 hover:bg-white/50 transition-colors">
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-[#413329]">{payment.service?.name}</div>
                              <div className="text-sm text-[#413329]/60">{payment.user?.name}</div>
                              <div className="text-sm text-[#413329]/60 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {payment.userPhone}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center text-lg font-bold text-[#413329]">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {payment.totalAmount}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`inline-flex items-center px-3 py-1 rounded-2xl text-sm font-semibold border ${methodConfig.color}`}>
                              {methodConfig.label}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`inline-flex items-center px-3 py-1 rounded-2xl text-sm font-semibold border ${statusConfig.color}`}>
                              <StatusIcon className="w-4 h-4 mr-2" />
                              {statusConfig.label}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-[#413329]/60">
                              <div>{formatDate(payment.date)}</div>
                              <div>{formatTime(payment.startTime)}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            {payment.paymentMethod === 'pay_after_service' && payment.paymentStatus === 'pending' && (
                              <button
                                onClick={() => handleMarkAsPaid(payment._id)}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark Paid</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

       
       
      </div>
    </div>
  )
}

export default Payments