'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TestimonialForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    feedback: '',
    rating: 5,
    service: 'Other' // Default value as per schema
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customService, setCustomService] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Predefined services matching your schema enum
  const predefinedServices = [
    "Haircut",
    "Skin", 
    "Makeup",
    "Nails",
    "HairStyling",
    "Eyebrow",
    "Facial",
    "Other"
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleServiceSelect = (service) => {
    setFormData(prev => ({ ...prev, service }))
    setIsDropdownOpen(false)
    if (service !== 'Other') {
      setCustomService('')
    }
  }

  const handleCustomServiceChange = (e) => {
    const value = e.target.value
    setCustomService(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.clientName.trim() || !formData.feedback.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData = {
        clientName: formData.clientName.trim(),
        feedback: formData.feedback.trim(),
        rating: formData.rating,
        service: formData.service
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonial/createtestimonial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit testimonial')
      }

      const result = await response.json()
      
      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(submitData)
      }
      
      // Reset form
      setFormData({
        clientName: '',
        feedback: '',
        rating: 5,
        service: 'Other'
      })
      setCustomService('')
      setIsDropdownOpen(false)
      onClose()
      
    } catch (error) {
      console.error('Error submitting testimonial:', error)
      alert(error.message || 'Failed to submit testimonial. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <label key={i} className="cursor-pointer">
        <input
          type="radio"
          name="rating"
          value={i + 1}
          checked={rating === i + 1}
          onChange={handleChange}
          className="hidden"
        />
        <motion.span
          className={`text-2xl md:text-3xl ${
            i < rating ? "text-amber-400" : "text-gray-300"
          } hover:text-amber-300 transition-colors`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ★
        </motion.span>
      </label>
    ))
  }

  const getServiceDisplayName = (service) => {
    const displayNames = {
      'HairStyling': 'Hair Styling',
      'Eyebrow': 'Eyebrow Service',
      'Other': customService ? `Other: ${customService}` : 'Other'
    }
    return displayNames[service] || service
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 backdrop-blur-xl bg-black/30 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#413329]">Share Your Experience</h2>
              <p className="text-[#413329]/60 text-sm md:text-base mt-1">
                Tell us about your visit
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#413329] hover:text-[#FDBD99] text-2xl md:text-3xl font-bold transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-[#413329] mb-2 md:mb-3">
                Your Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDBD99] focus:border-transparent transition-all text-[#413329] placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            {/* Service Field - Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#413329] mb-2 md:mb-3">
                Service Received *
              </label>
              
              <motion.button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDBD99] focus:border-transparent transition-all text-[#413329] text-left flex justify-between items-center bg-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={formData.service ? "text-[#413329]" : "text-gray-400"}>
                  {formData.service ? getServiceDisplayName(formData.service) : "Select a service"}
                </span>
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.span>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {predefinedServices.map((service) => (
                      <motion.button
                        key={service}
                        type="button"
                        onClick={() => handleServiceSelect(service)}
                        className={`w-full px-4 py-3 text-left hover:bg-[#FDBD99]/10 transition-colors ${
                          formData.service === service ? 'bg-[#FDBD99]/20 text-[#413329]' : 'text-[#413329]'
                        }`}
                        whileHover={{ backgroundColor: "rgba(253, 189, 153, 0.1)" }}
                      >
                        {service === 'HairStyling' ? 'Hair Styling' : 
                         service === 'Eyebrow' ? 'Eyebrow Service' : service}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Service Input for "Other" */}
              {formData.service === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <label htmlFor="customService" className="block text-sm font-medium text-[#413329] mb-2">
                    Specify Your Service
                  </label>
                  <input
                    type="text"
                    id="customService"
                    value={customService}
                    onChange={handleCustomServiceChange}
                    placeholder="What service did you receive?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDBD99] focus:border-transparent transition-all text-[#413329] placeholder-gray-400"
                  />
                </motion.div>
              )}
            </div>

            {/* Rating Field */}
            <div>
              <label className="block text-sm font-medium text-[#413329] mb-2 md:mb-3">
                Your Rating *
              </label>
              <div className="flex justify-center gap-1 md:gap-2 mb-2">
                {renderStars(formData.rating)}
              </div>
              <div className="text-center text-sm text-gray-500">
                {formData.rating} out of 5 stars
              </div>
            </div>

            {/* Feedback Field */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-[#413329] mb-2 md:mb-3">
                Your Feedback *
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDBD99] focus:border-transparent transition-all resize-none text-[#413329] placeholder-gray-400"
                placeholder="Share your experience with us... What did you love? How can we improve?"
              />
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 md:py-4 border-2 border-[#413329] text-[#413329] rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 md:py-4 bg-[#413329] text-white rounded-xl font-medium hover:bg-[#2a211a] disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`relative z-10 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                  Submit Review
                </span>
                {isSubmitting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>

            {/* Privacy Note */}
            <motion.p 
              className="text-xs text-center text-gray-500 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your feedback helps us improve our services. We appreciate your honest review!
            </motion.p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TestimonialForm