'use client'
import { motion } from 'framer-motion'

const ContactInfoCard = ({ userPhone, setUserPhone }) => {
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      boxShadow: "0 25px 50px rgba(65, 51, 41, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  return (
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
  )
}

export default ContactInfoCard