'use client'
import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`;
      
      // Prepare data for backend
      const requestData = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phoneNo: formData.phone
          };

      // Show loading toast
      const loadingToast = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToast);
        throw new Error(data.message || "Authentication failed");
      }

      // Handle successful authentication
      if (isLogin) {
        // Store token if remember me is checked
        if (formData.rememberMe) {
          localStorage.setItem("authToken", data.token);
        } else {
          sessionStorage.setItem("authToken", data.token);
        }
        
        // Show success toast
        toast.dismiss(loadingToast);
        toast.success('Login successful! Redirecting...');
        console.log("Login successful:", data);
        // Redirect user or update app state here
      } else {
        // Show success toast
        toast.dismiss(loadingToast);
        toast.success('Account created successfully! You can now login.');
        console.log("Signup successful:", data);
        // Optionally switch to login mode or redirect
        setIsLogin(true);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        rememberMe: false
      });

    } catch (err) {
      setError(err.message);
      // Show error toast
      toast.error(err.message || 'Something went wrong!');
      console.error("Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE2D6] to-[#ffd1bf] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#413329',
            color: '#FFE2D6',
            borderRadius: '12px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#FFE2D6',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#FFE2D6',
            },
          },
          loading: {
            iconTheme: {
              primary: '#FFE2D6',
              secondary: '#413329',
            },
          },
        }}
      />
      
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

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                disabled={loading}
                className={`w-full bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : isLogin ? 'Sign In' : 'Create Account'}
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
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
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