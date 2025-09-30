'use client'
import React from "react";
import Image from "next/image";
import {useRouter} from "next/navigation"

const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen max-h-[800px] min-h-[500px] overflow-hidden bg-[#FFE2D6]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/p1.png"
          alt="Beauty Parlour Services"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#413329]/80 to-[#413329]/40"></div>
      </div>

      {/* Floating Decorative Elements - Hidden on mobile */}
      <div className="absolute top-10 left-10 w-10 h-10 md:top-20 md:left-20 md:w-16 md:h-16 rounded-full bg-[#FFE2D6]/30 animate-bounce hidden sm:block"></div>
      <div className="absolute top-1/4 right-10 w-8 h-8 md:top-1/3 md:right-24 md:w-12 md:h-12 rounded-full bg-[#FFE2D6]/30 animate-pulse hidden sm:block"></div>
      <div className="absolute bottom-24 left-1/5 w-6 h-6 md:bottom-32 md:left-1/4 md:w-10 md:h-10 rounded-full bg-[#FFE2D6]/30 animate-ping hidden sm:block"></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-[#413329]/80 backdrop-blur-sm p-6 sm:p-7 md:p-8 rounded-xl md:rounded-2xl border border-[#FFE2D6]/20 text-[#FFE2D6] max-w-full sm:max-w-2xl md:max-w-xl shadow-xl md:shadow-2xl mx-2 sm:mx-4 md:mx-0 animate-fadeInSlide">
          <div className="mb-2 flex items-center">
            <div className="w-8 md:w-10 h-0.5 bg-[#FFE2D6] mr-2 md:mr-3"></div>
            <span className="text-[#FFE2D6] font-medium tracking-wider text-sm md:text-base">
              PREMIUM BEAUTY SERVICES
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
            Reveal Your <span className="text-[#FFE2D6] block mt-1 md:mt-0 md:inline">Natural Beauty</span>
          </h1>

          <p className="mb-4 md:mb-6 text-base sm:text-lg text-[#FFE2D6] leading-relaxed">
            Experience the perfect blend of traditional Indian beauty secrets
            and modern elegance at our luxury boutique parlor. Your journey to
            radiance begins here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="relative bg-[#FFE2D6] text-[#413329] hover:bg-[#413329] hover:text-[#FFE2D6] border border-[#FFE2D6] px-6 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg group text-sm sm:text-base">
              Book Now
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>

            <button onClick={()=> router.push("/servicespage")} className="border cursor-pointer border-[#FFE2D6]/50 hover:border-[#FFE2D6] text-[#FFE2D6] px-6 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-3 rounded-full font-medium transition-all duration-300 hover:bg-[#FFE2D6]/10 text-sm sm:text-base">
              View Services
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-[#FFE2D6] text-xs md:text-sm mb-1 md:mb-2">Scroll to explore</span>
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-[#FFE2D6]/30 rounded-full flex justify-center">
          <div className="w-1 h-2 md:h-3 bg-[#FFE2D6] rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;