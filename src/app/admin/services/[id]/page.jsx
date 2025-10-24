'use client'
import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Save, 
  X, 
  Upload, 
  IndianRupee,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import useUserStore from '@/store/useStore'
import { useRouter, useParams } from 'next/navigation'

const EditService = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    staff: [],
    isActive: true,
    images: []
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useUserStore()
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id

  useEffect(() => {
    fetchService()
  }, [serviceId, token])

  const fetchService = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) throw new Error('Failed to fetch service')
      
      const data = await response.json()
      if (data.success) {
        setFormData(data.service || data.data)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update service')
      
      const data = await response.json()
      if (data.success) {
        router.push('/admin/services')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Hair', 'Skin', 'Makeup', 'Nails', 'Spa', 'Bridal', 'Other']

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-3 lg:px-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-8 animate-pulse">
            <div className="h-8 bg-[#413329]/10 rounded-lg w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-[#413329]/10 rounded-lg w-32"></div>
                  <div className="h-12 bg-gradient-to-r from-[#413329]/10 to-[#413329]/5 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#FDBD99] to-[#FAF3EB] py-4 lg:py-8 ml-0 lg:ml-80 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-3 lg:px-4">
        
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#413329] to-[#5D4A3A] rounded-2xl lg:rounded-3xl shadow-2xl mb-4 lg:mb-6">
            <Package className="w-8 h-8 lg:w-10 lg:h-10 text-[#FFE2D6]" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-[#413329] via-[#5D4A3A] to-[#413329] bg-clip-text text-transparent mb-2 lg:mb-4">
            Edit Service
          </h1>
          <p className="text-[#413329]/70 text-sm lg:text-lg px-2">
            Update your beauty service details
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-rose-500/20 text-rose-700 rounded-xl lg:rounded-2xl backdrop-blur-lg border-2 border-rose-300/50">
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
              <span className="text-base lg:text-lg font-semibold">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 p-4 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Service Name */}
              <div className="lg:col-span-2">
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4 flex items-center">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-[#413329]/60" />
                  Service Name
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-base lg:text-lg transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter service name"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4">
                  Description
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-base lg:text-lg transition-all duration-300 backdrop-blur-sm resize-none"
                  placeholder="Describe the service in detail..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4 flex items-center">
                  <IndianRupee className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-[#413329]/60" />
                  Price
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-base lg:text-lg transition-all duration-300 backdrop-blur-sm"
                  placeholder="0.00"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4 flex items-center">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 text-[#413329]/60" />
                  Duration (minutes)
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] placeholder-[#413329]/40 text-base lg:text-lg transition-all duration-300 backdrop-blur-sm"
                  placeholder="60"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4">
                  Category
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#413329]/20 focus:border-[#413329]/30 text-[#413329] text-base lg:text-lg transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-base lg:text-lg font-semibold text-[#413329] mb-3 lg:mb-4">
                  Status
                </label>
                <div className="flex items-center space-x-3 p-3 lg:p-4 bg-white/50 border-2 border-white/60 rounded-xl lg:rounded-2xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#413329] rounded focus:ring-[#413329]/20"
                  />
                  <span className="text-base lg:text-lg text-[#413329]">Active Service</span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 pt-6 lg:pt-8 border-t border-[#413329]/10">
              <button
                type="button"
                onClick={() => router.push('/admin/services')}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-white/50 border-2 border-[#413329]/20 text-[#413329] rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center text-base lg:text-lg"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] hover:from-[#FFE2D6] hover:to-[#FDBD99] hover:text-[#413329] border-2 border-[#413329] px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base lg:text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 lg:w-6 lg:h-6 border-3 border-[#FFE2D6] border-t-transparent rounded-full animate-spin mr-2 lg:mr-3"></div>
                    Updating Service...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                    <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                    Update Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditService