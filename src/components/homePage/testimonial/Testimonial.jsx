'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestimonialForm from './TestimonialForm'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [displayTestimonials, setDisplayTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  // Fetch testimonials from API
  useEffect(() => {
    fetchTestimonials()
  }, [])

  // Select 4 random testimonials when testimonials change
  useEffect(() => {
    if (testimonials.length > 0) {
      selectRandomTestimonials()
    }
  }, [testimonials])

  const selectRandomTestimonials = () => {
    if (testimonials.length <= 4) {
      setDisplayTestimonials(testimonials)
    } else {
      // Select 4 random testimonials
      const shuffled = [...testimonials].sort(() => 0.5 - Math.random())
      setDisplayTestimonials(shuffled.slice(0, 4))
    }
  }

  const fetchTestimonials = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching testimonials...')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonial/show`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched testimonials:', data)
      
      // Handle both array response and object with testimonials property
      let testimonialsData = []
      if (Array.isArray(data)) {
        testimonialsData = data
      } else if (data.testimonials && Array.isArray(data.testimonials)) {
        testimonialsData = data.testimonials
      } else if (data.data && Array.isArray(data.data)) {
        testimonialsData = data.data
      }
      
      console.log('Processed testimonials:', testimonialsData)
      setTestimonials(testimonialsData)
      
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      console.log('Using fallback testimonials')
      setTestimonials(fallbackTestimonials)
    } finally {
      setIsLoading(false)
    }
  }

  const fallbackTestimonials = [
    {
      _id: 1,
      clientName: "Somaya Kumari",
      feedback: '"Loved the tape-in extensions! They look so natural and blend perfectly with my hair."',
      service: "HairStyling",
      rating: 5
    },
    {
      _id: 2,
      clientName: "Anjali Singh",
      feedback: '"The micro-link extensions are a game-changer! I feel like a new person with the added length and volume."',
      service: "HairStyling",
      rating: 5
    },
    {
      _id: 3,
      clientName: "Priya Sharma",
      feedback: '"The team at this salon is incredible! They understood exactly what I wanted and delivered beyond my expectations."',
      service: "Makeup",
      rating: 4
    },
    {
      _id: 4,
      clientName: "Kriti Sahani",
      feedback: '"Best facial I\'ve ever had! My skin has never felt so refreshed and rejuvenated."',
      service: "Facial",
      rating: 5
    },
    {
      _id: 5,
      clientName: "Neha Patel",
      feedback: '"Amazing hair coloring service! The color turned out exactly as I wanted."',
      service: "Haircut",
      rating: 5
    },
    {
      _id: 6,
      clientName: "Sneha Reddy",
      feedback: '"Professional eyebrow shaping service. Will definitely come back!"',
      service: "Eyebrow",
      rating: 4
    }
  ]

  const handleSubmitTestimonial = async (formData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonial/createtestimonial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit testimonial')
      }

      // Refresh testimonials after successful submission
      await fetchTestimonials()
      return await response.json()
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      throw error
    }
  }

  const nextTestimonial = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  const goToTestimonial = (index) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  // Counter component
  const Counter = ({ value, suffix = "", duration = 2 }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      let start = 0
      const end = parseInt(value.toString().replace(/\D/g, ""))
      if (start === end) return
      
      let totalMilSecDur = duration * 1000
      let incrementTime = (totalMilSecDur / end) * 1000
      
      const timer = setInterval(() => {
        start += Math.ceil(end / 30)
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, incrementTime / 10)
      
      return () => clearInterval(timer)
    }, [value, duration])
    
    return <span>{count}{suffix}</span>
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <motion.span 
        key={i} 
        className={i < rating ? "text-amber-400" : "text-gray-300"}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1, duration: 0.3 }}
      >
        ★
      </motion.span>
    ))
  }

  const getServiceDisplayName = (service) => {
    const displayNames = {
      'HairStyling': 'Hair Styling',
      'Eyebrow': 'Eyebrow Service',
      'Skin': 'Skin Care',
      'Makeup': 'Makeup',
      'Nails': 'Nail Service',
      'Haircut': 'Haircut',
      'Facial': 'Facial',
      'Other': 'Other Service'
    }
    return displayNames[service] || service
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const carouselVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -8,
      transition: { type: "spring", stiffness: 300 }
    }
  }

  return (
    <>
      <motion.div 
        className='bg-[#FDBD99] py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden' 
        id="testimonials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background Elements */}
        <motion.div 
          className='hidden md:block absolute top-0 left-0 w-72 h-72 bg-[#413329]/5 rounded-full -translate-x-1/2 -translate-y-1/2'
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        ></motion.div>
        <motion.div 
          className='hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-[#413329]/5 rounded-full translate-x-1/3 translate-y-1/3'
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        ></motion.div>
        
        <div className='max-w-7xl mx-auto relative z-10'>
          {/* Header */}
          <motion.div 
            className='text-center md:flex md:flex-row md:items-center md:justify-between mb-8 md:mb-16 gap-8'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Mobile Header */}
            <motion.div className='md:hidden' variants={itemVariants}>
              <h1 className='text-3xl font-bold text-[#413329] mb-2'>Client Love</h1>
              <div className='w-16 h-1 bg-[#413329] mx-auto mb-3'></div>
              <p className='text-[#413329]/70 mb-6 px-4'>
                What our clients say about us
              </p>
            </motion.div>
            
            {/* Desktop Header */}
            <motion.div className='hidden md:block md:w-1/2' variants={itemVariants}>
              <h1 className='text-5xl md:text-6xl font-bold text-[#413329] mb-4 leading-tight'>
                Voices of <span className='italic'>Beauty</span>
              </h1>
              <div className='w-20 h-1 bg-[#413329] mb-4'></div>
              <p className='text-lg text-[#413329]/70 max-w-lg'>
                Real stories from our cherished clients who experienced the magic of our salon
              </p>
            </motion.div>
            
            {/* Rating Circle */}
            <motion.div 
              className='hidden md:flex md:w-1/2 md:justify-end'
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className='relative'>
                <div className='w-48 h-48 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] text-6xl font-bold rotate-12'>
                  <Counter value={4.9} duration={0.01} />
                </div>
                <motion.div 
                  className='absolute -bottom-4 -right-4 bg-[#FFE2D6] border-4 border-[#413329] rounded-2xl px-4 py-2 shadow-lg'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className='text-[#413329] font-bold text-center'>
                    <div className='text-sm'>Average Rating</div>
                    <div className='flex justify-center'>{renderStars(5)}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center mb-4">
             
            </div>
          )}

          {/* Mobile Carousel */}
          <div className='md:hidden relative mb-12'>
            {isLoading ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg mx-auto max-w-md min-h-[280px] flex items-center justify-center">
                <div className="text-[#413329]">Loading testimonials...</div>
              </div>
            ) : displayTestimonials.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg mx-auto max-w-md min-h-[280px] flex items-center justify-center">
                <div className="text-[#413329] text-center">
                  <p>No testimonials yet</p>
                  <p className="text-sm text-[#413329]/70 mt-2">Be the first to share your experience!</p>
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence mode='wait' custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={carouselVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                    className='bg-white rounded-2xl p-6 shadow-lg mx-auto max-w-md min-h-[280px] flex flex-col justify-center'
                  >
                    {displayTestimonials[activeIndex] && (
                      <>
                        <div className='flex justify-center mb-4'>
                          <div className='flex gap-1 text-lg'>
                            {renderStars(displayTestimonials[activeIndex].rating)}
                          </div>
                        </div>
                        
                        <div className='text-3xl text-[#413329]/30 text-center mb-3'>"</div>
                        
                        <p className='text-[#413329] text-center italic mb-6 leading-relaxed text-base'>
                          {displayTestimonials[activeIndex].feedback}
                        </p>
                        
                        <div className='text-center mt-auto'>
                          <div className='font-bold text-[#413329]'>{displayTestimonials[activeIndex].clientName}</div>
                          <div className='text-[#413329]/60 text-sm'>
                            {getServiceDisplayName(displayTestimonials[activeIndex].service)}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Dots */}
                {displayTestimonials.length > 1 && (
                  <motion.div 
                    className='flex justify-center gap-2 mt-6'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {displayTestimonials.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeIndex ? 'bg-[#413329] w-6' : 'bg-[#413329]/30'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Navigation Arrows */}
                {displayTestimonials.length > 1 && (
                  <>
                    <motion.button 
                      onClick={prevTestimonial}
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] shadow-md'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ←
                    </motion.button>
                    
                    <motion.button 
                      onClick={nextTestimonial}
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] shadow-md'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      →
                    </motion.button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Desktop Testimonials Grid */}
          <motion.div 
            className='hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isLoading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg h-64 animate-pulse">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-6 h-6 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : displayTestimonials.length === 0 ? (
              // Empty state
              <div className="col-span-2 bg-white rounded-2xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">💫</div>
                <h3 className="text-2xl font-bold text-[#413329] mb-2">No Testimonials Yet</h3>
                <p className="text-[#413329]/70 mb-6">Be the first to share your experience with us!</p>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-[#413329] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a211a] transition-colors"
                >
                  Share Your Story
                </button>
              </div>
            ) : (
              displayTestimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial._id || testimonial.id} 
                  className='bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden h-full flex flex-col'
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                >
                  {/* Decorative Corner */}
                  <div className='absolute top-0 right-0 w-16 h-16 bg-[#413329]/5 rounded-bl-full'></div>
                  
                  {/* Rating Stars */}
                  <div className='flex gap-1 text-lg mb-4'>
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <p className='text-[#413329] italic mb-6 text-lg leading-relaxed flex-grow'>
                    {testimonial.feedback}
                  </p>
                  
                  <div className='border-t border-[#413329]/10 pt-4 mt-auto'>
                    <div className='font-bold text-[#413329]'>{testimonial.clientName}</div>
                    <div className='text-[#413329]/60 text-sm'>
                      {getServiceDisplayName(testimonial.service)}
                    </div>
                  </div>

                  {/* Unique decorative element for each card */}
                  <div className={`absolute bottom-4 ${index % 2 === 0 ? 'left-4' : 'right-4'} text-[#413329]/10 text-6xl font-bold`}>
                    {index + 1}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className='grid grid-cols-3 gap-4 mt-8 md:mt-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-[#413329]'>
                <Counter value={testimonials.length > 0 ? testimonials.length + 497 : 500} suffix="+" duration={2} />
              </div>
              <div className='text-[#413329]/60 text-sm md:text-base'>Happy Clients</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-[#413329]'>
                <Counter value={4.9} duration={2} />
              </div>
              <div className='text-[#413329]/60 text-sm md:text-base'>Average Rating</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl md:text-3xl font-bold text-[#413329]'>
                <Counter value={98} suffix="%" duration={2} />
              </div>
              <div className='text-[#413329]/60 text-sm md:text-base'>Would Recommend</div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className='text-center mt-8 md:mt-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className='inline-flex flex-col items-center relative'>
              <motion.button 
                onClick={() => setIsFormOpen(true)}
                className='bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='relative z-10'>Share Your Experience</span>
                <div className='absolute inset-0 bg-[#FFE2D6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
              </motion.button>
              <p className='text-[#413329]/60 text-sm mt-3 max-w-md'>
                Join our community of satisfied clients and share your beauty journey with us
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Testimonial Form Modal */}
      <TestimonialForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitTestimonial}
      />
    </>
  )
}

export default Testimonials