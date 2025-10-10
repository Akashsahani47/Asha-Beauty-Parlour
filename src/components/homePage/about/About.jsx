'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.001
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.05,
      ease: "easeOut"
    }
  }
}

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.07,
      ease: "easeOut"
    }
  }
}

const About = () => {
  return (
    <div   className='bg-[#413329] py-12 md:py-20 px-4 sm:px-6 lg:px-8'>
      <motion.div 
        className='max-w-7xl mx-auto border-2 border-[#FFE2D6] rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 bg-[#413329]/90 relative'
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        
        {/* Section Header */}
        <motion.div id="about" className='text-center mb-8 md:mb-12' variants={itemVariants}>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFE2D6] mb-3 md:mb-4'>About Us</h1>
          <motion.div 
            className='w-16 md:w-20 h-1 bg-[#FFE2D6] mx-auto'
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.1 }}
          ></motion.div>
        </motion.div>

        <div className='flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16'>
          
          {/* Text Content - Order changes on mobile */}
          <motion.div className='flex-1 order-2 lg:order-1' variants={containerVariants}>
            <motion.h2 className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#FFE2D6] mb-4 md:mb-6' variants={itemVariants}>
              The Vision
            </motion.h2>
            
            <motion.div className='space-y-4 md:space-y-6 text-[#FFE2D6]' variants={containerVariants}>
              <motion.p className='text-base sm:text-lg leading-relaxed' variants={itemVariants}>
                Welcome to Asha Parlour, a place where beauty meets care. We may be new, but our mission is simple — to make you feel confident, relaxed, and glowing every time you visit.
              </motion.p>
              
              <motion.div 
                className='bg-[#FFE2D6]/10 p-4 sm:p-5 md:p-6 rounded-2xl border border-[#FFE2D6]/20'
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <p className='font-medium mb-3 md:mb-4 text-sm sm:text-base'>At our salon, we focus on:</p>
                <ul className='space-y-2 sm:space-y-3 ml-4 sm:ml-5'>
                  <motion.li 
                    className='flex items-start text-sm sm:text-base'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className='text-[#FFE2D6] mr-2 mt-1 text-lg'>•</span>
                    Using safe and quality products for your skin and hair.
                  </motion.li>
                  <motion.li 
                    className='flex items-start text-sm sm:text-base'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0 }}
                  >
                    <span className='text-[#FFE2D6] mr-2 mt-1 text-lg'>•</span>
                    Offering a friendly, comfortable environment where you can truly relax.
                  </motion.li>
                  <motion.li 
                    className='flex items-start text-sm sm:text-base'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 }}
                  >
                    <span className='text-[#FFE2D6] mr-2 mt-1 text-lg'>•</span>
                    Providing personalized services tailored just for you.
                  </motion.li>
                </ul>
              </motion.div>

              <motion.p className='text-base sm:text-lg leading-relaxed' variants={itemVariants}>
                We believe that beauty is not just about looking good, it's about feeling good inside out. Step in, take a break, and let us pamper you. 🌸
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Image - Order changes on mobile */}
          <motion.div 
            className='flex-1 order-1 lg:order-2 flex justify-center w-full'
            variants={imageVariants}
            whileHover={{ 
              scale: 1.05,
              rotate: 1,
              transition: { duration: 0.3 }
            }}
          >
            <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md'>
              <Image
                src='/p2.png'
                width={400}
                height={500}
                className='rounded-2xl shadow-lg md:shadow-xl border-4 border-[#FFE2D6] w-full h-auto'
                alt="Asha Parlour interior"
              />
              {/* Decorative element */}
              <motion.div 
                className='absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 md:-bottom-4 md:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#FFE2D6]/20 rounded-full z-0'
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements - hidden on mobile */}
        <motion.div 
          className='absolute top-5 left-5 w-8 h-8 md:top-10 md:left-10 md:w-12 md:h-12 rounded-full bg-[#FFE2D6]/10 hidden sm:block'
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className='absolute bottom-5 right-5 w-10 h-10 md:bottom-10 md:right-10 md:w-16 md:h-16 rounded-full bg-[#FFE2D6]/10 hidden sm:block'
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </motion.div>
    </div>
  )
}

export default About