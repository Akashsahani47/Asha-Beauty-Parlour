'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Services = () => {
  const services = [
    {
      id: 1,
      title: "FULL SERVICE",
      description: "Experience our complete beauty transformation package. From hair to makeup, we provide a comprehensive makeover that will leave you feeling absolutely stunning and confident."
    },
    {
      id: 2,
      title: "FACIAL",
      description: "Indulge in our luxurious facial therapies designed to rejuvenate your skin. Using premium products and techniques, we'll give your skin the radiant glow it deserves."
    },
    {
      id: 3,
      title: "HAIRSTYLING",
      description: "Transform your look with our expert hairstyling services. Whether you want a dramatic change or a subtle refresh, our stylists will create the perfect style for you."
    },
    {
      id: 4,
      title: "MAKEUP",
      description: "Our professional makeup artists will enhance your natural beauty for any occasion. From natural daytime looks to glamorous evening transformations."
    }
  ]

  // Animation variants for the service items
  const itemVariants = {
    hidden: (index) => ({
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50, // Reduced from ±100 to ±50
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className='bg-[#FFE2D6] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden' id="services">
      {/* Added overflow-hidden to prevent horizontal scroll */}
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "0px" }} // Added margin: 0px
        >
          <div className='inline-block relative'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#413329] mb-4 relative z-10'>OUR SERVICES</h1>
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-[#413329]/20 z-0'></div>
          </div>
          <p className='text-lg text-[#413329]/80 max-w-2xl mx-auto mt-6'>
            Discover our premium beauty services designed to enhance your natural radiance and boost your confidence.
          </p>
        </motion.div>

        {/* Services List */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 overflow-visible'>
          {/* Added overflow-visible to ensure proper clipping */}
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              className='group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2'
              custom={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }} // Changed margin to 0px
            >
              {/* Background Pattern - Fixed positioning */}
              <div className='absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#413329]/5 rounded-bl-full z-0'></div>
              
              <div className='relative flex flex-col md:flex-row items-center p-6 md:p-8 z-10'>
                {/* Service Image */}
                <div className='w-20 h-20 md:w-24 md:h-24 bg-[#FFE2D6] rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0'>
                  {service.id === 1 && (
                    <Image
                      src="/makeup.png"
                      alt="Full Service"
                      width={40}
                      height={40}
                      className='object-contain'
                    />
                  )} 
                  {service.id === 2 && (
                    <Image
                      src="/facialmassage.png"
                      alt="Facial Treatments"
                      width={40}
                      height={40}
                      className='object-contain'
                    />
                  )}
                  {service.id === 3 && (
                    <Image
                      src="/haircut.png"
                      alt="Hairstyling"
                      width={40}
                      height={40}
                      className='object-contain'
                    />
                  )}
                  {service.id === 4 && (
                    <Image
                      src="/eyebrows.png"
                      alt="Makeup Artistry"
                      width={40}
                      height={40}
                      className='object-contain'
                    />
                  )}
                </div>
                
                {/* Service Content */}
                <div className='flex-1 text-center md:text-left'>
                  <h2 className='text-xl md:text-2xl font-bold text-[#413329] mb-2'>{service.title}</h2>
                  <div className='w-12 h-1 bg-[#413329] mb-3 mx-auto md:mx-0'></div>
                  <p className='text-[#413329]/80 text-sm md:text-base'>{service.description}</p>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className='absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#413329]/20 transition-all duration-300 pointer-events-none'></div>
            </motion.div>
          ))}
        </div>

        {/* All Services Button */}
        <motion.div 
          className='text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "0px" }} // Added margin: 0px
        >
          <button className='relative bg-[#413329] text-[#FFE2D6] px-8 py-3 md:px-10 md:py-4 rounded-full font-medium overflow-hidden group transition-all duration-300 hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] hover:shadow-2xl'>
            <span className='relative z-10'>All Services</span>
            <div className='absolute inset-0 bg-[#FFE2D6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0'></div>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Services