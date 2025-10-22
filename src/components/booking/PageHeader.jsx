'use client'
import { motion } from 'framer-motion'

const PageHeader = () => (
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
        Book Service
      </h1>
      <motion.div 
        className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full opacity-50'
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      ></motion.div>
    </motion.div>
  </motion.div>
)

export default PageHeader