import React from 'react'

const GetInTouch = () => {
  return (
    <div className="relative bg-white py-4 overflow-hidden">
      <div className="flex">
        {/* First marquee */}
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-xl md:text-2xl font-bold text-[#FFE2D6] mx-4 md:mx-8 flex items-center">
              Get in Touch ✨
            </span>
          ))}
        </div>
        
        {/* Second marquee positioned to the right for continuous flow */}
        <div className="flex animate-marquee whitespace-nowrap  left-full">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-xl md:text-2xl font-bold text-[#FFE2D6] mx-4 md:mx-8 flex items-center">
              Get in Touch ✨
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GetInTouch