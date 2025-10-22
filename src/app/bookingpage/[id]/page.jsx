'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import useUserStore from '@/store/useStore'
import SuccessModal from '@/components/modal/SuccessModal'
import {
  AuthGuard,
  ServiceDetailsCard,
  CalendarCard,
  TimeSlotsCard,
  BookingSummaryCard,
  ContactInfoCard,
  PaymentModal,
  LoadingState,
  AnimatedBackground,
  PageHeader
} from '@/components/booking'

const BookingPage = () => {
  const params = useParams()
  const router = useRouter()
  const { token, user } = useUserStore()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [userPhone, setUserPhone] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activeTab, setActiveTab] = useState('details')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
    if (!token) {
      setError('Authentication required')
      setLoading(false)
      toast.error('Please login to book services')
      return
    }
    fetchServiceDetails()
  }, [params.id, token])

  useEffect(() => {
    if (selectedDate && token) {
      fetchBookedSlots()
    }
  }, [selectedDate, token])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
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
        if (response.status === 401) {
          setError('Authentication required')
          toast.error('Please login to view services')
          throw new Error('Authentication required. Please login to view services.')
        }
        toast.error(`Failed to load services (Error: ${response.status})`)
        throw new Error(`Failed to fetch services: ${response.status}`)
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
      setError(error.message)
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
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking/getBookedSlots?date=${dateStr}&service=${params.id}`,
        { headers }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBookedSlots(data.bookedSlots || [])
        } else {
          setBookedSlots([])
        }
      } else {
        setBookedSlots([])
      }
    } catch (error) {
      console.error('Error fetching booked slots:', error)
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

  // Check real-time slot availability with API
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
        
        if (data.success && data.available) {
          toast.success('Slot is available!')
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
      console.error('Error checking slot availability:', error)
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
    // Check authentication first
    if (!token) {
      toast.error('Please login to book services')
      router.push('/login')
      return
    }

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
        status: 'pending',
        totalAmount: service.price,
        ...(razorpayDetails && {
          razorpayOrderId: razorpayDetails.razorpay_order_id,
          razorpayPaymentId: razorpayDetails.razorpay_payment_id,
          razorpaySignature: razorpayDetails.razorpay_signature
        })
      }

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

      if (result.success) {
        // Set booking details for success modal
        setBookingDetails({
          date: formatDisplayDate(selectedDate),
          time: selectedTime.time,
          phone: userPhone,
          service: service.name,
          bookingId: result.booking?._id || 'N/A'
        })
        
        // Show success modal instead of toast
        setShowSuccessModal(true)
        
        // Close payment modal
        setShowPaymentModal(false)
      }

    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
      setPaymentProcessing(false)
    }
  }

  const handlePayAfterService = async () => {
    setPaymentProcessing('pay_later')
    await createBooking('pay_after_service', 'pending')
  }

  const handleOnlinePayment = async () => {
    setPaymentProcessing('pay_now')
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

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        openRazorpayCheckout(orderData.order)
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error('Failed to initiate payment')
      setPaymentProcessing(false)
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
        console.log('Payment successful:', response)
        
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
            setPaymentProcessing(false)
          }
        } else {
          toast.error('Payment verification failed')
          setPaymentProcessing(false)
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
          setPaymentProcessing(false)
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

  if (loading) {
    return <LoadingState />
  }
  if(error){
    return<AuthGuard/>
  }

  // Show service not found error
  if (!service) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
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

  return (
    <AuthGuard token={token}>
      <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
        <Toaster position="top-right" />
        
        {/* Animated Background */}
        <AnimatedBackground />
        
        <div className='max-w-7xl mx-auto relative z-10'>
          <PageHeader />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className='grid grid-cols-1 xl:grid-cols-3 gap-8'
          >
            {/* Left Column - Service Details & Contact */}
            <motion.div
              variants={containerVariants}
              className='xl:col-span-2 space-y-8'
            >
              <ServiceDetailsCard
                service={service}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                getServiceIcon={getServiceIcon}
              />
              
              <ContactInfoCard
                userPhone={userPhone}
                setUserPhone={setUserPhone}
              />
            </motion.div>

            {/* Right Column - Booking Controls */}
            <motion.div
              variants={containerVariants}
              className='xl:col-span-1 space-y-8'
            >
              <CalendarCard
                currentMonth={currentMonth}
                navigateMonth={navigateMonth}
                selectedDate={selectedDate}
                handleDateSelect={handleDateSelect}
                getDaysInMonth={getDaysInMonth}
                isPastDate={isPastDate}
                isSameDay={isSameDay}
                isToday={isToday}
              />
              
              <TimeSlotsCard
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                handleTimeSelect={handleTimeSelect}
                availableTimeSlots={getAvailableTimeSlots()}
                checkingAvailability={checkingAvailability}
                formatDisplayDate={formatDisplayDate}
              />
              
              <BookingSummaryCard
                service={service}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                userPhone={userPhone}
                submitting={submitting}
                availableTimeSlots={getAvailableTimeSlots()}
                checkingAvailability={checkingAvailability}
                handleMakePayment={handleMakePayment}
                formatDisplayDate={formatDisplayDate}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          paymentProcessing={paymentProcessing}
          handlePayAfterService={handlePayAfterService}
          handleOnlinePayment={handleOnlinePayment}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          serviceName={service?.name}
          bookingDetails={bookingDetails}
        />
      </div>
    </AuthGuard>
  )
}

export default BookingPage