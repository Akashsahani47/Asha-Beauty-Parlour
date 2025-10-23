'use client'
import React from 'react'
import { Calendar, Sparkles, Clock, Bell, Zap, Calendar as CalendarIcon, CheckCircle } from 'lucide-react'

const Appointment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 transition-all duration-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        {/* Enhanced Header - Mobile Optimized */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 shadow-lg border border-white/40 mb-4 lg:mb-6">
            <CalendarIcon className="w-4 h-4 lg:w-6 lg:h-6 text-amber-500" />
            <span className="text-xs lg:text-sm font-semibold text-[#413329]">Appointment Management</span>
          </div>
          <h1 className="text-2xl lg:text-5xl font-bold bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Bride Appointment
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Streamline your booking experience with our intelligent appointment system
          </p>
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-16 text-center">
          {/* Animated Icon */}
          <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-8 shadow-2xl animate-bounce">
            <Calendar className="w-8 h-8 lg:w-16 lg:h-16 text-[#413329]" />
          </div>
          
          {/* Coming Soon Text */}
          <h2 className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-4 lg:mb-6">
            Coming Soon
          </h2>
          
          <p className="text-[#413329]/70 text-base lg:text-2xl mb-6 lg:mb-12 max-w-2xl mx-auto leading-relaxed">
            We're building a seamless appointment experience that will transform how you book and manage your sessions
          </p>

          {/* Features Preview - Mobile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-4xl mx-auto mb-6 lg:mb-12">
            {[
              { icon: Zap, title: "Quick Booking", desc: "Instant appointment scheduling with real-time availability" },
              { icon: Bell, title: "Smart Reminders", desc: "Automated notifications and reminders for your appointments" },
              { icon: Clock, title: "Time Management", desc: "Efficient scheduling with buffer times and duration tracking" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 mx-auto">
                  <feature.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#413329] text-sm lg:text-base mb-1 lg:mb-2">{feature.title}</h3>
                <p className="text-[#413329]/70 text-xs lg:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Countdown/Timeline - Mobile Optimized */}
          <div className="max-w-2xl mx-auto mb-6 lg:mb-8">
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-4 lg:mb-6">
              {[
                { color: "bg-emerald-500", text: "Design Completed" },
                { color: "bg-amber-500", text: "Development in Progress" },
                { color: "bg-gray-300", text: "Testing Phase" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-1 lg:gap-2">
                  <div className={`w-2 h-2 lg:w-3 lg:h-3 ${item.color} rounded-full animate-pulse`}></div>
                  <span className="text-xs lg:text-sm text-[#413329]/70">{item.text}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white/50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/60">
              <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />
                <span className="font-semibold text-[#413329] text-sm lg:text-base">Expected Launch</span>
              </div>
              <p className="text-[#413329]/80 text-base lg:text-lg font-medium">
                End of February 2026
              </p>
            </div>
          </div>

          {/* Newsletter Signup - Mobile Optimized */}
          <div className="bg-gradient-to-r from-[#FFE2D6] to-[#FDBD99] rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-[#FDAD80] max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-[#413329]" />
              <span className="font-semibold text-[#413329] text-sm lg:text-base">Get Notified First</span>
            </div>
            <p className="text-[#413329]/80 text-xs lg:text-sm mb-3 lg:mb-4">
              Be the first to know when our appointment system launches
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 lg:px-4 py-2 bg-white/80 border border-white/60 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 text-[#413329] placeholder-[#413329]/50 text-sm lg:text-base"
              />
              <button className="px-4 py-2 bg-[#413329] text-[#FFE2D6] rounded-lg lg:rounded-xl hover:bg-[#5D4A3A] transition-all duration-300 font-medium text-sm lg:text-base whitespace-nowrap">
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