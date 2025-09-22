'use client'
import React, { useState, useEffect } from 'react'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index)
  }

  // Function to open address in Google Maps
  const openGoogleMaps = () => {
    const address = "Rati Nath Basu Path, Old Sharwon Road, Near Pani tanki"
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  return (
    <footer className="bg-[#413329] text-[#FFE2D6] pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFE2D6] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-[#FFE2D6] rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-[#FFE2D6] rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold  animate-bounce">ASHA</span>
              <span className="ml-2 text-xl font-semibold">Beauty Parlour</span>
            </div>
            <p className="mb-6 text-[#FFE2D6]/80 leading-relaxed">
              Transforming beauty with precision and care. Experience the best beauty services in town.
            </p>
          </div>

          {/* Quick Links - Hidden on mobile */}
          <div className={`hidden md:block transform transition-all duration-1000 ease-out delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-[#FFE2D6]"></div>
            </h3>
            <ul className="space-y-3">
              {['Home', 'About', 'Services', 'Contact', 'Blog', 'Gallery'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#FFE2D6]/80 hover:text-[#FFE2D6] transition-all duration-300 transform hover:translate-x-2 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Hidden on mobile */}
          <div className={`hidden md:block transform transition-all duration-1000 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Services
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-[#FFE2D6]"></div>
            </h3>
            <ul className="space-y-3">
              {['Hair Cutting', 'Facials', 'Makeup', 'Massage', 'Spa', 'Waxing'].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-[#FFE2D6]/80 hover:text-[#FFE2D6] transition-all duration-300 transform hover:translate-x-2 inline-block"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordions for Quick Links and Services */}
          <div className="md:hidden space-y-4">
            {/* Quick Links Accordion */}
            <div className="border-b border-[#FFE2D6]/20 pb-4">
              <button 
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleAccordion(1)}
              >
                <h3 className="text-xl font-semibold">Quick Links</h3>
                <span>{activeAccordion === 1 ? '−' : '+'}</span>
              </button>
              {activeAccordion === 1 && (
                <ul className="mt-4 space-y-3">
                  {['Home', 'About', 'Services', 'Contact', 'Blog', 'Gallery'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[#FFE2D6]/80 hover:text-[#FFE2D6] transition-all duration-300 transform hover:translate-x-2 inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Services Accordion */}
            <div className="border-b border-[#FFE2D6]/20 pb-4">
              <button 
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleAccordion(2)}
              >
                <h3 className="text-xl font-semibold">Services</h3>
                <span>{activeAccordion === 2 ? '−' : '+'}</span>
              </button>
              {activeAccordion === 2 && (
                <ul className="mt-4 space-y-3">
                  {['Hair Cutting', 'Facials', 'Makeup','EyeBrows', 'Waxing'].map((service) => (
                    <li key={service}>
                      <a
                        href="#"
                        className="text-[#FFE2D6]/80 hover:text-[#FFE2D6] transition-all duration-300 transform hover:translate-x-2 inline-block"
                      >
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className={`transform transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-8 h-1 bg-[#FFE2D6]"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start cursor-pointer" onClick={openGoogleMaps}>
                <div className="w-8 h-8 bg-[#FFE2D6] text-[#413329] rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-[#FFE2D6]/80">FPP2+785, Jhoushagari, Deoghar, Jharkhand 814112</p>
                  <p className="text-[#FFE2D6]/60 text-sm mt-1">Click to see in Google Maps</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#FFE2D6] text-[#413329] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  📞
                </div>
                <p className="text-[#FFE2D6]/80">7903983731</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#FFE2D6] text-[#413329] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  ✉️
                </div>
                <p className="text-[#FFE2D6]/80">Asha@beautyparlour.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription - Desktop Only */}
        <div className={`hidden lg:block mb-8 transform transition-all duration-1000 ease-out delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-[#FFE2D6]/10 p-6 rounded-2xl border border-[#FFE2D6]/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                <p className="text-[#FFE2D6]/80">Subscribe to our newsletter for special offers</p>
              </div>
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 bg-[#FFE2D6] text-[#413329] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE2D6] min-w-72"
                />
                <button className="bg-[#FFE2D6] text-[#413329] px-6 py-3 rounded-lg font-medium hover:bg-[#FFE2D6]/90 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Newsletter */}
        <div className={`lg:hidden mb-8 transform transition-all duration-1000 ease-out delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-[#FFE2D6]/10 p-6 rounded-2xl border border-[#FFE2D6]/20">
            <h3 className="text-xl font-semibold mb-4 text-center">Stay Updated</h3>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-[#FFE2D6] text-[#413329] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE2D6]"
              />
              <button className="w-full bg-[#FFE2D6] text-[#413329] px-6 py-3 rounded-lg font-medium hover:bg-[#FFE2D6]/90 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t border-[#FFE2D6]/20 mb-8 transform transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className={`mb-4 md:mb-0 transform transition-all duration-1000 ease-out delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-[#FFE2D6]/60 text-sm">
              © 2025 Beauty Parlour. All rights reserved.
            </p>
          </div>
          <div className={`flex space-x-6 transform transition-all duration-1000 ease-out delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#FFE2D6]/60 hover:text-[#FFE2D6] text-sm transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#FFE2D6] text-[#413329] rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 hover:bg-[#FFE2D6]/90 z-50"
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  )
}

export default Footer
