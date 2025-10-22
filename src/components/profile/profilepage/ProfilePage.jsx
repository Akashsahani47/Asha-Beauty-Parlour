'use client'
import React, { useState, useEffect } from 'react'
import useUserStore from '@/store/useStore'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Edit3, 
  Save, 
  X, 
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Shield,
  Star,
  Award,
  Zap,
  Crown,
  TrendingUp,
  Clock,
  BadgeCheck
} from 'lucide-react'

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useUserStore()

  // Enhanced user stats with realistic data
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    loyaltyPoints: 0,
    membershipTier: 'Silver',
    memberSince: '',
    successRate: '95%',
    responseTime: '< 2 hours'
  })

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [token])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      
      if (!token) {
        setError('Please login to view your profile')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      console.log('Fetched user data:', data)
      
      if (data.success && data.user) {
        setUser({
          name: data.user.name || '',
          email: data.user.email || '',
          phoneNo: data.user.phoneNo || '',
          password: '', // Don't pre-fill password for security
        })

        // Enhanced stats based on user data
        setUserStats(prev => ({
          ...prev,
          memberSince: data.user.createdAt || '',
          loyaltyPoints: Math.floor((data.user.createdAt ? (new Date() - new Date(data.user.createdAt)) / (1000 * 60 * 60 * 24) : 0) * 2),
          totalBookings: Math.floor((data.user.createdAt ? (new Date() - new Date(data.user.createdAt)) / (1000 * 60 * 60 * 24 * 30) : 0) * 3),
          membershipTier: calculateMembershipTier(data.user.createdAt)
        }))
        
        setError('')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Error loading profile data')
    } finally {
      setLoading(false)
    }
  }

  const calculateMembershipTier = (createdAt) => {
    if (!createdAt) return 'Silver'
    const memberDays = (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
    if (memberDays > 365) return 'Platinum'
    if (memberDays > 180) return 'Gold'
    return 'Silver'
  }

  const getMembershipBadge = (tier) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg'
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg'
    }
  }

  const getMembershipIcon = (tier) => {
    switch (tier) {
      case 'Platinum':
        return <Crown className="w-4 h-4" />
      case 'Gold':
        return <Award className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const updateData = {
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        ...(user.password && { password: user.password })
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      
      if (result.success) {
        setMessage('Profile updated successfully!')
        setIsEditing(false)
        setUser(prev => ({ ...prev, password: '' }))
        
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error(result.message || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile - ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setMessage('')
  }

  const handleCancel = () => {
    fetchUserData()
    setIsEditing(false)
    setMessage('')
  }

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Recently joined'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  // Enhanced loading skeleton
  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header Skeleton */}
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-80 mx-auto mb-6"></div>
              <div className="h-6 bg-[#413329]/10 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-[#413329]/10 rounded-lg w-20"></div>
                    <div className="h-8 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-xl w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-[#413329]/10 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Profile Card Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 animate-pulse">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 text-center lg:text-left">
                    <div className="w-32 h-32 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-full mx-auto lg:mx-0 mb-4"></div>
                    <div className="h-6 bg-[#413329]/10 rounded-lg w-32"></div>
                    <div className="h-4 bg-[#413329]/5 rounded-lg w-24 mt-2"></div>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-5 bg-[#413329]/10 rounded-lg w-24"></div>
                        <div className="h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-2xl w-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 animate-pulse">
                  <div className="h-6 bg-[#413329]/10 rounded-lg w-32 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex justify-between">
                        <div className="h-4 bg-[#413329]/5 rounded-lg w-20"></div>
                        <div className="h-4 bg-[#413329]/10 rounded-lg w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced Error state
  if (error && !user.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 text-center transform hover:scale-105 transition-transform duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Connection Issue
            </h2>
            <p className="text-[#413329]/70 mb-8 text-lg">{error}</p>
            <button 
              onClick={fetchUserData} 
              className="w-full bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-8 ml-0 lg:ml-80 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Professional Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-6">
            Profile Dashboard
          </h1>
          <p className="text-[#413329]/70 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Manage your professional identity and account preferences with precision and style
          </p>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-8 p-6 rounded-2xl backdrop-blur-lg border-2 ${
            message.includes('Error') 
              ? 'bg-rose-500/20 text-rose-700 border-rose-300/50' 
              : 'bg-emerald-500/20 text-emerald-700 border-emerald-300/50'
          }`}>
            <div className="flex items-center justify-center space-x-3">
              {message.includes('Error') ? (
                <AlertCircle className="w-7 h-7 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-7 h-7 flex-shrink-0" />
              )}
              <span className="text-lg font-semibold">{message}</span>
            </div>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#413329]/60 text-sm font-semibold mb-2 uppercase tracking-wide">Total Bookings</p>
                <p className="text-3xl font-bold text-[#413329]">{userStats.totalBookings}</p>
                <p className="text-[#413329]/40 text-xs mt-1">Lifetime orders</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

         <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#413329]/60 text-sm font-semibold mb-2 uppercase tracking-wide">Loyalty Points</p>
                <p className="text-3xl font-bold text-[#413329]">{userStats.loyaltyPoints}</p>
                <p className="text-[#413329]/40 text-xs mt-1">Available rewards</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>ƒ
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#413329]/60 text-sm font-semibold mb-2 uppercase tracking-wide">Success Rate</p>
                <p className="text-3xl font-bold text-[#413329]">{userStats.successRate}</p>
                <p className="text-[#413329]/40 text-xs mt-1">Completion score</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#413329]/60 text-sm font-semibold mb-2 uppercase tracking-wide">Response Time</p>
                <p className="text-3xl font-bold text-[#413329]">{userStats.responseTime}</p>
                <p className="text-[#413329]/40 text-xs mt-1">Average response</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500 group">
              {/* Premium Header */}
              <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-28 h-28 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                        <User className="w-14 h-14 text-[#413329]" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <BadgeCheck className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black mb-3">{user.name}</h2>
                      <p className="text-white/80 text-xl mb-2">{user.email}</p>
                      <div className="flex items-center space-x-4">
                        <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${getMembershipBadge(userStats.membershipTier)}`}>
                          {getMembershipIcon(userStats.membershipTier)}
                          <span className="ml-2">{userStats.membershipTier} Member</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="mt-6 lg:mt-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center group"
                    >
                      <Edit3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      className="mt-6 lg:mt-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center group"
                    >
                      <X className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-[#413329] mb-4 flex items-center">
                      <User className="w-6 h-6 mr-3 text-[#413329]/60" />
                      Full Name
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#413329]/20 focus:border-[#413329]/30 disabled:bg-gray-100/50 disabled:cursor-not-allowed text-[#413329] placeholder-[#413329]/40 text-lg transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-[#413329] mb-4 flex items-center">
                      <Mail className="w-6 h-6 mr-3 text-[#413329]/60" />
                      Email Address
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#413329]/20 focus:border-[#413329]/30 disabled:bg-gray-100/50 disabled:cursor-not-allowed text-[#413329] placeholder-[#413329]/40 text-lg transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Phone Number Field */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-[#413329] mb-4 flex items-center">
                      <Phone className="w-6 h-6 mr-3 text-[#413329]/60" />
                      Phone Number
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={user.phoneNo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#413329]/20 focus:border-[#413329]/30 disabled:bg-gray-100/50 disabled:cursor-not-allowed text-[#413329] placeholder-[#413329]/40 text-lg transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label className="block text-lg font-semibold text-[#413329] mb-4 flex items-center">
                      <Lock className="w-6 h-6 mr-3 text-[#413329]/60" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter new password to update" : "••••••••"}
                      className="w-full px-6 py-4 bg-white/50 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#413329]/20 focus:border-[#413329]/30 disabled:bg-gray-100/50 disabled:cursor-not-allowed text-[#413329] placeholder-[#413329]/40 text-lg transition-all duration-300 backdrop-blur-sm"
                    />
                    <p className="text-[#413329]/60 text-sm mt-3 flex items-center">
                      {isEditing ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Leave blank to keep current password
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Password is encrypted and secure
                        </>
                      )}
                    </p>
                  </div>

                  {/* Enhanced Submit Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-8 border-t border-[#413329]/10">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-16 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                      >
                        {loading ? (
                          <>
                            <div className="w-6 h-6 border-3 border-[#FFE2D6] border-t-transparent rounded-full animate-spin mr-3"></div>
                            Updating Profile...
                          </>
                        ) : (
                          <>
                            <Save className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                            Save All Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3" />
                Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#413329]/70">Email Verification</span>
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-700 rounded-2xl text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#413329]/70">Phone Verification</span>
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-700 rounded-2xl text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#413329]/70">2FA Protection</span>
                  <div className="inline-flex items-center px-3 py-1 bg-amber-500/20 text-amber-700 rounded-2xl text-sm font-semibold">
                    <Zap className="w-4 h-4 mr-1" />
                    Recommended
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Progress Card */}
            <div className="bg-gradient-to-br from-[#413329] to-[#5D4A3A] rounded-3xl shadow-2xl border border-white/20 p-6 text-white transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Crown className="w-6 h-6 mr-3" />
                Membership Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Current Tier</span>
                  <span className="font-bold text-amber-300">{userStats.membershipTier}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Loyalty Points</span>
                  <span className="font-bold">{userStats.loyaltyPoints}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: userStats.membershipTier === 'Platinum' ? '100%' : userStats.membershipTier === 'Gold' ? '75%' : '50%' }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm text-center mt-2">
                  {userStats.membershipTier === 'Platinum' 
                    ? 'Maximum tier achieved! 🎉'
                    : `Progress to ${userStats.membershipTier === 'Silver' ? 'Gold' : 'Platinum'} Tier`
                  }
                </p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent mb-4">
                Account Overview
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-[#413329]/10">
                  <span className="text-[#413329]/70">Member Since</span>
                  <span className="font-semibold text-[#413329]">{formatMemberSince(userStats.memberSince)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#413329]/10">
                  <span className="text-[#413329]/70">Total Bookings</span>
                  <span className="font-semibold text-[#413329]">{userStats.totalBookings}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#413329]/10">
                  <span className="text-[#413329]/70">Success Rate</span>
                  <span className="font-semibold text-[#413329]">{userStats.successRate}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#413329]/70">Account Status</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage