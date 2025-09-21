'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const Parallax1 = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768)
      }
      
      // Initial check
      checkIsMobile()
      
      // Add event listener for resize
      window.addEventListener('resize', checkIsMobile)
      
      // Cleanup
      return () => window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  return (
    <section className="relative h-[50vh] md:h-[80vh] overflow-hidden">
      {/* Background Image - Different approach for mobile */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          // For mobile - use Next.js Image component with fill
          <Image
            src="/p3.png"
            alt="Beauty Parlour Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          // For desktop - use CSS background with parallax effect
          <div 
            className="w-full h-full bg-fixed bg-center bg-cover"
            style={{ backgroundImage: "url('/p3.png')" }}
          />
        )}
      </div>
      
      {/* Overlay and text */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 z-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Beauty Beyond Limits
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8">
            Experience the transformation that redefines your beauty standards
          </p>
        </div>
      </div>
    </section>
  )
}

export default Parallax1