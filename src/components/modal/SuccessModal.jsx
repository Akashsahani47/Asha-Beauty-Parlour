'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const SuccessModal = ({ isOpen, onClose, serviceName, bookingDetails }) => {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (isOpen) {
      setCountdown(10)
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleRedirect()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  const handleRedirect = () => {
    onClose()
    setTimeout(() => {
      router.push('/')
    }, 500)
  }

  const handleClose = () => {
    onClose()
    router.push('/')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={handleClose} />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full relative mx-2 border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                delay: 0.1 
              }}
              className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 
                }}
                className="w-10 h-10 md:w-12 md:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-2">
                Your <span className="font-semibold text-gray-900">{serviceName}</span> appointment has been successfully booked.
              </p>
              {bookingDetails && (
                <div className="bg-gray-50 rounded-2xl p-4 mt-4 border border-gray-200">
                  <div className="text-sm text-gray-600 space-y-1">
                    {bookingDetails.date && (
                      <p>📅 <span className="font-medium">{bookingDetails.date}</span></p>
                    )}
                    {bookingDetails.time && (
                      <p>⏰ <span className="font-medium">{bookingDetails.time}</span></p>
                    )}
                    {bookingDetails.phone && (
                      <p>📱 <span className="font-medium">{bookingDetails.phone}</span></p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-3 bg-blue-50 rounded-2xl px-4 py-3 border border-blue-200">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm"
                >
                  {countdown}
                </motion.div>
                <span className="text-blue-700 text-sm font-medium">
                  Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-3"
            >
              <button
                onClick={handleClose}
                className="flex-1 py-3 cursor-pointer bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-green-400 transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                Go Home Now
              </button>
              {/* <button
                onClick={handleClose}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Details
              </button> */}
            </motion.div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: '50%',
                    y: '50%'
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `calc(50% + ${Math.random() * 200 - 100}px)`,
                    y: `calc(50% + ${Math.random() * 200 - 100}px)`
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal