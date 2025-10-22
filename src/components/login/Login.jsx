'use client'
import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // New state to track if OTP was sent
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    rememberMe: true,
    otp: "",
    newPassword: ""
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const loadingToast = toast.loading('Sending OTP...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        throw new Error(data.message || `Failed to send OTP with status ${response.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success('OTP sent successfully! Check your email.');
      
      // Switch to OTP verification step
      setOtpSent(true); // Set otpSent to true instead of using formData.otp

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to send OTP!');
      console.error("❌ OTP sending error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.otp || !formData.newPassword) {
      setError("Please enter OTP and new password");
      setLoading(false);
      return;
    }

    try {
      const loadingToast = toast.loading('Resetting password...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         
          otp: formData.otp,
          newpassword: formData.newPassword
        }),
        
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        throw new Error(data.message || `Password reset failed with status ${response.status}`);
      }

      toast.dismiss(loadingToast);
      toast.success('Password reset successfully! You can now login.');

      // Reset form and go back to login
      setForgotPassword(false);
      setOtpSent(false);
      setIsLogin(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        rememberMe: true,
        otp: "",
        newPassword: ""
      });

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to reset password!');
      console.error("❌ Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`;
      
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

      const loadingToast = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
       console.log("✅ Authentication response data:", data);
      if (!response.ok) {
        toast.dismiss(loadingToast);
        throw new Error(data.message || `Authentication failed with status ${response.status}`);
      }

      if (isLogin) {
        if (formData.rememberMe) {
          localStorage.setItem("authToken", data.token);
        } else {
          sessionStorage.setItem("authToken", data.token);
        }
        
        if (data.token && data.user) {
          login(data.user, data.token);
        } else {
          try {
            const userResponse = await fetch(`/api/user/me`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              login(userData, data.token);
            } else {
              throw new Error('Failed to fetch user data');
            }
          } catch (userError) {
            console.error('❌ Error fetching user data:', userError);
            toast.dismiss(loadingToast);
            toast.success('Login successful! Redirecting...');
            if (data.user.type === "admin"){
              router.push('/admin');
              return;
            }
            router.push('/');
            return;
          }
        }
        
        toast.dismiss(loadingToast);
        toast.success('Login successful! Redirecting...');
        
        setTimeout(() => {
          if (data.user.type === "admin"){
              router.push('/admin');
              return;
            }
          router.push('/');
          router.refresh();
        }, 500);
        
      } else {
        toast.dismiss(loadingToast);
        toast.success('Account created successfully! You can now login.');
        
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          rememberMe: false,
          otp: "",
          newPassword: ""
        });
      }

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Something went wrong!');
      console.error("❌ Authentication error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Email Input Step
  const renderForgotPasswordEmailStep = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#413329] mb-2 text-center">
        Reset Password
      </h2>
      <p className="text-[#413329]/70 text-center mb-8">
        Enter your email to receive OTP
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSendOtp} className="space-y-6">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending OTP..." : 'Send OTP'}
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setForgotPassword(false);
              setOtpSent(false);
              setError("");
            }}
            className="text-[#413329]/70 hover:text-[#413329] text-sm transition-colors duration-300"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );

  // Forgot Password - OTP and New Password Step
  const renderForgotPasswordOtpStep = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#413329] mb-2 text-center">
        Reset Password
      </h2>
      <p className="text-[#413329]/70 text-center mb-8">
        Enter OTP and new password
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-6">
        {/* OTP Field */}
        <div className="space-y-2">
          <label className="block text-[#413329] font-medium text-sm">
            OTP
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            placeholder="Enter OTP sent to your email"
            className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300"
            required
          />
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <label className="block text-[#413329] font-medium text-sm">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300 pr-12"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#413329]/60 hover:text-[#413329] transition-colors duration-300"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411M9.88 9.88l-3.41-3.41m9.02 9.02l3.411-3.411M9.88 9.88l6.41-6.41" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#413329] text-[#FFE2D6] hover:bg-[#FFE2D6] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Resetting..." : 'Reset Password'}
        </button>

        {/* Back to Email Step */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setError("");
            }}
            className="text-[#413329]/70 hover:text-[#413329] text-sm transition-colors duration-300"
          >
            Back to Email
          </button>
        </div>
      </form>
    </div>
  );

  // Regular Login/Signup Form
  const renderAuthForm = () => (
    <>
      <h2 className="text-3xl font-bold text-[#413329] mb-2 text-center">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-[#413329]/70 text-center mb-8">
        {isLogin ? 'Sign in to your account' : 'Join us today!'}
      </p>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-[#413329]/20 rounded-xl focus:border-[#413329] focus:outline-none transition-all duration-300 pr-12"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#413329]/60 hover:text-[#413329] transition-colors duration-300"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m9.02 9.02l3.411 3.411M9.88 9.88l-3.41-3.41m9.02 9.02l3.411-3.411M9.88 9.88l6.41-6.41" />
                </svg>
              )}
            </button>
          </div>
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
          <div className="flex items-center justify-between">
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
            
            {/* Forgot Password Link - Only for Login */}
            {isLogin && (
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-[#413329]/70 hover:text-[#413329] text-sm transition-colors duration-300"
              >
                Forgot your password?
              </button>
            )}
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#413329',
            color: '#FFE2D6',
            borderRadius: '12px',
            fontWeight: '500',
          },
          success: {
            duration: 5000,
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Toggle Switch - Only show for regular auth, not forgot password */}
          {!forgotPassword && (
            <div className="flex bg-[#413329]">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  isLogin
                  ? 'text-[#FFE2D6] hover:bg-[#413329]/80'
                  : 'bg-[#FFE2D6] text-[#413329]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                  !isLogin
                    ? 'text-[#FFE2D6] hover:bg-[#413329]/80'
                  : 'bg-[#FFE2D6] text-[#413329]'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            {forgotPassword ? (
              // Forgot Password Flow - Fixed conditional rendering
              otpSent ? renderForgotPasswordOtpStep() : renderForgotPasswordEmailStep()
            ) : (
              // Regular Login/Signup Flow
              renderAuthForm()
            )}
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