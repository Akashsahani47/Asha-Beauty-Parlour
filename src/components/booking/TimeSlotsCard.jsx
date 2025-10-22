'use client'
import { motion, AnimatePresence } from 'framer-motion'

const TimeSlotsCard = ({ 
  selectedDate, 
  selectedTime, 
  handleTimeSelect, 
  availableTimeSlots, 
  checkingAvailability, 
  formatDisplayDate 
}) => {
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

  if (!selectedDate) return null

  return (
    <AnimatePresence>
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
            variants={itemVariants}
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
    </AnimatePresence>
  )
}

export default TimeSlotsCard