'use client'
import { motion } from 'framer-motion'

const LoadingState = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF9F5] to-[#FAF3EB] py-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className='inline-block relative' 
          >
            <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#2A2118] to-[#5D4C38] bg-clip-text text-transparent mb-6'>
              BOOK YOUR Service
            </h1>
          </motion.div>
        </div>
        
        <motion.div 
          className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className='animate-pulse space-y-8'>
            <div className='flex items-center space-x-6'>
              <div className='w-24 h-24 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-2xl'></div>
              <div className='space-y-3 flex-1'>
                <div className='h-6 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-full w-3/4'></div>
                <div className='h-4 bg-gradient-to-r from-[#2A2118]/10 to-[#5D4C38]/10 rounded-full w-1/2'></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingState