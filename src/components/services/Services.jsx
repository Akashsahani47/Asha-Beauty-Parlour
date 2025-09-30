'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import useUserStore from '@/store/useStore'
import toast, { Toaster } from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("All")

  const { token } = useUserStore()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null) // ✅ Clear any previous errors
        
        const headers = {
          'Content-Type': 'application/json',
        }
        
        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        // Show loading toast
        const loadingToast = toast.loading('Loading services...', {
          duration: 3000,
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getallService`,
          {
            headers,
          }
        )

        // Dismiss loading toast
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
        
        // Handle different response structures
        let servicesData = data.services || data
        
        if (data.success && data.data) {
          servicesData = data.data
        }

        const activeServices = Array.isArray(servicesData) 
          ? servicesData.filter((service) => service.isActive !== false)
          : []
          
        setServices(activeServices)

        // Show success toast
        if (activeServices.length > 0) {
          toast.success(`Loaded ${activeServices.length} services successfully!`, {
            duration: 3000,
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
        
        // Error toast is already shown in the if block above
      } finally {
        setLoading(false)
      }
    }
      
    // Only fetch if we have a token or after a short delay for initial load
    
      fetchServices()
   
  }, [token]) // ✅ Only depend on token

  // Filter services by category
  const filteredServices = filter === "All" 
    ? services 
    : services.filter(service => service.category === filter)

  // Get unique categories for filter
  const categories = ["All", ...new Set(services.map(service => service.category))]

  // Format duration from minutes to readable format
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

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Contact for price'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  // Animation variants
  const itemVariants = {
    hidden: (index) => ({
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  // Function to get appropriate icon based on service category
  const getServiceIcon = (service) => {
    // If service has an image URL, use it
    if (service.image) {
      return (
        <img
          src={service.image}
          alt={service.name}
          width={40}
          height={40}
          className='object-contain'
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none'
          }}
        />
      )
    }

    // Fallback to category-based icons
    switch (service.category) {
      case "Hair":
        return (
          <Image
            src="/haircut.png"
            alt="Hair Services"
            width={40}
            height={40}
            className='object-contain'
          />
        )
      case "Skin":
        return (
          <Image
            src="/facialmassage.png"
            alt="Skin Treatments"
            width={40}
            height={40}
            className='object-contain'
          />
        )
      case "Makeup":
        return (
          <Image
            src="/makeup.png"
            alt="Makeup Services"
            width={40}
            height={40}
            className='object-contain'
          />
        )
      case "Nails":
        return (
          <Image
            src="/eyebrows.png"
            alt="Nail Services"
            width={40}
            height={40}
            className='object-contain'
          />
        )
      default:
        return (
          <Image
            src="/makeup.png"
            alt="Service"
            width={40}
            height={40}
            className='object-contain'
          />
        )
    }
  }

  // Retry fetching services
  const retryFetch = () => {
    setError(null)
    setLoading(true)
    toast.loading('Retrying to load services...', {
      duration: 2000,
    })
  }

  // Handle filter change with toast
  const handleFilterChange = (category) => {
    setFilter(category)
    if (category !== "All") {
      toast.success(`Showing ${category} services`, {
        duration: 2000,
        icon: '🔍',
      })
    } else {
      toast.success('Showing all services', {
        duration: 2000,
        icon: '📋',
      })
    }
  }

  // Handle book appointment
  const handleBookAppointment = () => {
    toast.loading('Redirecting to booking...', {
      duration: 1500,
    })
    
    setTimeout(() => {
      // You can replace this with your actual booking logic
      toast.success('Ready to book your appointment!', {
        duration: 3000,
        icon: '📅',
      })
      // window.location.href = '/booking' // Uncomment when you have booking page
    }, 1500)
  }

  // Handle service click
  const handleServiceClick = (serviceName) => {
    toast(`Viewing ${serviceName} details`, {
      duration: 2000,
      icon: '👀',
    })
  }

  // ✅ Check if we should show success content (services loaded and no error)
  const shouldShowSuccess = services.length > 0 && !loading && !error

  if (loading) {
    return (
      <div className='bg-[#FFE2D6] min-h-screen py-16 px-4 sm:px-6 lg:px-8'>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#413329',
              color: '#FFE2D6',
              border: '1px solid #413329',
            },
            success: {
              style: {
                background: '#4ade80',
                color: '#1a1a1a',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
            loading: {
              style: {
                background: '#f59e0b',
                color: '#1a1a1a',
              },
            },
          }}
        />
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-block relative'>
              <h1 className='text-4xl md:text-5xl font-bold text-[#413329] mb-4 relative z-10'>OUR SERVICES</h1>
              <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-[#413329]/20 z-0'></div>
            </div>
            <p className='text-lg text-[#413329]/80 max-w-2xl mx-auto mt-6'>
              {token ? 'Loading our premium services...' : 'Checking authentication...'}
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='bg-white rounded-2xl shadow-lg p-8 animate-pulse'>
                <div className='flex flex-col md:flex-row items-center'>
                  <div className='w-20 h-20 bg-gray-300 rounded-full mb-4 md:mb-0 md:mr-6'></div>
                  <div className='flex-1 space-y-3'>
                    <div className='h-6 bg-gray-300 rounded w-3/4'></div>
                    <div className='h-4 bg-gray-300 rounded w-12'></div>
                    <div className='h-4 bg-gray-300 rounded w-full'></div>
                    <div className='h-4 bg-gray-300 rounded w-5/6'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && services.length === 0) {
  return (
    <div className='bg-[#FFE2D6] min-h-screen py-16 px-4 sm:px-6 lg:px-8'>
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
      <div className='max-w-7xl mx-auto text-center'>
        <div className='inline-block relative mb-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-[#413329] mb-4 relative z-10'>OUR SERVICES</h1>
          <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-[#413329]/20 z-0'></div>
        </div>
        <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto'>
          <div className='text-red-600 mb-4'>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className='text-[#413329] text-lg mb-2'>Authentication Required</p>
            <p className='text-[#413329]/70 text-sm mb-4'>Please login to access our services</p>
          </div>
          <div className='flex gap-4 justify-center'>
            <button 
              onClick={() => {
                toast.loading('Redirecting to login...', { duration: 1000 })
                setTimeout(() => window.location.href = '/login', 1000)
              }}
              className='bg-[#FF6B6B] text-white px-6 py-2 rounded-full hover:bg-[#FF8E8E] transition-all duration-300'
            >
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

  // ✅ Show success content when services are loaded
  return (
    <div className='bg-[#FFE2D6] min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#413329',
            color: '#FFE2D6',
            border: '1px solid #413329',
          },
          success: {
            style: {
              background: '#4ade80',
              color: '#1a1a1a',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
          loading: {
            style: {
              background: '#f59e0b',
              color: '#1a1a1a',
            },
          },
        }}
      />
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div 
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "0px" }}
        >
          <div className='inline-block relative'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#413329] mb-4 relative z-10'>OUR SERVICES</h1>
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-[#413329]/20 z-0'></div>
          </div>
          <p className='text-lg text-[#413329]/80 max-w-2xl mx-auto mt-6'>
            Discover our comprehensive range of premium beauty services designed to enhance your natural radiance.
          </p>
          {services.length > 0 && (
            <p className='text-sm text-[#413329]/60 mt-2'>
              {services.length} services available • {filteredServices.length} showing
            </p>
          )}
        </motion.div>

        {/* Category Filter */}
        {services.length > 0 && categories.length > 1 && (
          <motion.div 
            className='flex flex-wrap justify-center gap-3 mb-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "0px" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-[#413329] text-[#FFE2D6] shadow-lg'
                    : 'bg-white text-[#413329] hover:bg-[#413329] hover:text-[#FFE2D6]'
                } border border-[#413329]/20`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Services List */}
        {services.length === 0 && !loading ? (
          <div className='text-center py-12'>
            <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto'>
              <svg className="w-16 h-16 mx-auto mb-4 text-[#413329]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className='text-[#413329] text-lg mb-2'>No services available</p>
              <p className='text-[#413329]/60'>Please check back later for updates</p>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className='text-center py-12'>
            <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto'>
              <p className='text-[#413329] text-lg mb-4'>No services found in {filter} category</p>
              <button 
                onClick={() => handleFilterChange("All")}
                className='bg-[#413329] text-[#FFE2D6] px-6 py-2 rounded-full hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] transition-all duration-300'
              >
                Show All Services
              </button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 overflow-visible'>
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service._id} 
                className='group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer'
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px" }}
                onClick={() => handleServiceClick(service.name)}
              >
                {/* Background Pattern */}
                <div className='absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#413329]/5 rounded-bl-full z-0'></div>
                
                <div className='relative flex flex-col md:flex-row items-center p-6 md:p-8 z-10'>
                  {/* Service Image/Icon */}
                  <div className='w-20 h-20 md:w-24 md:h-24 bg-[#FFE2D6] rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0'>
                    {getServiceIcon(service)}
                  </div>
                  
                  {/* Service Content */}
                  <div className='flex-1 text-center md:text-left'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-2'>
                      <h2 className='text-xl md:text-2xl font-bold text-[#413329]'>{service.name}</h2>
                      <span className='text-lg font-semibold text-[#413329] mt-1 md:mt-0'>
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    
                    <div className='w-12 h-1 bg-[#413329] mb-3 mx-auto md:mx-0'></div>
                    
                    <p className='text-[#413329]/80 text-sm md:text-base mb-4'>
                      {service.description}
                    </p>
                    
                    {/* Service Metadata */}
                    <div className='flex flex-wrap gap-4 justify-center md:justify-start text-sm text-[#413329]/70'>
                      <span className='flex items-center bg-[#FFE2D6] px-3 py-1 rounded-full'>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {formatDuration(service.duration)}
                      </span>
                      
                      <span className='flex items-center bg-[#FFE2D6] px-3 py-1 rounded-full'>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {service.category || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className='absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#413329]/20 transition-all duration-300 pointer-events-none'></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div 
          className='text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "0px" }}
        >
          <button 
            onClick={handleBookAppointment}
            className='relative bg-[#413329] text-[#FFE2D6] px-8 py-3 md:px-10 md:py-4 rounded-full font-medium overflow-hidden group transition-all duration-300 hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] hover:shadow-2xl'
          >
            <span className='relative z-10'>Book Appointment</span>
            <div className='absolute inset-0 bg-[#FFE2D6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0'></div>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Services