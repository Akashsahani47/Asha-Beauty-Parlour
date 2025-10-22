'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const AuthGuard = ({ token, children }) => {
  const router = useRouter()

  if (!token) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#FDBD99] via-[#FFF5F0] to-[#FFE2D6] py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-block relative mb-8'
          >
            <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#8B7355] bg-clip-text text-transparent mb-6'>
              LOGIN TO BOOK SERVICE
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20'
          >
            <div className='text-red-600 mb-6'>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-20 h-20 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </motion.div>
              <p className='text-2xl font-bold text-[#413329] mb-4'>Access Required</p>
              <p className='text-[#413329]/70 mb-8'>Please login to book our premium services</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toast.loading('Redirecting to login...', { duration: 1000 })
                setTimeout(() => router.push('/login'), 1000)
              }}
              className='bg-gradient-to-r from-[#413329] to-[#8B7355] text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 w-full mb-4'
            >
              Login to Continue
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/servicespage')}
              className='bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 w-full'
            >
              Back to Services
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return children
}

export default AuthGuard