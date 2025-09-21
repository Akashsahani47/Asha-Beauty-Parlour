'use client'
import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE2D6] to-[#ffd1bf] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Toggle Switch */}
          <div className="flex bg-[#413329]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'bg-[#FFE2D6] text-[#413329]' 
                  : 'text-[#FFE2D6] hover:bg-[#413329]/80'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-[#FFE2D6] text-[#413329]' 
                  : 'text-[#FFE2D6] hover:bg-[#413329]/80'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#413329] mb-2 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[#413329]/70 text-center mb-8">
              {isLogin ? 'Sign in to your account' : 'Join us today!'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field - Only for Sign Up */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-[#413329] font-medium text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-[#413329] font-medium text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-[#413329] font-medium text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                  required
                />
              </div>

              {/* Phone Field - Only for Sign Up */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-[#413329] font-medium text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Remember Me - Only for Login */}
              {isLogin && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#413329] border-2 border-[#413329]/30 rounded focus:ring-[#413329]"
                  />
                  <label className="text-[#413329]/80 text-sm">
                    Remember me
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              {/* Forgot Password - Only for Login */}
              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-[#413329]/70 hover:text-[#413329] text-sm transition-colors duration-300">
                    Forgot your password?
                  </a>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#413329]/20"></div>
                <span className="px-3 text-[#413329]/50 text-sm">or</span>
                <div className="flex-1 border-t border-[#413329]/20"></div>
              </div>
            </form>

            {/* Switch Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-[#413329]/70 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#413329] font-semibold hover:underline transition-all duration-300"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-[#413329]/60 text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#413329] hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-[#413329] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;