
'use client'
import React, { useState, useEffect } from 'react'

const ContactUs = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="relative bg-gradient-to-br from-[#FFE2D6] to-[#ffd1bf] py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" id="contact">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-10 bg-[#413329]"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 10}%`,
              animation: `float${i % 3 + 1} ${8 + i * 2}s ease-in-out infinite`
            }}
          ></div>
        ))}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i+5}
            className="absolute rounded-full opacity-10 bg-[#413329]"
            style={{
              width: `${30 + i * 15}px`,
              height: `${30 + i * 15}px`,
              bottom: `${5 + i * 10}%`,
              right: `${5 + i * 8}%`,
              animation: `float${i % 3 + 1} ${10 + i * 2}s ease-in-out infinite ${i % 2 ? 'reverse' : ''}`
            }}
          ></div>
        ))}
      </div>

      <div id='contactus'  className="max-w-6xl mx-auto relative z-10">
        
        {/* Mobile Design - Enhanced Animated Cards */}
        <div className="md:hidden">
          {/* Animated Header with decorative elements */}
          <div className={`text-center mb-10 transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block relative mb-4">
              <div  className="absolute -inset-3 bg-[#413329]/10 rounded-full blur-md"></div>
              <h1 className="text-4xl font-bold relative z-10 bg-gradient-to-r from-[#413329] to-[#8B5A2B] bg-clip-text text-transparent">
                Contact Us
              </h1>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#413329] to-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#413329] mb-3">Get in Touch</h2>
            <p className="text-[#413329]/80 max-w-md mx-auto">
              Have a question or want to book an appointment? We're here for you.
            </p>
          </div>

          {/* Floating Form Cards with enhanced animations */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Cards - Animated */}
            <div className={`transform transition-all duration-700 ease-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className={`bg-white rounded-2xl p-5 shadow-xl border-2 transition-all duration-300 ${activeField === 'firstName' ? 'border-[#413329] shadow-lg' : 'border-[#413329]/10 hover:border-[#413329]/30'}`}>
                <label className="block text-[#413329] font-medium mb-3 text-sm uppercase tracking-wide">
                  First name *
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={() => setActiveField('firstName')}
                  onBlur={() => setActiveField(null)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-[#413329]/20 focus:border-[#413329] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className={`transform transition-all duration-700 ease-out delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className={`bg-white rounded-2xl p-5 shadow-xl border-2 transition-all duration-300 ${activeField === 'lastName' ? 'border-[#413329] shadow-lg' : 'border-[#413329]/10 hover:border-[#413329]/30'}`}>
                <label className="block text-[#413329] font-medium mb-3 text-sm uppercase tracking-wide">
                  Last name *
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onFocus={() => setActiveField('lastName')}
                  onBlur={() => setActiveField(null)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-[#413329]/20 focus:border-[#413329] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Email Card - Animated */}
            <div className={`transform transition-all duration-700 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className={`bg-white rounded-2xl p-5 shadow-xl border-2 transition-all duration-300 ${activeField === 'email' ? 'border-[#413329] shadow-lg' : 'border-[#413329]/10 hover:border-[#413329]/30'}`}>
                <label className="block text-[#413329] font-medium mb-3 text-sm uppercase tracking-wide">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-[#413329]/20 focus:border-[#413329] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Message Card - Animated */}
            <div className={`transform transition-all duration-700 ease-out delay-250 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className={`bg-white rounded-2xl p-5 shadow-xl border-2 transition-all duration-300 ${activeField === 'message' ? 'border-[#413329] shadow-lg' : 'border-[#413329]/10 hover:border-[#413329]/30'}`}>
                <label className="block text-[#413329] font-medium mb-3 text-sm uppercase tracking-wide">
                  Write a message
                </label>
                <textarea
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setActiveField('message')}
                  onBlur={() => setActiveField(null)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-[#413329]/20 focus:border-[#413329] focus:outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Submit Button - Animated */}
            <div className={`transform transition-all duration-700 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#413329] to-[#8B5A2B] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#ffd1bf] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Send Message 
                <span className="group-hover:translate-x-1 transition-transform duration-300">✨</span>
              </button>
            </div>
          </form>
         
        </div>

        {/* Desktop Design - Enhanced Interactive Split Layout */}
        <div className="hidden md:flex md:gap-12 lg:gap-20">
          {/* Left Side - Enhanced Animated Content */}
          <div className="w-1/2 flex flex-col justify-center">
            <div className={`mb-10 transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-[#413329]/10 rounded-full blur-lg"></div>
                <h1 className="text-5xl font-bold relative z-10 bg-gradient-to-r from-[#413329] to-[#8B5A2B] bg-clip-text text-transparent">
                  Contact Us
                </h1>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-[#413329] to-transparent mb-6 mt-4"></div>
              <h2 className="text-2xl font-semibold text-[#413329] mb-6">Get in Touch</h2>
              <p className="text-[#413329]/80 text-lg leading-relaxed max-w-md">
                Have a question or want to book an appointment?<br />
                Feel free to reach out to us. We're here to assist you.
              </p>
            </div>

            {/* Enhanced Animated Contact Info */}
           
          </div>

          {/* Right Side - Enhanced Interactive Form */}
          <div className="w-1/2">
            <div className={`bg-white rounded-3xl p-8 shadow-2xl transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-10 opacity-0 rotate-2'}`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields - Side by side */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="transform transition-all duration-300 hover:-translate-y-1">
                    <label className="block text-[#413329] font-medium mb-2">
                      First name *
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="transform transition-all duration-300 hover:-translate-y-1">
                    <label className="block text-[#413329] font-medium mb-2">
                      Last name *
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                  <label className="block text-[#413329] font-medium mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Message */}
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                  <label className="block text-[#413329] font-medium mb-2">
                    Write a message
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Enhanced Animated Submit Button */}
                <button
               
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#413329] to-[#8B5A2B] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#ffd1bf] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Send Message 
                  <span className="group-hover:translate-x-1 transition-transform duration-300"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs