'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      text: '"Loved the tape-in extensions! They look so natural and blend perfectly with my hair."',
      author: "somaya kumari",
      service: "Hair Extensions",
      rating: 5
    },
    {
      id: 2,
      text: '"The micro-link extensions are a game-changer! I feel like a new person with the added length and volume."',
      author: "Anjali singh",
      service: "Micro-link Extensions",
      rating: 5
    },
    {
      id: 3,
      text: '"The team at this salon is incredible! They understood exactly what I wanted and delivered beyond my expectations."',
      author: "Priya Sharma",
      service: "Complete Makeover",
      rating: 4
    },
    {
      id: 4,
      text: '"Best facial I\'ve ever had! My skin has never felt so refreshed and rejuvenated."',
      author: "kriti sahani",
      service: "Luxury Facial",
      rating: 5
    }
  ]

  // Counter component
  const Counter = ({ value, suffix = "", duration = 2 }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      let start = 0
      const end = parseInt(value.toString().replace(/\D/g, ""))
      if (start === end) return
      
      let totalMilSecDur = duration * 1000
      let incrementTime = (totalMilSecDur / end) * 1000
      
      // Faster counting at the beginning, slower at the end
      const timer = setInterval(() => {
        start += Math.ceil(end / 30) // Adjust division value for speed
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, incrementTime / 10) // Adjust division value for smoothness
      
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

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
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
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <motion.div 
      className='bg-[#FFE2D6] py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden' 
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
        {/* Header - Different for mobile and desktop */}
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
            <p className='text-[#413329]/70 mb-6'>
              What our clients say about us
            </p>
          </motion.div>
          
          {/* Desktop Header */}
          <motion.div className='hidden md:block md:w-1/2' variants={itemVariants}>
            <h1 className='text-5xl md:text-6xl font-bold text-[#413329] mb-4 leading-tight'>
              Voices of <span className='italic'>Beauty</span>
            </h1>
            <div className='w-20 h-1 bg-[#413329] mb-4'></div>
            <p className='text-lg text-[#413329]/70'>
              Real stories from our cherished clients who experienced the magic of our salon
            </p>
          </motion.div>
          
          {/* Rating Circle - Hidden on mobile */}
          <motion.div 
            className='hidden md:flex md:w-1/2 md:justify-end'
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className='relative'>
              <div className='w-48 h-48 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] text-6xl font-bold rotate-12'>
                <Counter value={4} duration={0.01} />
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
                  <div className='flex justify-center'>{renderStars(4)}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Carousel */}
        <div className='md:hidden relative'>
          <AnimatePresence mode='wait' custom={activeIndex}>
            <motion.div
              key={activeIndex}
              custom={activeIndex}
              variants={carouselVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className='bg-white rounded-2xl p-6 shadow-lg mx-auto max-w-md'
            >
              <div className='flex justify-center mb-4'>
                <div className='flex gap-1 text-lg'>
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              </div>
              
              <div className='text-3xl text-[#413329]/30 text-center mb-3'>"</div>
              
              <p className='text-[#413329] text-center italic mb-6 leading-relaxed'>
                {testimonials[activeIndex].text}
              </p>
              
              <div className='text-center'>
                <div className='font-bold text-[#413329]'>{testimonials[activeIndex].author}</div>
                <div className='text-[#413329]/60 text-sm'>{testimonials[activeIndex].service}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <motion.div 
            className='flex justify-center gap-2 mt-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? 'bg-[#413329] w-6' : 'bg-[#413329]/30'
                }`}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          <motion.button 
            onClick={prevTestimonial}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-10 h-10 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] shadow-md'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ←
          </motion.button>
          
          <motion.button 
            onClick={nextTestimonial}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 w-10 h-10 bg-[#413329] rounded-full flex items-center justify-center text-[#FFE2D6] shadow-md'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            →
          </motion.button>
        </div>

        {/* Desktop Testimonials Grid */}
        <motion.div 
          className='hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-16'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Large Featured Testimonial */}
          <motion.div 
            className='lg:col-span-2 bg-[#413329] rounded-3xl p-8 md:p-12 text-[#FFE2D6] relative overflow-hidden'
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className='absolute top-0 right-0 w-32 h-32 bg-[#FFE2D6]/10 rounded-bl-full'></div>
            <div className='relative z-10'>
              <div className='text-4xl mb-2'>"</div>
              <p className='text-xl md:text-2xl italic mb-6 leading-relaxed'>
                This salon transformed not just my look but my confidence. Every visit feels like a luxury experience worth every penny.
              </p>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-[#FFE2D6] rounded-full flex items-center justify-center text-[#413329] font-bold text-xl'>
                  RJ
                </div>
                <div>
                  <div className='font-bold text-lg'>Riya Joshi</div>
                  <div className='text-[#FFE2D6]/70'>Regular Client</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Regular Testimonials */}
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id} 
              className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden ${index === 1 ? 'lg:mt-12' : ''}`}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Decorative Corner */}
              <div className='absolute top-0 right-0 w-16 h-16 bg-[#413329]/5 rounded-bl-full'></div>
              
              {/* Rating Stars */}
              <div className='flex gap-1 text-lg mb-4'>
                {renderStars(testimonial.rating)}
              </div>
              
              <p className='text-[#413329] italic mb-6 text-lg leading-relaxed'>
                {testimonial.text}
              </p>
              
              <div className='border-t border-[#413329]/10 pt-4'>
                <div className='font-bold text-[#413329]'>{testimonial.author}</div>
                <div className='text-[#413329]/60 text-sm'>{testimonial.service}</div>
              </div>

              {/* Unique decorative element for each card */}
              <div className={`absolute bottom-4 ${index % 2 === 0 ? 'left-4' : 'right-4'} text-[#413329]/10 text-6xl font-bold`}>
                {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section - Mobile Only */}
        <motion.div 
          className='md:hidden grid grid-cols-3 gap-4 mt-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className='text-center'>
            <div className='text-2xl font-bold text-[#413329]'>
              <Counter value={500} suffix="+" duration={0.1} />
            </div>
            <div className='text-[#413329]/60 text-sm'>Happy Clients</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-[#413329]'>
              <Counter value={4} duration={0.001} />
            </div>
            <div className='text-[#413329]/60 text-sm'>Average Rating</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-[#413329]'>
              <Counter value={98} suffix="%" duration={0.01} />
            </div>
            <div className='text-[#413329]/60 text-sm'>Would Recommend</div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className='text-center mt-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className='inline-flex flex-col items-center relative'>
            <motion.button 
              className='bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='relative z-10'>Share Your Experience</span>
              <div className='absolute inset-0 bg-[#FFE2D6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Testimonials
