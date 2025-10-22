'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import useUserStore from '@/store/useStore'
import toast, { Toaster } from 'react-hot-toast';
import {useRouter} from 'next/navigation'


const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("All")
  const [selectedService, setSelectedService] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const { token } = useUserStore()
  
  const router = useRouter();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const headers = {
          'Content-Type': 'application/json',
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const loadingToast = toast.loading('Loading services...', {
          duration: 3000,
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/getallService`,
          {
            headers,
          }
        )

        toast.dismiss(loadingToast)

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please login to view services', {
              duration: 4000,
              icon: '🔒',
            })
            throw new Error('Authentication required. Please login to view services.')
          }
          toast.error(`Failed to load services (Error: ${response.status})`, {
            duration: 4000,
          })
          throw new Error(`Failed to fetch services: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("📦 All services data:", data)
        
        let servicesData = data.services || data
        
        if (data.success && data.data) {
          servicesData = data.data
        }

        const activeServices = Array.isArray(servicesData) 
          ? servicesData.filter((service) => service.isActive !== false)
          : []
          
        setServices(activeServices)

        if (activeServices.length > 0) {
          toast.success(`Loaded ${activeServices.length} services successfully!`, {
            duration: 2000,
            icon: '✨',
          })
        } else {
          toast('No active services available at the moment', {
            duration: 3000,
            icon: 'ℹ️',
          })
        }
         
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services')
        console.error('❌ Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }
      
    fetchServices()
  }, [token])

  const filteredServices = filter === "All" 
    ? services 
    : services.filter(service => service.category === filter)

  const categories = ["All", ...new Set(services.map(service => service.category))]

  const formatDuration = (minutes) => {
    if (!minutes) return 'Flexible'
    
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Contact for price'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  // New animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.3
      }
    }
  }

  const filterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const getServiceIcon = (service) => {
    if (service.image) {
      return (
        <img
          src={service.image}
          alt={service.name}
          width={48}
          height={48}
          className='object-contain'
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      )
    }

    switch (service.category) {
      case "Hair":
        return (
          <Image
            src="/haircut.png"
            alt="Hair Services"
            width={48}
            height={48}
            className='object-contain'
          />
        )
      case "Skin":
        return (
          <Image
            src="/facialmassage.png"
            alt="Skin Treatments"
            width={48}
            height={48}
            className='object-contain'
          />
        )
      case "Makeup":
        return (
          <Image
            src="/makeup.png"
            alt="Makeup Services"
            width={48}
            height={48}
            className='object-contain'
          />
        )
      case "Nails":
        return (
          <Image
            src="/eyebrows.png"
            alt="Nail Services"
            width={48}
            height={48}
            className='object-contain'
          />
        )
      default:
        return (
          <Image
            src="/makeup.png"
            alt="Service"
            width={48}
            height={48}
            className='object-contain'
          />
        )
    }
  }

  const handleFilterChange = (category) => {
    setFilter(category)
    if (category !== "All") {
      toast.success(`Showing ${category} services`, {
        duration: 2000,
        icon: '🔍',
      })
    }
  }

  const handleBookAppointment = (service = null) => {
      toast.loading(`Redirecting to booking for ${service.name}...`, {
    duration: 1500,
  });

    router.push(`/bookingpage/${service._id}`)
  }

  const handleServiceClick = (service) => {
    setSelectedService(service)
    toast(`Viewing ${service.name} details`, {
      duration: 2000,
      icon: '👀',
    })
  }

  // Gradient backgrounds for different categories
  const getCategoryGradient = (category) => {
    switch (category) {
      case "Hair":
        return 'from-purple-500/10 to-pink-500/10'
      case "Skin":
        return 'from-blue-500/10 to-cyan-500/10'
      case "Makeup":
        return 'from-rose-500/10 to-red-500/10'
      case "Nails":
        return 'from-emerald-500/10 to-green-500/10'
      default:
        return 'from-orange-500/10 to-amber-500/10'
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF5F0] to-[#FFE2D6] py-16 px-4 sm:px-6 lg:px-8'>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#413329',
              color: '#FFE2D6',
              border: '1px solid #413329',
            },
          }}
        />
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='inline-block relative'
            >
              <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#8B7355] bg-clip-text text-transparent mb-6'>
                OUR SERVICES
              </h1>
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-[#413329] to-[#8B7355] rounded-full blur-sm'></div>
            </motion.div>
          </div>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.1 }}
                className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20'
              >
                <div className='animate-pulse'>
                  <div className='w-20 h-20 bg-gray-300 rounded-2xl mx-auto mb-6'></div>
                  <div className='space-y-3'>
                    <div className='h-6 bg-gray-300 rounded-full w-3/4 mx-auto'></div>
                    <div className='h-4 bg-gray-300 rounded-full w-1/2 mx-auto'></div>
                    <div className='h-4 bg-gray-300 rounded-full w-full'></div>
                    <div className='h-4 bg-gray-300 rounded-full w-5/6'></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF5F0] to-[#FFE2D6] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <Toaster position="top-right" />
      
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-[#413329]/5 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-[#8B7355]/5 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Section Header */}
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className='inline-block relative'
          >
            <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#8B7355] bg-clip-text text-transparent mb-6'>
              PREMIUM SERVICES
            </h1>
            <motion.div 
              className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-[#413329] to-[#8B7355] rounded-full'
              initial={{ width: 0 }}
              whileInView={{ width: 192 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.div>
          </motion.div>
          
          <motion.p 
            className='text-lg text-[#413329]/80 max-w-2xl mx-auto mt-8'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Experience luxury and transformation with our expertly crafted beauty services
          </motion.p>

          {services.length > 0 && (
            <motion.p 
              className='text-sm text-[#413329]/60 mt-4'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {services.length} premium services • {filteredServices.length} currently showing
            </motion.p>
          )}
        </motion.div>

        {/* Animated Filter Tabs */}
        {services.length > 0 && categories.length > 1 && (
          <motion.div 
            className='flex flex-wrap justify-center gap-4 mb-16'
            variants={filterVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => handleFilterChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border ${
                  filter === category
                    ? 'bg-gradient-to-r from-[#413329] to-[#8B7355] text-white shadow-2xl border-transparent'
                    : 'bg-white/80 text-[#413329] hover:bg-white border-white/30 hover:shadow-lg'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Services Grid */}
        {services.length === 0 && !loading ? (
          <motion.div 
            className='text-center py-20'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20'>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-20 h-20 mx-auto mb-6 text-[#413329]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </motion.div>
              <p className='text-2xl font-bold text-[#413329] mb-4'>Coming Soon</p>
              <p className='text-[#413329]/60 mb-6'>We're preparing something extraordinary for you</p>
            </div>
          </motion.div>
        ) : filteredServices.length === 0 ? (
          <motion.div 
            className='text-center py-20'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20'>
              <p className='text-2xl font-bold text-[#413329] mb-4'>No {filter} Services</p>
              <p className='text-[#413329]/60 mb-6'>Check back soon for new additions</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("All")}
                className='bg-gradient-to-r from-[#413329] to-[#8B7355] text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300'
              >
                View All Services
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  custom={index}
                  onMouseEnter={() => setHoveredCard(service._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className='group relative cursor-pointer'
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Card */}
                  <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20 transition-all duration-500 h-full ${
                    hoveredCard === service._id ? 'shadow-2xl' : ''
                  }`}>
                    
                    {/* Animated Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(service.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    <div className='relative p-8 z-10'>
                      {/* Icon with Floating Animation */}
                      <motion.div 
                        className='w-20 h-20 bg-gradient-to-br from-white to-gray-50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg border border-white/50'
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0] 
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {getServiceIcon(service)}
                      </motion.div>

                      {/* Service Name & Price */}
                      <div className='text-center mb-6'>
                        <h3 className='text-2xl font-bold text-[#413329] mb-2'>{service.name}</h3>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className='inline-block bg-gradient-to-r from-[#413329] to-[#8B7355] text-white px-4 py-1 rounded-full text-sm font-semibold'
                        >
                          {formatPrice(service.price)}
                        </motion.div>
                      </div>

                      {/* Description */}
                      <p className='text-[#413329]/70 text-center mb-6 leading-relaxed'>
                        {service.description}
                      </p>

                      {/* Metadata */}
                      <div className='flex justify-center gap-4 mb-6'>
                        <span className='flex items-center bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-[#413329]/80 border border-white/30'>
                          ⏱️ {formatDuration(service.duration)}
                        </span>
                        <span className='flex items-center bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-[#413329]/80 border border-white/30'>
                          🏷️ {service.category || 'General'}
                        </span>
                      </div>

                      {/* Book Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookAppointment(service)
                        }}
                        className= ' cursor-pointer w-full bg-gradient-to-r from-[#413329] to-[#8B7355] text-white py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 border border-white/20'
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          className='text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className='bg-gradient-to-r from-[#413329] to-[#8B7355] rounded-3xl p-12 text-white shadow-2xl'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Ready for Transformation?</h2>
            <p className='text-white/80 mb-8 max-w-2xl mx-auto'>
              Book your appointment today and experience the luxury you deserve
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBookAppointment()}
              className='bg-white text-[#413329] px-12 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300'
            >
              Book Your Session
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Services