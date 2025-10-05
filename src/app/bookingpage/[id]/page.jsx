'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import useUserStore from '@/store/useStore'

const BookingPage = () => {
  const params = useParams()
  const router = useRouter()
  const { token, user } = useUserStore()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [userPhone, setUserPhone] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeTab, setActiveTab] = useState('details')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow: "0 25px 50px rgba(65, 51, 41, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  // Salon operating hours (9 AM to 8 PM)
  const operatingHours = {
    start: 9,
    end: 20
  }

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const days = []
    // Add previous month's trailing days
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({ date: currentDate, isCurrentMonth: true })
    }
    
    // Add next month's leading days
    const totalCells = 42 // 6 weeks
    while (days.length < totalCells) {
      const nextDate = new Date(year, month + 1, days.length - daysInMonth - firstDayOfWeek + 1)
      days.push({ date: nextDate, isCurrentMonth: false })
    }
    
    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false
    return date1.toDateString() === date2.toDateString()
  }

  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  useEffect(() => {
    fetchServiceDetails()
  }, [params.id])

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots()
    }
  }, [selectedDate])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getServiceById/${params.id}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch service details: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.service) {
        setService(data.service)
        toast.success('Service loaded successfully!')
      } else {
        throw new Error('Service not found in response')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      toast.error('Failed to load service details')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookedSlots = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const dateStr = selectedDate.toISOString().split('T')[0]
      console.log('🔍 Fetching slots for:', { date: dateStr, service: params.id })
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/getBookedSlots?date=${dateStr}&service=${params.id}`,
        { headers }
      )

      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('✅ Fetched booked slots:', data.bookedSlots)
          setBookedSlots(data.bookedSlots || [])
        } else {
          console.error('❌ API returned error:', data.message)
          setBookedSlots([])
        }
      } else {
        console.error('❌ Failed to fetch booked slots:', response.status)
        setBookedSlots([])
      }
    } catch (error) {
      console.error('💥 Error fetching booked slots:', error)
      setBookedSlots([])
    }
  }

  // Check if a specific time slot is available locally
  const isTimeSlotAvailable = (timeSlot) => {
    if (!selectedDate) return false

    const slotDateTime = new Date(selectedDate)
    slotDateTime.setHours(timeSlot.hour, 0, 0, 0)

    // Check if slot is in the past
    if (slotDateTime < new Date()) {
      return false
    }

    // Check if slot is booked
    const isBooked = bookedSlots.some(bookedSlot => {
      const bookedStart = new Date(bookedSlot.startTime)
      const bookedHour = bookedStart.getHours()
      return bookedHour === timeSlot.hour
    })

    return !isBooked
  }

  // NEW FUNCTION: Check real-time slot availability with API
  const checkSlotAvailability = async (timeSlot) => {
    if (!selectedDate || !timeSlot) return false

    try {
      setCheckingAvailability(true)
      
      const dateStr = selectedDate.toISOString().split('T')[0]
      const startTime = new Date(selectedDate)
      startTime.setHours(timeSlot.hour, 0, 0, 0)
      
      const endTime = new Date(selectedDate)
      endTime.setHours(timeSlot.hour + 1, 0, 0, 0)

      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/getBookedSlots?date=${dateStr}&service=${params.id}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`,
        { headers }
      )

      if (response.ok) {
        const data = await response.json()
        console.log('🎯 Real-time slot check result:', data)
        
        if (data.success && data.available) {
          toast.success('✅ Slot is available!')
          return true
        } else {
          toast.error('❌ This slot is no longer available')
          return false
        }
      } else {
        toast.error('❌ Failed to check slot availability')
        return false
      }
    } catch (error) {
      console.error('💥 Error checking slot availability:', error)
      toast.error('Failed to check slot availability')
      return false
    } finally {
      setCheckingAvailability(false)
    }
  }

  // Generate only available time slots
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return []

    return Array.from({ length: operatingHours.end - operatingHours.start }, (_, i) => {
      const hour = operatingHours.start + i
      const timeSlot = {
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour: hour,
      }

      // Check if slot is available
      const isAvailable = isTimeSlotAvailable(timeSlot)

      // Return only if available
      return isAvailable ? timeSlot : null
    }).filter(slot => slot !== null)
  }

  const handleDateSelect = (date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = async (timeSlot) => {
    // First check if the time slot is available locally
    if (!isTimeSlotAvailable(timeSlot)) {
      toast.error('Sorry, this time slot is no longer available. Please select another time.')
      setSelectedTime(null)
      return
    }
    
    // Then do a real-time check with the API
    const isAvailable = await checkSlotAvailability(timeSlot)
    
    if (isAvailable) {
      setSelectedTime(timeSlot)
    } else {
      setSelectedTime(null)
      // Refresh the booked slots to update the UI
      await fetchBookedSlots()
    }
  }

  const handleMakePayment = async () => {
    if (!selectedDate || !selectedTime || !userPhone) {
      toast.error('Please fill all required fields')
      return
    }

    if (!/^\d{10}$/.test(userPhone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    // Final real-time availability check before payment
    const isAvailable = await checkSlotAvailability(selectedTime)
    if (!isAvailable) {
      toast.error('Sorry, this time slot is no longer available. Please select another time.')
      setSelectedTime(null)
      await fetchBookedSlots() // Refresh slots
      return
    }

    setShowPaymentModal(true)
  }

  const createBooking = async (paymentMethod, paymentStatus = 'pending', razorpayDetails = null) => {
    try {
      setSubmitting(true)

      // Create fresh date objects to avoid mutation issues
      const startTime = new Date(selectedDate)
      startTime.setHours(selectedTime.hour, 0, 0, 0)
      
      const endTime = new Date(selectedDate)
      endTime.setHours(selectedTime.hour + 1, 0, 0, 0)

      const bookingData = {
        service: params.id,
        userPhone,
        startTime: startTime,
        endTime: endTime,
        date: selectedDate,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        status: 'confirmed',
        totalAmount: service.price,
        ...(razorpayDetails && {
          razorpayOrderId: razorpayDetails.razorpay_order_id,
          razorpayPaymentId: razorpayDetails.razorpay_payment_id,
          razorpaySignature: razorpayDetails.razorpay_signature
        })
      }

      console.log('📤 Creating booking with data:', bookingData)

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const bookingToast = toast.loading('Creating your booking...')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/newBooking`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(bookingData)
        }
      )

      toast.dismiss(bookingToast)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Booking failed')
      }

      const result = await response.json()
      console.log('✅ Booking response:', result)

      if (result.success) {
        toast.success('🎉 Your booking has been confirmed!')
        toast.success('📧 A confirmation email has been sent to your inbox.')
        
        setTimeout(() => {
          router.push('/')
        }, 2500)
      }

    } catch (error) {
      console.error('❌ Booking error:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
      setShowPaymentModal(false)
    }
  }

  const handlePayAfterService = async () => {
    await createBooking('pay_after_service', 'pending')
  }

  const handleOnlinePayment = async () => {
    try {
      // First create Razorpay order
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/payments/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: Math.round(service.price * 100), // Convert to paise
            currency: 'INR',
            service: service.name
          })
        }
      )

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const orderData = await orderResponse.json()
      console.log('💰 Razorpay order created:', orderData)

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        openRazorpayCheckout(orderData.order)
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('💳 Payment initiation error:', error)
      toast.error('Failed to initiate payment')
      setSubmitting(false)
    }
  }

  const openRazorpayCheckout = (order) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Asha Beauty Parlour',
      description: `Payment for ${service.name}`,
      order_id: order.id,
      handler: async function (response) {
        console.log('💳 Payment successful:', response)
        
        // Verify payment on backend
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/payments/verify-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          }
        )

        if (verifyResponse.ok) {
          const verificationResult = await verifyResponse.json()
          if (verificationResult.success) {
            await createBooking('razorpay', 'paid', response)
          } else {
            toast.error('Payment verification failed')
          }
        } else {
          toast.error('Payment verification failed')
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: userPhone
      },
      theme: {
        color: '#2A2118'
      },
      modal: {
        ondismiss: function() {
          toast.error('Payment cancelled')
          setSubmitting(false)
        }
      }
    };

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  const getServiceIcon = (serviceCategory) => {
    const icons = {
      "Hair": "/haircut.png",
      "Skin": "/facialmassage.png",
      "Makeup": "/makeup.png",
      "Nails": "/eyebrows.png",
    }
    return icons[serviceCategory] || "/makeup.png"
  }

  const formatDisplayDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  // Service detail tabs
  const serviceTabs = [
    { id: 'details', label: 'Service Details', icon: '📋' },
    { id: 'benefits', label: 'Benefits', icon: '✨' },
    { id: 'process', label: 'Process', icon: '🔄' },
  ]

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FAF3EB] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
        <Toaster position="top-right" />
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className='inline-block relative' 
            >
              <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2A2118] to-[#5D4C38] bg-clip-text text-transparent mb-6'>
                BOOK YOUR APPOINTMENT
              </h1>
            </motion.div>
          </div>
          
          <motion.div 
            className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className='animate-pulse space-y-8'>
              <div className='flex items-center space-x-6'>
                <div className='w-24 h-24 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-2xl'></div>
                <div className='space-y-3 flex-1'>
                  <div className='h-6 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-full w-3/4'></div>
                  <div className='h-4 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-full w-1/2'></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FAF3EB] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
        <Toaster position="top-right" />
        <div className='max-w-6xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-white/20'
          >
            <h2 className='text-2xl font-bold text-[#2A2118] mb-4'>Service Not Found</h2>
            <p className='text-[#2A2118]/70 mb-6'>The service you're looking for doesn't exist or failed to load.</p>
            <div className='space-y-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/servicespage')}
                className='bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white px-8 py-3 rounded-2xl font-semibold block w-full'
              >
                Back to Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const calendarDays = getDaysInMonth(currentMonth)
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const availableTimeSlots = getAvailableTimeSlots()

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FAF3EB] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
      <Toaster position="top-right" />
      
      {/* Enhanced Animated Background */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <motion.div 
          className='absolute -top-40 -right-40 w-80 h-80 bg-[#2A2118]/5 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-[#5D4C38]/5 rounded-full blur-3xl'
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Enhanced Header */}
        <motion.div 
          className='text-center mb-12'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className='inline-block relative'
          >
            <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#2A2118] to-[#5D4C38] bg-clip-text text-transparent mb-6 px-4'>
              Book Service
            </h1>
            <motion.div 
              className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full opacity-50'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='grid grid-cols-1 xl:grid-cols-3 gap-8'
        >
          {/* Service Details Section */}
          <motion.div
            variants={containerVariants}
            className='xl:col-span-2 space-y-8'
          >
            {/* Service Hero Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20 mx-2 md:mx-0'
            >
              <div className='flex flex-col lg:flex-row items-start gap-6 md:gap-8'>
                {/* Service Icon and Basic Info */}
                <motion.div 
                  className='flex-shrink-0 text-center lg:text-left'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className='w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-[#FAF3EB] to-[#FFF9F5] rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-4 md:mb-6 shadow-lg border border-white/50'>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image
                        src={getServiceIcon(service.category)}
                        alt={service.category}
                        width={48}
                        height={48}
                        className='object-contain w-10 h-10 md:w-16 md:h-16'
                      />
                    </motion.div>
                  </div>
                  <motion.div 
                    className='inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white font-bold text-xs md:text-sm'
                    whileHover={{ scale: 1.1 }}
                  >
                    {service.category}
                  </motion.div>
                </motion.div>

                {/* Service Main Info */}
                <div className='flex-1 w-full'>
                  <motion.h2 
                    className='text-2xl md:text-4xl font-bold text-[#2A2118] mb-4'
                    variants={itemVariants}
                  >
                    {service.name}
                  </motion.h2>
                  
                  <motion.div 
                    className='flex flex-wrap gap-4 md:gap-6 mb-6'
                    variants={itemVariants}
                  >
                    <div className='flex items-center gap-2 md:gap-3 bg-white/50 rounded-2xl px-3 py-2 md:px-4 md:py-2 border border-white/30'>
                      <span className='text-lg md:text-xl'>💰</span>
                      <span className='text-lg md:text-xl font-bold text-[#2A2118]'>
                        {service.price ? 
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'INR',
                          }).format(service.price) : 'Contact for price'
                        }
                      </span>
                    </div>
                    <div className='flex items-center gap-2 md:gap-3 bg-white/50 rounded-2xl px-3 py-2 md:px-4 md:py-2 border border-white/30'>
                      <span className='text-lg md:text-xl'>⏱️</span>
                      <span className='text-base md:text-lg font-semibold text-[#2A2118]'>
                        {service.duration ? `${service.duration} minutes` : 'Flexible duration'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Service Tabs */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <div className='flex space-x-1 bg-white/50 rounded-2xl p-1 border border-white/30'>
                      {serviceTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm transition-all duration-300 rounded-xl ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white shadow-lg'
                              : 'text-[#2A2118]/60 hover:text-[#2A2118] hover:bg-white/50'
                          }`}
                        >
                          <span className='text-sm md:text-base'>{tab.icon}</span>
                          <span className='hidden sm:inline'>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tab Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='min-h-[150px] md:min-h-[200px]'
                  >
                    {activeTab === 'details' && (
                      <div className='space-y-4'>
                        <p className='text-base md:text-lg text-[#2A2118]/80 leading-relaxed'>
                          {service.description || `Our premium ${service.name} service is designed to provide you with the ultimate beauty experience. Our expert professionals use only the highest quality products and techniques to ensure you leave feeling refreshed and rejuvenated.`}
                        </p>
                      </div>
                    )}

                    {activeTab === 'benefits' && (
                      <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                          <div className='bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
                            <h4 className='font-semibold text-[#2A2118] mb-2 text-sm md:text-base'>✨ Immediate Results</h4>
                            <p className='text-[#2A2118]/70 text-xs md:text-sm'>Visible improvement after first session</p>
                          </div>
                          <div className='bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
                            <h4 className='font-semibold text-[#2A2118] mb-2 text-sm md:text-base'>🌿 Premium Products</h4>
                            <p className='text-[#2A2118]/70 text-xs md:text-sm'>Using only certified organic products</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'process' && (
                      <div className='space-y-4'>
                        <div className='space-y-3'>
                          <div className='flex items-start gap-3 md:gap-4 bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
                            <div className='w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1'>1</div>
                            <div>
                              <h4 className='font-semibold text-[#2A2118] text-sm md:text-base'>Consultation</h4>
                              <p className='text-[#2A2118]/70 text-xs md:text-sm'>Personalized assessment of your needs</p>
                            </div>
                          </div>
                          <div className='flex items-start gap-3 md:gap-4 bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
                            <div className='w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1'>2</div>
                            <div>
                              <h4 className='font-semibold text-[#2A2118] text-sm md:text-base'>Service Execution</h4>
                              <p className='text-[#2A2118]/70 text-xs md:text-sm'>Expert application of the selected treatment</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20 mx-2 md:mx-0'
            >
              <motion.h3 
                className='text-xl md:text-2xl font-bold text-[#2A2118] mb-6 flex items-center'
                variants={itemVariants}
              >
                <span className="mr-2 md:mr-3 text-xl">📱</span>
                Contact Information
              </motion.h3>
              <div className='space-y-6'>
                <motion.div variants={itemVariants}>
                  <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                    Phone Number *
                  </label>
                  <motion.input
                    type='tel'
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder='Enter your 10-digit phone number'
                    maxLength={10}
                    whileFocus={{ scale: 1.02 }}
                    className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40'
                  />
                  <p className='text-sm text-[#2A2118]/50 mt-3'>
                    We'll send booking confirmation via SMS
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Booking Sidebar */}
          <motion.div
            variants={containerVariants}
            className='xl:col-span-1 space-y-8'
          >
            {/* Enhanced Calendar Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 md:p-6 border border-white/20 mx-2 md:mx-0'
            >
              <motion.div 
                className='flex items-center justify-between mb-4 md:mb-6'
                variants={itemVariants}
              >
                <h3 className='text-lg md:text-xl font-bold text-[#2A2118] flex items-center'>
                  <span className="mr-2 text-lg md:text-xl">📅</span>
                  Select Date
                </h3>
                <div className='flex space-x-2'>
                  <motion.button
                    onClick={() => navigateMonth(-1)}
                    whileHover={{ scale: 1.1, backgroundColor: '#2A211810' }}
                    whileTap={{ scale: 0.9 }}
                    className='p-2 rounded-xl border border-[#2A2118]/20 hover:border-[#2A2118]/40 transition-all duration-200'
                  >
                    ←
                  </motion.button>
                  <motion.button
                    onClick={() => navigateMonth(1)}
                    whileHover={{ scale: 1.1, backgroundColor: '#2A211810' }}
                    whileTap={{ scale: 0.9 }}
                    className='p-2 rounded-xl border border-[#2A2118]/20 hover:border-[#2A2118]/40 transition-all duration-200'
                  >
                    →
                  </motion.button>
                </div>
              </motion.div>

              {/* Month Year Display */}
              <motion.div 
                className='text-center mb-3 md:mb-4'
                variants={itemVariants}
              >
                <h4 className='text-base md:text-lg font-bold text-[#2A2118]'>{monthYear}</h4>
              </motion.div>

              {/* Calendar Grid */}
              <motion.div variants={itemVariants} className='grid grid-cols-7 gap-1 mb-2 md:mb-3'>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className='text-center text-xs font-bold text-[#2A2118]/60 py-1 md:py-2'>
                    {day}
                  </div>
                ))}
              </motion.div>

              <motion.div 
                variants={containerVariants}
                className='grid grid-cols-7 gap-1'
              >
                {calendarDays.map((day, index) => {
                  const isAvailable = !isPastDate(day.date) && day.isCurrentMonth
                  const isSelected = selectedDate && isSameDay(day.date, selectedDate)
                  const isCurrentDay = isToday(day.date)

                  return (
                    <motion.button
                      key={day.date.toISOString()}
                      onClick={() => handleDateSelect(day.date)}
                      variants={itemVariants}
                      whileHover={isAvailable ? { 
                        scale: 1.1, 
                        y: -2,
                      } : {}}
                      whileTap={isAvailable ? { scale: 0.95 } : {}}
                      disabled={!isAvailable}
                      className={`p-1 md:p-2 rounded-xl text-center transition-all duration-300 relative text-sm ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#2A2118] to-[#5D4C38] text-white shadow-lg'
                          : isAvailable
                          ? day.isCurrentMonth
                            ? 'bg-white/50 text-[#2A2118] hover:bg-white/80 border border-white/30'
                            : 'bg-white/30 text-[#2A2118]/40 border border-white/20'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      } ${isCurrentDay && !isSelected ? 'ring-2 ring-[#2A2118]/30' : ''}`}
                    >
                      <div className={`text-xs md:text-sm font-medium ${
                        !day.isCurrentMonth ? 'opacity-50' : ''
                      }`}>
                        {day.date.getDate()}
                      </div>
                      {isCurrentDay && !isSelected && (
                        <div className='absolute bottom-0 md:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#2A2118] rounded-full'></div>
                      )}
                    </motion.button>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* Time Selection Card */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  variants={cardVariants}
                  whileHover="hover"
                  className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 md:p-6 border border-white/20 mx-2 md:mx-0'
                >
                  <motion.h3 
                    className='text-lg md:text-xl font-bold text-[#2A2118] mb-3 md:mb-4 flex items-center'
                    variants={itemVariants}
                  >
                    <span className="mr-2 text-lg md:text-xl">⏰</span>
                    Available Times
                    {checkingAvailability && (
                      <motion.span 
                        className="ml-2 text-sm text-[#2A2118]/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        (Checking...)
                      </motion.span>
                    )}
                  </motion.h3>
                  <motion.p 
                    className='text-xs md:text-sm text-[#2A2118]/60 mb-3 md:mb-4'
                    variants={itemVariants}
                  >
                    {formatDisplayDate(selectedDate)}
                  </motion.p>

                  {/* Show message if no slots available */}
                  {availableTimeSlots.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 md:py-8"
                    >
                      <div className="text-3xl md:text-4xl mb-2 md:mb-3">😔</div>
                      <p className="text-[#2A2118]/70 font-medium text-sm md:text-base">No available slots</p>
                      <p className="text-[#2A2118]/50 text-xs md:text-sm mt-1">
                        Please select another date
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={containerVariants}
                      className='grid grid-cols-2 gap-2 md:gap-3 max-h-60 md:max-h-80 overflow-y-auto'
                    >
                      {availableTimeSlots.map((timeSlot) => {
                        const isSelected = selectedTime && selectedTime.time === timeSlot.time
                        const isChecking = checkingAvailability && isSelected

                        return (
                          <motion.button
                            key={timeSlot.time}
                            onClick={() => handleTimeSelect(timeSlot)}
                            variants={itemVariants}
                            whileHover={{ 
                              scale: 1.05, 
                              y: -2,
                            }}
                            whileTap={{ scale: 0.95 }}
                            disabled={checkingAvailability}
                            className={`p-2 md:p-3 rounded-xl text-center transition-all duration-300 font-medium text-xs md:text-sm relative overflow-hidden ${
                              isSelected
                                ? 'bg-gradient-to-br from-[#2A2118] to-[#5D4C38] text-white shadow-lg'
                                : 'bg-white/50 text-[#2A2118] hover:bg-white/80 border border-white/30 hover:border-[#2A2118]/20'
                            } ${checkingAvailability ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isChecking && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                  x: ['-100%', '100%'],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                            {timeSlot.time}
                            {isChecking && (
                              <motion.div
                                className="absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Booking Summary Card */}
            <motion.div
              variants={cardVariants}
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 md:p-6 border border-white/20 sticky top-8 mx-2 md:mx-0'
            >
              <motion.h3 
                className='text-lg md:text-xl font-bold text-[#2A2118] mb-3 md:mb-4 flex items-center'
                variants={itemVariants}
              >
                <span className="mr-2 text-lg md:text-xl">📋</span>
                Booking Summary
              </motion.h3>
              
              <div className='space-y-2 md:space-y-3 mb-4 md:mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-[#2A2118]/70 text-sm md:text-base'>Service:</span>
                  <span className='font-semibold text-[#2A2118] text-sm md:text-base'>{service.name}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[#2A2118]/70 text-sm md:text-base'>Price:</span>
                  <span className='font-bold text-[#2A2118] text-sm md:text-base'>
                    {service.price ? 
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(service.price) : 'Contact for price'
                    }
                  </span>
                </div>
                {selectedDate && (
                  <>
                    <div className='border-t border-[#2A2118]/10 pt-2 md:pt-3'>
                      <div className='flex justify-between items-center'>
                        <span className='text-[#2A2118]/70 text-sm md:text-base'>Date:</span>
                        <span className='font-semibold text-[#2A2118] text-sm md:text-base'>{formatDisplayDate(selectedDate)}</span>
                      </div>
                      {selectedTime && (
                        <div className='flex justify-between items-center mt-1 md:mt-2'>
                          <span className='text-[#2A2118]/70 text-sm md:text-base'>Time:</span>
                          <span className='font-semibold text-[#2A2118] text-sm md:text-base'>{selectedTime.time}</span>
                        </div>
                      )}
                      {availableTimeSlots.length === 0 && (
                        <div className='mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-center'>
                          <p className='text-amber-700 text-xs md:text-sm'>No available slots for this date</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <motion.button
                onClick={handleMakePayment}
                disabled={!selectedDate || !selectedTime || !userPhone || submitting || availableTimeSlots.length === 0 || checkingAvailability}
                whileHover={(!selectedDate || !selectedTime || !userPhone || submitting || availableTimeSlots.length === 0 || checkingAvailability) ? {} : { scale: 1.02 }}
                whileTap={(!selectedDate || !selectedTime || !userPhone || submitting || availableTimeSlots.length === 0 || checkingAvailability) ? {} : { scale: 0.98 }}
                className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 relative overflow-hidden ${
                  selectedDate && selectedTime && userPhone && !submitting && availableTimeSlots.length > 0 && !checkingAvailability
                    ? 'bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white cursor-pointer shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <motion.div 
                    className='flex items-center justify-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className='w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full mr-2'
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    Processing...
                  </motion.div>
                ) : checkingAvailability ? (
                  'Checking Availability...'
                ) : availableTimeSlots.length === 0 ? (
                  'No Available Slots'
                ) : (
                  'Make Payment'
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
          >
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0" 
              onClick={() => !submitting && setShowPaymentModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full relative border border-white/20 mx-2"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                  <span className="text-xl md:text-2xl">💎</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  Complete Your Booking
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  Choose your preferred payment method
                </p>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {/* Pay After Service */}
                <motion.button
                  onClick={handlePayAfterService}
                  disabled={submitting}
                  whileHover={!submitting ? { 
                    scale: 1.02, 
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  className={`w-full p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                    submitting 
                      ? 'opacity-50 cursor-not-allowed border-gray-200' 
                      : 'border-emerald-100 hover:border-emerald-300 hover:shadow-lg'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
                  }}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-3 md:gap-4 relative z-10">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-emerald-500/25">
                      ⏰
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-base md:text-lg">Pay Later</div>
                      <div className="text-xs md:text-sm text-gray-600">Pay at the salon when you visit</div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                  </div>
                </motion.button>

                {/* Online Payment */}
                <motion.button
                  onClick={handleOnlinePayment}
                  disabled={submitting}
                  whileHover={!submitting ? { 
                    scale: 1.02, 
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  className={`w-full p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                    submitting 
                      ? 'opacity-50 cursor-not-allowed border-gray-200' 
                      : 'border-blue-100 hover:border-blue-300 hover:shadow-lg'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)'
                  }}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="flex items-center gap-3 md:gap-4 relative z-10">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-blue-500/25">
                      🔒
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-base md:text-lg">Pay Now</div>
                      <div className="text-xs md:text-sm text-gray-600">Secure payment via Razorpay</div>
                    </div>
                    <div className="text-blue-600 font-semibold text-xs md:text-sm bg-blue-100 px-2 md:px-3 py-1 rounded-full">
                      Secure
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 md:space-y-3">
                <motion.button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={submitting}
                  whileHover={!submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitting ? { scale: 0.98 } : {}}
                  className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 border-2 text-sm md:text-base ${
                    submitting 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  Cancel
                </motion.button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                <div className="w-3 h-3 md:w-4 md:h-4 text-green-500">✓</div>
                <span className="text-xs text-gray-500">100% Secure & Encrypted</span>
              </div>

              {/* Loading State */}
              {submitting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-col"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 md:w-12 md:h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-3 md:mb-4"
                  />
                  <div className="text-gray-700 font-medium text-sm md:text-base">Processing your request...</div>
                  <div className="text-gray-500 text-xs md:text-sm mt-1">Please wait a moment</div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BookingPage