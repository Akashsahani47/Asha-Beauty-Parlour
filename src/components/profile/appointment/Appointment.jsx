'use client'
import React from 'react'
import { Calendar, Sparkles, Clock, Bell, Zap, Calendar as CalendarIcon, CheckCircle } from 'lucide-react'

const Appointment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg border border-white/40 mb-6">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-semibold text-[#413329]">Appointment Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-4">
           Bride Appointment
          </h1>
          <p className="text-[#413329]/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Streamline your booking experience with our intelligent appointment system
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-16 text-center">
          {/* Animated Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <Calendar className="w-16 h-16 text-[#413329]" />
          </div>
          
          {/* Coming Soon Text */}
          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-6">
            Coming Soon
          </h2>
          
          <p className="text-[#413329]/70 text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            We're building a seamless appointment experience that will transform how you book and manage your sessions
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Quick Booking</h3>
              <p className="text-[#413329]/70 text-sm">
                Instant appointment scheduling with real-time availability
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Smart Reminders</h3>
              <p className="text-[#413329]/70 text-sm">
                Automated notifications and reminders for your appointments
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#413329] mb-2">Time Management</h3>
              <p className="text-[#413329]/70 text-sm">
                Efficient scheduling with buffer times and duration tracking
              </p>
            </div>
          </div>

          {/* Countdown/Timeline */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#413329]/70">Design Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#413329]/70">Development in Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-[#413329]/70">Testing Phase</span>
              </div>
            </div>
            
            <div className="bg-white/50 rounded-2xl p-6 border border-white/60">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-[#413329]">Expected Launch</span>
              </div>
              <p className="text-[#413329]/80 text-lg font-medium">
                End of February 2026
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-[#FFE2D6] to-[#FDBD99] rounded-2xl p-6 border border-[#FDAD80] max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-[#413329]" />
              <span className="font-semibold text-[#413329]">Get Notified First</span>
            </div>
            <p className="text-[#413329]/80 text-sm mb-4">
              Be the first to know when our appointment system launches
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white/80 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 text-[#413329] placeholder-[#413329]/50"
              />
              <button className="px-4 py-2 bg-[#413329] text-[#FFE2D6] rounded-xl hover:bg-[#5D4A3A] transition-all duration-300 font-medium">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment