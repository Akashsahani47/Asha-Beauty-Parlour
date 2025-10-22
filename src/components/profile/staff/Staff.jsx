'use client'
import React from 'react'
import { Users, Sparkles, Calendar, Clock, Star, Crown, Award } from 'lucide-react'

const Staff = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg border border-white/40 mb-6">
            <Crown className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-semibold text-[#413329]">Team Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-4">
            Our Team
          </h1>
          <p className="text-[#413329]/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Meet our dedicated team of beauty professionals committed to your perfect experience
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-16 text-center">
          {/* Animated Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <Users className="w-16 h-16 text-[#413329]" />
          </div>
          
          {/* Coming Soon Text */}
          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-6">
            Coming Soon
          </h2>
          
          <p className="text-[#413329]/70 text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            We're crafting an amazing team management experience for you. 
            Stay tuned for something beautiful!
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Team Profiles</h3>
              <p className="text-[#413329]/70 text-sm">
                Detailed profiles of our beauty experts and their specialties
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Scheduling</h3>
              <p className="text-[#413329]/70 text-sm">
                Book appointments with your preferred staff members
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Ratings</h3>
              <p className="text-[#413329]/70 text-sm">
                View ratings and reviews for each team member
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-[#413329]/70 mb-2">
              <span>Development Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3 border border-white/60">
              <div 
                className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-[#FFE2D6] to-[#FDBD99] rounded-2xl p-6 border border-[#FDAD80] max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-5 h-5 text-[#413329]" />
              <span className="font-semibold text-[#413329]">Need Immediate Assistance?</span>
            </div>
            <p className="text-[#413329]/80 text-sm">
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