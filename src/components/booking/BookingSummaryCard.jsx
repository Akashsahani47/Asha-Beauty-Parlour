'use client'
import { motion } from 'framer-motion'

const BookingSummaryCard = ({
  service,
  selectedDate,
  selectedTime,
  userPhone,
  submitting,
  availableTimeSlots,
  checkingAvailability,
  handleMakePayment,
  formatDisplayDate
}) => {
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
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

  const isPaymentDisabled = !selectedDate || !selectedTime || !userPhone || submitting || availableTimeSlots.length === 0 || checkingAvailability

  return (
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
        disabled={isPaymentDisabled}
        whileHover={!isPaymentDisabled ? { scale: 1.02 } : {}}
        whileTap={!isPaymentDisabled ? { scale: 0.98 } : {}}
        className={`w-full py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 relative overflow-hidden ${
          !isPaymentDisabled
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
  )
}

export default BookingSummaryCard