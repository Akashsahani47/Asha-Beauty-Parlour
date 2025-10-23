'use client'
import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Edit,
  Eye,
  RefreshCw
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter, useParams } from 'next/navigation'

const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useUserStore()
  const router = useRouter()
  const params = useParams()
  const customerId = params.id

  useEffect(() => {
    if (token && customerId) {
      fetchCustomerDetails()
    }
  }, [token, customerId])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching customer details for:', customerId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch customer details: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Customer data:', data)
      
      if (data.success) {
        setCustomer(data.customer)
        setOrders(data.orders || [])
      } else {
        throw new Error(data.message || 'Failed to fetch customer details')
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500/20 text-blue-700 border-blue-300'
      case 'completed': return 'bg-emerald-500/20 text-emerald-700 border-emerald-300'
      case 'cancelled': return 'bg-rose-500/20 text-rose-700 border-rose-300'
      default: return 'bg-amber-500/20 text-amber-700 border-amber-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-700'
      case 'failed': return 'bg-rose-500/20 text-rose-700'
      case 'refunded': return 'bg-purple-500/20 text-purple-700'
      default: return 'bg-amber-500/20 text-amber-700'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          <div className="animate-pulse">
            <div className="h-6 lg:h-8 bg-[#413329]/10 rounded-lg w-32 lg:w-48 mb-6 lg:mb-8"></div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-8 mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#413329]/10 rounded-2xl lg:rounded-3xl"></div>
                <div className="space-y-2 lg:space-y-3 flex-1">
                  <div className="h-6 lg:h-8 bg-[#413329]/10 rounded-lg w-48 lg:w-64"></div>
                  <div className="h-4 bg-[#413329]/5 rounded-lg w-32 lg:w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 flex items-center justify-center overflow-x-hidden">
        <div className="max-w-md w-full text-center mx-3 lg:mx-4">
          <AlertCircle className="w-12 h-12 lg:w-16 lg:h-16 text-rose-500 mx-auto mb-3 lg:mb-4" />
          <h2 className="text-xl lg:text-2xl font-bold text-[#413329] mb-2">Error Loading Customer</h2>
          <p className="text-[#413329]/70 mb-4 lg:mb-6 text-sm lg:text-base">{error}</p>
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4 justify-center">
            <button 
              onClick={() => router.push('/admin/customer')}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-sm lg:text-base"
            >
              Back to Customers
            </button>
            <button 
              onClick={fetchCustomerDetails}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-sm lg:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 flex items-center justify-center overflow-x-hidden">
        <div className="text-center mx-3 lg:mx-4">
          <User className="w-12 h-12 lg:w-16 lg:h-16 text-[#413329]/40 mx-auto mb-3 lg:mb-4" />
          <h2 className="text-xl lg:text-2xl font-bold text-[#413329] mb-2">Customer Not Found</h2>
          <p className="text-[#413329]/70 mb-4 text-sm lg:text-base">The customer you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/admin/customer')}
            className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold text-sm lg:text-base"
          >
            Back to Customers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <button
            onClick={() => router.push('/admin/customer')}
            className="flex items-center space-x-2 text-[#413329] hover:text-[#5D4A3A] transition-colors group text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Customers</span>
          </button>
        </div>

        {/* Customer Profile */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-4 lg:mb-0">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-lg border-2 border-white/40">
                <User className="w-8 h-8 lg:w-10 lg:h-10 text-[#413329]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-[#413329] mb-2 text-center lg:text-left">{customer.name}</h1>
                <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:flex-wrap lg:gap-4 text-[#413329]/70 text-sm lg:text-base">
                  <div className="flex items-center space-x-2 justify-center lg:justify-start">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-2 justify-center lg:justify-start">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 justify-center lg:justify-start">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {formatDate(customer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center w-full lg:w-auto">
              <div className="bg-[#413329]/5 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-[#413329]/10">
                <div className="text-xl lg:text-2xl font-bold text-[#413329]">{orders.length}</div>
                <div className="text-[#413329]/60 text-xs lg:text-sm">Total Orders</div>
              </div>
              <div className="bg-[#413329]/5 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-[#413329]/10">
                <div className="text-xl lg:text-2xl font-bold text-[#413329]">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-[#413329]/60 text-xs lg:text-sm">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-[#413329] mb-3 lg:mb-4 flex items-center">
              <User className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Customer Information
            </h2>
            <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Customer ID</span>
                <span className="font-semibold text-[#413329] text-xs lg:text-sm truncate ml-2 max-w-[120px] lg:max-w-none">{customer._id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Full Name</span>
                <span className="font-semibold text-[#413329]">{customer.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Email Address</span>
                <span className="font-semibold text-[#413329] text-xs lg:text-sm truncate ml-2 max-w-[120px] lg:max-w-none">{customer.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Phone Number</span>
                <span className="font-semibold text-[#413329]">{customer.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#413329]/70">Account Created</span>
                <span className="font-semibold text-[#413329]">{formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-[#413329] mb-3 lg:mb-4 flex items-center">
              <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Order Statistics
            </h2>
            <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Total Orders</span>
                <span className="font-semibold text-[#413329]">{orders.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Completed Orders</span>
                <span className="font-semibold text-emerald-600">{orders.filter(o => o.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Pending Orders</span>
                <span className="font-semibold text-amber-600">{orders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#413329]/10">
                <span className="text-[#413329]/70">Confirmed Orders</span>
                <span className="font-semibold text-blue-600">{orders.filter(o => o.status === 'confirmed').length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#413329]/70">Cancelled Orders</span>
                <span className="font-semibold text-rose-600">{orders.filter(o => o.status === 'cancelled').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-4 lg:px-6 py-3 lg:py-4 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-2 lg:space-y-0">
              <h2 className="text-lg lg:text-xl font-bold text-center lg:text-left">Order History ({orders.length})</h2>
              <button 
                onClick={fetchCustomerDetails}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 lg:px-4 py-1 lg:py-2 rounded-xl transition-colors text-sm lg:text-base justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            {orders.length === 0 ? (
              <div className="text-center py-8 lg:py-12 text-[#413329]/60">
                <Package className="w-12 h-12 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 opacity-40" />
                <p className="text-lg lg:text-xl font-semibold mb-2">No Orders Yet</p>
                <p className="text-sm lg:text-lg">This customer hasn't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4 lg:space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-[#413329]/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 lg:gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 lg:gap-4 mb-3 lg:mb-4">
                          <div className={`inline-flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 rounded-xl lg:rounded-2xl border text-xs lg:text-sm ${getStatusBadge(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="font-semibold capitalize">{order.status}</span>
                          </div>
                          <div className="text-lg lg:text-xl font-bold text-[#413329]">
                            {formatCurrency(order.totalAmount)}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getPaymentBadge(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 lg:gap-4 text-xs lg:text-sm">
                          <div className="flex items-center space-x-2">
                            <Package className="w-3 h-3 lg:w-4 lg:h-4 text-[#413329]/60 flex-shrink-0" />
                            <span><strong>Service:</strong> {order.service?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-[#413329]/60 flex-shrink-0" />
                            <span><strong>Date:</strong> {formatDate(order.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-[#413329]/60 flex-shrink-0" />
                            <span><strong>Time:</strong> {formatTime(order.startTime)} - {formatTime(order.endTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-3 h-3 lg:w-4 lg:h-4 text-[#413329]/60 flex-shrink-0" />
                            <span><strong>Payment:</strong> {order.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
                          </div>
                          {order.razorpayOrderId && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs"><strong>Razorpay ID:</strong> {order.razorpayOrderId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 lg:flex-col lg:space-y-2 lg:space-x-0 lg:items-end">
                        <button className="p-1 lg:p-2 hover:bg-[#413329]/10 rounded-lg lg:rounded-xl transition-colors" title="View Details">
                          <Eye className="w-4 h-4 text-[#413329]/60" />
                        </button>
                        <button className="p-1 lg:p-2 hover:bg-[#413329]/10 rounded-lg lg:rounded-xl transition-colors" title="Edit Order">
                          <Edit className="w-4 h-4 text-[#413329]/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetails