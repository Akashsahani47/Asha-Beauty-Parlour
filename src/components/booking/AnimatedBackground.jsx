'use client'
import { motion } from 'framer-motion'

const AnimatedBackground = () => (
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
)

export default AnimatedBackground