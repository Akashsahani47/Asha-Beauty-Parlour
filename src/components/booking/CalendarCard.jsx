'use client'
import { motion } from 'framer-motion'

const CalendarCard = ({ 
  currentMonth, 
  navigateMonth, 
  selectedDate, 
  handleDateSelect, 
  getDaysInMonth, 
  isPastDate, 
  isSameDay, 
  isToday 
}) => {
  const calendarDays = getDaysInMonth(currentMonth)
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
      className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 md:p-6 border border-white/20 mx-2 md:mx-0'
    >
      <motion.div 
        className='flex items-center justify-between mb-4 md:mb-6'
        variants={itemVariants}
      >
        <h3 className='text-lg md:text-xl font-bold text-[#2A2118] flex items-center'>
          <span className="mr-2 text-lg md:text-xl">📅</span>
          Select Date
        </h3>
        <div className='flex space-x-2'>
          <motion.button
            onClick={() => navigateMonth(-1)}
            whileHover={{ scale: 1.1, backgroundColor: '#2A211810' }}
            whileTap={{ scale: 0.9 }}
            className='p-2 rounded-xl border border-[#2A2118]/20 hover:border-[#2A2118]/40 transition-all duration-200'
          >
            ←
          </motion.button>
          <motion.button
            onClick={() => navigateMonth(1)}
            whileHover={{ scale: 1.1, backgroundColor: '#2A211810' }}
            whileTap={{ scale: 0.9 }}
            className='p-2 rounded-xl border border-[#2A2118]/20 hover:border-[#2A2118]/40 transition-all duration-200'
          >
            →
          </motion.button>
        </div>
      </motion.div>

      {/* Month Year Display */}
      <motion.div 
        className='text-center mb-3 md:mb-4'
        variants={itemVariants}
      >
        <h4 className='text-base md:text-lg font-bold text-[#2A2118]'>{monthYear}</h4>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div variants={itemVariants} className='grid grid-cols-7 gap-1 mb-2 md:mb-3'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className='text-center text-xs font-bold text-[#2A2118]/60 py-1 md:py-2'>
            {day}
          </div>
        ))}
      </motion.div>

      <motion.div 
        className='grid grid-cols-7 gap-1'
      >
        {calendarDays.map((day, index) => {
          const isAvailable = !isPastDate(day.date) && day.isCurrentMonth
          const isSelected = selectedDate && isSameDay(day.date, selectedDate)
          const isCurrentDay = isToday(day.date)

          return (
            <motion.button
              key={day.date.toISOString()}
              onClick={() => handleDateSelect(day.date)}
              variants={itemVariants}
              whileHover={isAvailable ? { 
                scale: 1.1, 
                y: -2,
              } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              disabled={!isAvailable}
              className={`p-1 md:p-2 rounded-xl text-center transition-all duration-300 relative text-sm ${
                isSelected
                  ? 'bg-gradient-to-br from-[#2A2118] to-[#5D4C38] text-white shadow-lg'
                  : isAvailable
                  ? day.isCurrentMonth
                    ? 'bg-white/50 text-[#2A2118] hover:bg-white/80 border border-white/30'
                    : 'bg-white/30 text-[#2A2118]/40 border border-white/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              } ${isCurrentDay && !isSelected ? 'ring-2 ring-[#2A2118]/30' : ''}`}
            >
              <div className={`text-xs md:text-sm font-medium ${
                !day.isCurrentMonth ? 'opacity-50' : ''
              }`}>
                {day.date.getDate()}
              </div>
              {isCurrentDay && !isSelected && (
                <div className='absolute bottom-0 md:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#2A2118] rounded-full'></div>
              )}
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

export default CalendarCard