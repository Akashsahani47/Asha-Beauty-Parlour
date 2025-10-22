'use client'
import React, { useEffect, useState } from 'react'
import useUserStore from '@/store/useStore'
import { 
  Calendar, 
  Clock, 
  Phone, 
  IndianRupee, 
  CheckCircle, 
  ClockIcon, 
  AlertCircle,
  Sparkles,
  Search,
  Filter
} from 'lucide-react'

const Order = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { token } = useUserStore()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        
        if (!token) {
          setError('Please login to view your bookings')
          setLoading(false)
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/userBookings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error('Failed to fetch bookings')
        }

        const data = await res.json()
        console.log('Bookings data:', data)
        setBookings(data.bookings || data.data || [])
        setError('') 
      } catch (err) {
        setError(err.message || 'Something went wrong')
        console.error('Error fetching bookings:', err)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchBookings()
    } else {
      setLoading(false)
      setError('Please login to view your bookings')
    }
  }, [token])

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service?.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Function to format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Function to get status badge color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-emerald-500/20 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          label: 'Confirmed',
          gradient: 'from-emerald-400 to-green-500'
        }
      case 'completed':
        return {
          color: 'bg-blue-500/20 text-blue-700 border-blue-200',
          icon: CheckCircle,
          label: 'Completed',
          gradient: 'from-blue-400 to-cyan-500'
        }
      case 'cancelled':
        return {
          color: 'bg-rose-500/20 text-rose-700 border-rose-200',
          icon: ClockIcon,
          label: 'Cancelled',
          gradient: 'from-rose-400 to-red-500'
        }
      default:
        return {
          color: 'bg-amber-500/20 text-amber-700 border-amber-200',
          icon: ClockIcon,
          label: 'Pending',
          gradient: 'from-amber-400 to-orange-500'
        }
    }
  }

  // Function to get payment status color
  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'bg-emerald-500/20 text-emerald-700 border-emerald-200',
          label: 'Paid',
          icon: CheckCircle
        }
      case 'failed':
        return {
          color: 'bg-rose-500/20 text-rose-700 border-rose-200',
          label: 'Failed',
          icon: ClockIcon
        }
      case 'refunded':
        return {
          color: 'bg-purple-500/20 text-purple-700 border-purple-200',
          label: 'Refunded',
          icon: CheckCircle
        }
      default:
        return {
          color: 'bg-amber-500/20 text-amber-700 border-amber-200',
          label: 'Pending',
          icon: ClockIcon
        }
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4">
          {/* Animated Header */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-[#413329]/10 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>

          {/* Enhanced Card Skeletons */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-xl w-3/4"></div>
                    <div className="h-4 bg-[#413329]/10 rounded-lg w-full"></div>
                    <div className="h-4 bg-[#413329]/10 rounded-lg w-2/3"></div>
                  </div>
                  <div className="h-8 bg-[#413329]/10 rounded-full w-20"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center">
                      <div className="h-4 bg-[#413329]/10 rounded-lg w-4 mr-3"></div>
                      <div className="h-3 bg-[#413329]/5 rounded-lg w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Enhanced Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 text-center transform hover:scale-105 transition-transform duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-[#413329]/70 mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-[#413329]/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Manage and track your service bookings with real-time updates
          </p>
        </div>

        {/* Enhanced Controls */}
        {bookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#413329]/40" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 transition-all duration-300 backdrop-blur-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          // Enhanced Empty state
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-16 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Calendar className="w-16 h-16 text-[#413329]" />
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-4">
              No Bookings Found
            </h3>
            <p className="text-[#413329]/70 text-xl mb-12 max-w-md mx-auto leading-relaxed">
              {searchTerm || statusFilter !== 'all' 
                ? 'No bookings match your current filters. Try adjusting your search criteria.'
                : 'Start your journey with us! Book your first service and experience premium care.'
              }
            </p>
            <button className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              <Sparkles className="w-5 h-5 inline mr-2" />
              Explore Services
            </button>
          </div>
        ) : (
          // Enhanced Bookings list
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {filteredBookings.map((booking, index) => {
              const statusConfig = getStatusConfig(booking.status)
              const paymentConfig = getPaymentStatusConfig(booking.paymentStatus)
              const StatusIcon = statusConfig.icon
              const PaymentIcon = paymentConfig.icon

              return (
                <div 
                  key={booking._id}
                  className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500 group hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header with Gradient */}
                  <div className={`bg-gradient-to-r ${statusConfig.gradient} p-6 text-white`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {booking.service?.name || 'Premium Service'}
                        </h3>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {booking.service?.description || 'Experience our premium service package'}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <StatusIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Enhanced Booking Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center text-[#413329]/80">
                          <Calendar className="w-5 h-5 mr-3 text-[#413329]/60" />
                          <div>
                            <div className="font-semibold">{formatDate(booking.date)}</div>
                            <div className="text-sm text-[#413329]/60">Booking Date</div>
                          </div>
                        </div>
                        <div className="flex items-center text-[#413329]/80">
                          <Clock className="w-5 h-5 mr-3 text-[#413329]/60" />
                          <div>
                            <div className="font-semibold">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                            <div className="text-sm text-[#413329]/60">Time Slot</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center text-[#413329]/80">
                          <Phone className="w-5 h-5 mr-3 text-[#413329]/60" />
                          <div>
                            <div className="font-semibold">{booking.userPhone || 'N/A'}</div>
                            <div className="text-sm text-[#413329]/60">Contact</div>
                          </div>
                        </div>
                        <div className="flex items-center text-[#413329]/80">
                          <IndianRupee className="w-5 h-5 mr-3 text-[#413329]/60" />
                          <div>
                            <div className="font-semibold text-lg">{booking.totalAmount || 0}</div>
                            <div className="text-sm text-[#413329]/60">Total Amount</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Status Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold border backdrop-blur-sm ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {statusConfig.label}
                      </div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold border backdrop-blur-sm ${paymentConfig.color}`}>
                        <PaymentIcon className="w-4 h-4 mr-2" />
                        {paymentConfig.label}
                      </div>
                      <div className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-[#FFE2D6] text-[#413329] border border-[#413329]/20 backdrop-blur-sm">
                        {booking.paymentMethod === 'pay_after_service' ? 'Pay After Service' : 
                         booking.paymentMethod === 'razorpay' ? 'Online Payment' : 
                         booking.paymentMethod === 'free' ? 'Free' : 'Unknown'}
                      </div>
                    </div>

                    {/* Service Provider */}
                    {booking.service?.provider && (
                      <div className="border-t border-[#413329]/10 pt-4">
                        <div className="flex items-center text-[#413329]/70">
                          <span className="font-semibold text-[#413329]">Service Provider:</span>
                          <span className="ml-2">{booking.service.provider.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Order