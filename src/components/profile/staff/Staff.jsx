'use client'
import React from 'react'
import { Users, Sparkles, Calendar, Clock, Star, Crown, Award } from 'lucide-react'

const Staff = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 transition-all duration-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        {/* Enhanced Header - Mobile Optimized */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 shadow-lg border border-white/40 mb-4 lg:mb-6">
            <Crown className="w-4 h-4 lg:w-6 lg:h-6 text-amber-500" />
            <span className="text-xs lg:text-sm font-semibold text-[#413329]">Team Management</span>
          </div>
          <h1 className="text-2xl lg:text-5xl font-bold bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Our Team
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Meet our dedicated team of beauty professionals committed to your perfect experience
          </p>
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-16 text-center">
          {/* Animated Icon */}
          <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-8 shadow-2xl animate-bounce">
            <Users className="w-8 h-8 lg:w-16 lg:h-16 text-[#413329]" />
          </div>
          
          {/* Coming Soon Text */}
          <h2 className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-4 lg:mb-6">
            Coming Soon
          </h2>
          
          <p className="text-[#413329]/70 text-base lg:text-2xl mb-6 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
            We're crafting an amazing team management experience for you. 
            Stay tuned for something beautiful!
          </p>

          {/* Features Preview - Mobile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-4xl mx-auto mb-6 lg:mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 mx-auto">
                <Users className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] text-sm lg:text-base mb-1 lg:mb-2">Team Profiles</h3>
              <p className="text-[#413329]/70 text-xs lg:text-sm leading-relaxed">
                Detailed profiles of our beauty experts and their specialties
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 mx-auto">
                <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] text-sm lg:text-base mb-1 lg:mb-2">Scheduling</h3>
              <p className="text-[#413329]/70 text-xs lg:text-sm leading-relaxed">
                Book appointments with your preferred staff members
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 mx-auto">
                <Star className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] text-sm lg:text-base mb-1 lg:mb-2">Ratings</h3>
              <p className="text-[#413329]/70 text-xs lg:text-sm leading-relaxed">
                View ratings and reviews for each team member
              </p>
            </div>
          </div>

          {/* Progress Indicator - Mobile Optimized */}
          <div className="max-w-md mx-auto mb-6 lg:mb-8">
            <div className="flex justify-between text-xs lg:text-sm text-[#413329]/70 mb-2">
              <span>Development Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2 lg:h-3 border border-white/60">
              <div 
                className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] h-2 lg:h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div className="bg-gradient-to-r from-[#FFE2D6] to-[#FDBD99] rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-[#FDAD80] max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <Award className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              <span className="font-semibold text-[#413329] text-sm lg:text-base">Need Immediate Assistance?</span>
            </div>
            <p className="text-[#413329]/80 text-xs lg:text-sm">
              Contact us directly at{' '}
              <span className="font-semibold text-[#413329]">ak676964@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staff