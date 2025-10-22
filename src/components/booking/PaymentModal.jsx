'use client'
import { motion, AnimatePresence } from 'framer-motion'

const PaymentModal = ({
  showPaymentModal,
  setShowPaymentModal,
  paymentProcessing,
  handlePayAfterService,
  handleOnlinePayment
}) => {
  if (!showPaymentModal) return null

  return (
    <AnimatePresence>
      {showPaymentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
        >
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => !paymentProcessing && setShowPaymentModal(false)}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full relative border border-white/20 mx-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                <span className="text-xl md:text-2xl">💎</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {paymentProcessing ? 'Processing...' : 'Complete Your Booking'}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm">
                {paymentProcessing ? 'Please wait while we process your request' : 'Choose your preferred payment method'}
              </p>
            </div>

            {/* Payment Options - Only show if not processing */}
            {!paymentProcessing ? (
              <>
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {/* Pay After Service */}
                  <motion.button
                    onClick={handlePayAfterService}
                    disabled={paymentProcessing}
                    whileHover={!paymentProcessing ? { 
                      scale: 1.02, 
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    } : {}}
                    whileTap={!paymentProcessing ? { scale: 0.98 } : {}}
                    className={`w-full p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                      paymentProcessing 
                        ? 'opacity-50 cursor-not-allowed border-gray-200' 
                        : 'border-emerald-100 hover:border-emerald-300 hover:shadow-lg'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
                    }}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-3 md:gap-4 relative z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-emerald-500/25">
                        ⏰
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base md:text-lg">Pay Later</div>
                        <div className="text-xs md:text-sm text-gray-600">Pay at the salon when you visit</div>
                      </div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-300" />
                    </div>
                  </motion.button>

                  {/* Online Payment */}
                  <motion.button
                    onClick={handleOnlinePayment}
                    disabled={paymentProcessing}
                    whileHover={!paymentProcessing ? { 
                      scale: 1.02, 
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 17 }
                    } : {}}
                    whileTap={!paymentProcessing ? { scale: 0.98 } : {}}
                    className={`w-full p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                      paymentProcessing 
                        ? 'opacity-50 cursor-not-allowed border-gray-200' 
                        : 'border-blue-100 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)'
                    }}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-3 md:gap-4 relative z-10">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-blue-500/25">
                        🔒
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base md:text-lg">Pay Now</div>
                        <div className="text-xs md:text-sm text-gray-600">Secure payment via Razorpay</div>
                      </div>
                      <div className="text-blue-600 font-semibold text-xs md:text-sm bg-blue-100 px-2 md:px-3 py-1 rounded-full">
                        Secure
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 md:space-y-3">
                  <motion.button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentProcessing}
                    whileHover={!paymentProcessing ? { scale: 1.02 } : {}}
                    whileTap={!paymentProcessing ? { scale: 0.98 } : {}}
                    className={`w-full py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 border-2 text-sm md:text-base ${
                      paymentProcessing 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </>
            ) : (
              /* Processing State */
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                />
                <div className="text-gray-700 font-medium text-lg mb-2">Processing...</div>
                <div className="text-gray-500 text-sm">
                  {paymentProcessing === 'pay_later' 
                    ? 'Setting up your pay later booking' 
                    : 'Initializing secure payment'}
                </div>
              </div>
            )}

            {/* Security Badge */}
            {!paymentProcessing && (
              <div className="flex items-center justify-center gap-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                <div className="w-3 h-3 md:w-4 md:h-4 text-green-500">✓</div>
                <span className="text-xs text-gray-500">100% Secure & Encrypted</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal