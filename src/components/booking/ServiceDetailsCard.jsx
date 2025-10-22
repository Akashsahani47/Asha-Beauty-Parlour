'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const ServiceDetailsCard = ({ service, activeTab, setActiveTab, getServiceIcon }) => {
  const serviceTabs = [
    { id: 'details', label: 'Service Details', icon: '📋' },
    { id: 'benefits', label: 'Benefits', icon: '✨' },
    { id: 'process', label: 'Process', icon: '🔄' },
  ]

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
      <div className='flex flex-col lg:flex-row items-start gap-6 md:gap-8'>
        {/* Service Icon and Basic Info */}
        <motion.div 
          className='flex-shrink-0 text-center lg:text-left'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className='w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-[#FAF3EB] to-[#FFF9F5] rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-4 md:mb-6 shadow-lg border border-white/50'>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={getServiceIcon(service.category)}
                alt={service.category}
                width={48}
                height={48}
                className='object-contain w-10 h-10 md:w-16 md:h-16'
              />
            </motion.div>
          </div>
          <motion.div 
            className='inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white font-bold text-xs md:text-sm'
            whileHover={{ scale: 1.1 }}
          >
            {service.category}
          </motion.div>
        </motion.div>

        {/* Service Main Info */}
        <div className='flex-1 w-full'>
          <motion.h2 
            className='text-2xl md:text-4xl font-bold text-[#2A2118] mb-4'
            variants={itemVariants}
          >
            {service.name}
          </motion.h2>
          
          <motion.div 
            className='flex flex-wrap gap-4 md:gap-6 mb-6'
            variants={itemVariants}
          >
            <div className='flex items-center gap-2 md:gap-3 bg-white/50 rounded-2xl px-3 py-2 md:px-4 md:py-2 border border-white/30'>
              <span className='text-lg md:text-xl'>💰</span>
              <span className='text-lg md:text-xl font-bold text-[#2A2118]'>
                {service.price ? 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(service.price) : 'Contact for price'
                }
              </span>
            </div>
            <div className='flex items-center gap-2 md:gap-3 bg-white/50 rounded-2xl px-3 py-2 md:px-4 md:py-2 border border-white/30'>
              <span className='text-lg md:text-xl'>⏱️</span>
              <span className='text-base md:text-lg font-semibold text-[#2A2118]'>
                {service.duration ? `${service.duration} minutes` : 'Flexible duration'}
              </span>
            </div>
          </motion.div>

          {/* Service Tabs */}
          <motion.div variants={itemVariants} className='mb-6'>
            <div className='flex space-x-1 bg-white/50 rounded-2xl p-1 border border-white/30'>
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-semibold text-xs md:text-sm transition-all duration-300 rounded-xl ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#2A2118] to-[#5D4C38] text-white shadow-lg'
                      : 'text-[#2A2118]/60 hover:text-[#2A2118] hover:bg-white/50'
                  }`}
                >
                  <span className='text-sm md:text-base'>{tab.icon}</span>
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <TabContent activeTab={activeTab} service={service} />
        </div>
      </div>
    </motion.div>
  )
}

const TabContent = ({ activeTab, service }) => (
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className='min-h-[150px] md:min-h-[200px]'
  >
    {activeTab === 'details' && (
      <div className='space-y-4'>
        <p className='text-base md:text-lg text-[#2A2118]/80 leading-relaxed'>
          {service.description || `Our premium ${service.name} service is designed to provide you with the ultimate beauty experience. Our expert professionals use only the highest quality products and techniques to ensure you leave feeling refreshed and rejuvenated.`}
        </p>
      </div>
    )}

    {activeTab === 'benefits' && (
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
          <div className='bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
            <h4 className='font-semibold text-[#2A2118] mb-2 text-sm md:text-base'>✨ Immediate Results</h4>
            <p className='text-[#2A2118]/70 text-xs md:text-sm'>Visible improvement after first session</p>
          </div>
          <div className='bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
            <h4 className='font-semibold text-[#2A2118] mb-2 text-sm md:text-base'>🌿 Premium Products</h4>
            <p className='text-[#2A2118]/70 text-xs md:text-sm'>Using only certified organic products</p>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'process' && (
      <div className='space-y-4'>
        <div className='space-y-3'>
          <div className='flex items-start gap-3 md:gap-4 bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
            <div className='w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1'>1</div>
            <div>
              <h4 className='font-semibold text-[#2A2118] text-sm md:text-base'>Consultation</h4>
              <p className='text-[#2A2118]/70 text-xs md:text-sm'>Personalized assessment of your needs</p>
            </div>
          </div>
          <div className='flex items-start gap-3 md:gap-4 bg-white/50 rounded-2xl p-3 md:p-4 border border-white/30'>
            <div className='w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-[#2A2118] to-[#5D4C38] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1'>2</div>
            <div>
              <h4 className='font-semibold text-[#2A2118] text-sm md:text-base'>Service Execution</h4>
              <p className='text-[#2A2118]/70 text-xs md:text-sm'>Expert application of the selected treatment</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </motion.div>
)

export default ServiceDetailsCard