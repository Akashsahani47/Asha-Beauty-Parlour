'use client'
import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Eye,
  Star,
  MessageCircle,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter } from 'next/navigation'

const Reviews = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('testimonials') // 'testimonials' or 'reviews'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { token } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      fetchTestimonials()
    }
  }, [token])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonial/show`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to fetch testimonials')
      
      const data = await response.json()
      console.log('Fetched testimonials:', data)
      
      // Handle different response formats
      let testimonialsData = []
      if (Array.isArray(data)) {
        testimonialsData = data
      } else if (data.testimonials && Array.isArray(data.testimonials)) {
        testimonialsData = data.testimonials
      } else if (data.data && Array.isArray(data.data)) {
        testimonialsData = data.data
      } else if (data.success && Array.isArray(data.testimonials)) {
        testimonialsData = data.testimonials
      }
      
      setTestimonials(testimonialsData || [])
    } catch (error) {
      setError(error.message)
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTestimonial = async (testimonialId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonial/delete/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to delete testimonial')
      
      // Remove testimonial from state
      setTestimonials(prev => prev.filter(testimonial => testimonial._id !== testimonialId))
      setShowDeleteConfirm(null)
    } catch (error) {
      setError(error.message)
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Fallback for name field
  )

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'string' ? parseInt(rating) : rating
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 lg:w-4 lg:h-4 ${
          i < numericRating ? "text-amber-400 fill-amber-400" : "text-gray-300"
        }`}
      />
    ))
  }

  const getServiceDisplayName = (service) => {
    const displayNames = {
      'HairStyling': 'Hair Styling',
      'Eyebrow': 'Eyebrow Service',
      'Skin': 'Skin Care',
      'Makeup': 'Makeup',
      'Nails': 'Nail Service',
      'Haircut': 'Haircut',
      'Facial': 'Facial',
      'Other': 'Other Service'
    }
    return displayNames[service] || service || 'General Service'
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 lg:px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-6 lg:mb-12">
            <div className="animate-pulse">
              <div className="h-12 lg:h-16 bg-gradient-to-r from-[#413329]/20 to-[#413329]/10 rounded-2xl w-64 lg:w-80 mx-auto mb-4 lg:mb-6"></div>
              <div className="h-4 lg:h-6 bg-[#413329]/10 rounded-lg w-72 lg:w-96 mx-auto"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 animate-pulse">
                <div className="h-6 lg:h-8 bg-[#413329]/10 rounded-lg mb-2"></div>
                <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Search Skeleton */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8 animate-pulse">
            <div className="h-12 lg:h-14 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-2xl"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-3 lg:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-lg border border-white/40 p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#413329]/10 rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 lg:h-5 bg-[#413329]/10 rounded-lg w-3/4"></div>
                    <div className="h-3 lg:h-4 bg-[#413329]/5 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-4">
        
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Testimonials & Reviews
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-lg px-2">
            Manage and view all customer testimonials and reviews
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-rose-500/20 text-rose-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-center space-y-3 lg:space-y-0 lg:space-x-3">
              <div className="flex items-center space-x-2 justify-center">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                <span className="text-base lg:text-lg font-semibold text-center">{error}</span>
              </div>
              <button 
                onClick={fetchTestimonials} 
                className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors text-sm lg:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {testimonials.length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">
              Total Testimonials
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <div className="text-xl lg:text-2xl font-bold text-[#413329]">
              {testimonials.filter(t => t.rating === 5 || t.rating === '5').length}
            </div>
            <div className="text-[#413329]/60 text-xs lg:text-sm">
              5 Star Reviews
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg border border-white/40 p-3 lg:p-4 text-center">
            <button
              onClick={fetchTestimonials}
              className="bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-3 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full text-xs lg:text-sm"
            >
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search - Mobile Optimized */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#413329]/40 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search testimonials by name, feedback, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Testimonials Content */}
        <>
          {/* Mobile Testimonials List */}
          <div className="lg:hidden">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-4 py-3 text-white">
                <h2 className="text-lg font-bold">All Testimonials ({filteredTestimonials.length})</h2>
              </div>
            </div>

            {filteredTestimonials.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 p-6 text-center">
                <MessageCircle className="w-12 h-12 text-[#413329]/40 mx-auto mb-4" />
                <p className="text-[#413329]/60 text-base">
                  {testimonials.length === 0 ? 'No testimonials found' : 'No testimonials matching your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTestimonials.map((testimonial) => (
                  <div key={testimonial._id} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-4 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#413329] text-base">
                          {testimonial.clientName || testimonial.name || 'Anonymous Customer'}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-[#413329]/60 text-sm">
                            {getServiceDisplayName(testimonial.service)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    
                    <p className="text-[#413329]/70 text-sm mb-3 italic">
                      "{testimonial.feedback || testimonial.review || 'No feedback provided'}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#413329]/10">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#413329]/60" />
                        <span className="text-[#413329]/60 text-xs">
                          {formatDate(testimonial.createdAt || testimonial.date)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setShowDeleteConfirm(testimonial._id)}
                        className="bg-rose-500 text-white p-2 rounded-xl hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Testimonials Table */}
          <div className="hidden lg:block bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            <div className="bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] px-6 py-4 text-white">
              <h2 className="text-xl font-bold">All Testimonials ({filteredTestimonials.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#413329]/10">
                    <th className="text-left p-4 font-semibold text-[#413329]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#413329]">Service</th>
                    <th className="text-left p-4 font-semibold text-[#413329]">Rating</th>
                    <th className="text-left p-4 font-semibold text-[#413329]">Feedback</th>
                    <th className="text-left p-4 font-semibold text-[#413329]">Date</th>
                    <th className="text-left p-4 font-semibold text-[#413329]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#413329]/60">
                        {testimonials.length === 0 ? 'No testimonials found' : 'No testimonials matching your search'}
                      </td>
                    </tr>
                  ) : (
                    filteredTestimonials.map((testimonial) => (
                      <tr key={testimonial._id} className="border-b border-[#413329]/5 hover:bg-white/50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-[#413329]">
                            {testimonial.clientName || testimonial.name || 'Anonymous Customer'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-[#413329]/60">
                            {getServiceDisplayName(testimonial.service)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(testimonial.rating)}
                            <span className="text-sm text-[#413329]/60 ml-2">({testimonial.rating})</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-[#413329]/70 italic max-w-xs">
                            "{testimonial.feedback || testimonial.review || 'No feedback provided'}"
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-[#413329]/60">
                            {formatDate(testimonial.createdAt || testimonial.date)}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setShowDeleteConfirm(testimonial._id)}
                            className="bg-rose-500 text-white px-4 py-2 rounded-2xl hover:bg-rose-600 transition-colors flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-[#413329] mb-2">Delete Testimonial</h3>
                <p className="text-[#413329]/70 mb-6">
                  Are you sure you want to delete this testimonial? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTestimonial(showDeleteConfirm)}
                    className="flex-1 bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews