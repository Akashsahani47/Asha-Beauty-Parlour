'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: '📱',
      title: 'Phone',
      details: '+91 98765 43210',
      description: 'Mon-Sun, 9:00 AM - 8:00 PM',
      link: 'tel:+919876543210'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: 'hello@ashabeauty.com',
      description: 'We reply within 24 hours',
      link: 'mailto:hello@ashabeauty.com'
    },
    {
      icon: '📍',
      title: 'Address',
      details: '123 Beauty Street, Sector 45',
      description: 'Gurugram, Haryana - 122001',
      link: 'https://maps.google.com'
    },
    {
      icon: '🕒',
      title: 'Working Hours',
      details: '9:00 AM - 8:00 PM',
      description: 'Open all days including Sundays',
      link: null
    }
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: '📷',
      handle: '@asha_beauty',
      link: 'https://instagram.com',
      color: 'from-pink-500 to-purple-600'
    },
    {
      name: 'Facebook',
      icon: '👥',
      handle: 'Asha Beauty Parlour',
      link: 'https://facebook.com',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      handle: '+91 98765 43210',
      link: 'https://wa.me/919876543210',
      color: 'from-green-500 to-green-700'
    }
  ]

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
              Get In Touch
            </h1>
            <motion.div 
              className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full opacity-50'
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className='text-lg md:text-xl text-[#2A2118]/70 max-w-2xl mx-auto mt-6'
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'
        >
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            className='lg:col-span-1 space-y-6'
          >
            {/* Contact Info Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20'
            >
              <motion.h2 
                className='text-2xl md:text-3xl font-bold text-[#2A2118] mb-6 flex items-center'
                variants={itemVariants}
              >
                <span className="mr-3 text-2xl">💫</span>
                Contact Info
              </motion.h2>

              <div className='space-y-4'>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-2xl bg-gradient-to-r from-white to-[#FAF3EB] border border-white/30 hover:border-[#2A2118]/20 transition-all duration-300 ${
                      info.link ? 'cursor-pointer hover:shadow-lg' : ''
                    }`}
                    onClick={() => info.link && window.open(info.link, '_blank')}
                  >
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-[#2A2118] to-[#5D4C38] rounded-2xl flex items-center justify-center text-white text-lg flex-shrink-0'>
                        {info.icon}
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-bold text-[#2A2118] text-lg'>{info.title}</h3>
                        <p className='text-[#2A2118] font-semibold mt-1'>{info.details}</p>
                        <p className='text-[#2A2118]/60 text-sm mt-1'>{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Links Card */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20'
            >
              <motion.h2 
                className='text-2xl md:text-3xl font-bold text-[#2A2118] mb-6 flex items-center'
                variants={itemVariants}
              >
                <span className="mr-3 text-2xl">🌐</span>
                Follow Us
              </motion.h2>

              <div className='space-y-4'>
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`block p-4 rounded-2xl text-white ${social.color} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-2xl group-hover:scale-110 transition-transform duration-300'>
                          {social.icon}
                        </span>
                        <div>
                          <h3 className='font-bold text-white'>{social.name}</h3>
                          <p className='text-white/80 text-sm'>{social.handle}</p>
                        </div>
                      </div>
                      <motion.span 
                        className='opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300'
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            className='lg:col-span-2'
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20 h-full'
            >
              <motion.h2 
                className='text-2xl md:text-3xl font-bold text-[#2A2118] mb-2 flex items-center'
                variants={itemVariants}
              >
                <span className="mr-3 text-2xl">✍️</span>
                Send Message
              </motion.h2>
              <motion.p 
                className='text-[#2A2118]/70 mb-8 text-lg'
                variants={itemVariants}
              >
                Fill out the form below and we'll get back to you shortly.
              </motion.p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <motion.div variants={itemVariants}>
                    <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                      Full Name *
                    </label>
                    <motion.input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      whileFocus={{ scale: 1.02 }}
                      className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40'
                      placeholder='Enter your full name'
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                      Email Address *
                    </label>
                    <motion.input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      whileFocus={{ scale: 1.02 }}
                      className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40'
                      placeholder='your@email.com'
                    />
                  </motion.div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <motion.div variants={itemVariants}>
                    <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                      Phone Number
                    </label>
                    <motion.input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      whileFocus={{ scale: 1.02 }}
                      className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40'
                      placeholder='+91 98765 43210'
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                      Subject *
                    </label>
                    <motion.input
                      type='text'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      whileFocus={{ scale: 1.02 }}
                      className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40'
                      placeholder='What is this regarding?'
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className='block text-[#2A2118] font-semibold mb-3 text-lg'>
                    Message *
                  </label>
                  <motion.textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    whileFocus={{ scale: 1.02 }}
                    className='w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 border-[#2A2118]/20 bg-white/50 focus:outline-none focus:border-[#2A2118]/40 focus:ring-4 focus:ring-[#2A2118]/10 transition-all duration-300 text-lg placeholder:text-[#2A2118]/40 resize-none'
                    placeholder='Tell us how we can help you...'
                  />
                </motion.div>

                <motion.button
                  type='submit'
                  disabled={loading}
                  variants={itemVariants}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className={`w-full py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 relative overflow-hidden ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white cursor-pointer shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <motion.div 
                      className='flex items-center justify-center'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div 
                        className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3'
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      ></motion.div>
                      Sending Message...
                    </motion.div>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='mt-12'
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-white/20 overflow-hidden'
          >
            <div className='flex flex-col lg:flex-row items-start gap-8'>
              <div className='lg:w-1/3'>
                <motion.h2 
                  className='text-2xl md:text-3xl font-bold text-[#2A2118] mb-4 flex items-center'
                  variants={itemVariants}
                >
                  <span className="mr-3 text-2xl">🗺️</span>
                  Visit Our Salon
                </motion.h2>
                <motion.p 
                  className='text-[#2A2118]/70 text-lg mb-6'
                  variants={itemVariants}
                >
                  Come experience luxury and relaxation at our beautifully designed salon space.
                </motion.p>
                
                <motion.div 
                  className='space-y-4'
                  variants={containerVariants}
                >
                  <motion.div 
                    className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-[#FAF3EB] border border-white/30'
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <div className='w-12 h-12 bg-gradient-to-br from-[#2A2118] to-[#5D4C38] rounded-2xl flex items-center justify-center text-white text-lg'>
                      🚗
                    </div>
                    <div>
                      <h3 className='font-bold text-[#2A2118]'>Parking Available</h3>
                      <p className='text-[#2A2118]/60 text-sm'>Free valet parking service</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className='flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-white to-[#FAF3EB] border border-white/30'
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <div className='w-12 h-12 bg-gradient-to-br from-[#2A2118] to-[#5D4C38] rounded-2xl flex items-center justify-center text-white text-lg'>
                      ♿
                    </div>
                    <div>
                      <h3 className='font-bold text-[#2A2118]'>Accessible</h3>
                      <p className='text-[#2A2118]/60 text-sm'>Wheelchair friendly</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className='lg:w-2/3 w-full'>
                <motion.div
                  variants={itemVariants}
                  className='bg-gradient-to-br from-[#2A2118] to-[#5D4C38] rounded-2xl p-1'
                >
                  <div className='w-full h-64 md:h-80 bg-gradient-to-br from-[#FAF3EB] to-[#FFF9F5] rounded-xl flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='text-4xl mb-4'>📍</div>
                      <p className='text-[#2A2118] font-semibold'>Interactive Map</p>
                      <p className='text-[#2A2118]/60 text-sm mt-2'>123 Beauty Street, Sector 45, Gurugram</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='mt-4 px-6 py-2 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white rounded-xl font-semibold'
                      >
                        Open in Maps
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactPage