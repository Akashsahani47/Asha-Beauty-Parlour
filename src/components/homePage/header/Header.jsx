'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import useUserStore from '@/store/useStore'

const Header = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Use both if needed, but typically you'd use one
  const { user: authUser, isAuthenticated, logout } = useAuth()
  const { user: storeUser, loading } = useUserStore()

  // Prefer auth user from context, fallback to store user
  const user = authUser || storeUser

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (path) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    setIsMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  // Show loading state if needed
  if (loading) {
    return (
      <div className="flex justify-around bg-[#FFE2D6] p-4 md:p-6 items-center">
        <span className="font-bold text-2xl">ASHA</span>
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-around bg-[#FFE2D6] p-4 md:p-6 items-center relative">
        {/* Logo */}
        <span 
          onClick={() => router.push('/')} 
          className="font-bold text-2xl animate-bounce cursor-pointer"
        >
          ASHA
        </span>
        
        {/* Mobile Login Button - Visible only on mobile */}
        <div className="md:hidden">
          {user ? (
            <div className="flex font-bold items-center space-x-2">
              <p className=" py-2 px-4 text-sm">Welcome, {user.name}</p>
             
            </div>
          ) : (
            <div 
              onClick={() => handleNavigation('/login')} 
              className="border border-[#413329] py-2 px-6 hover:bg-[#413329] hover:text-amber-50 transform duration-200 cursor-pointer"
            >
              <button>Login</button>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-7">
          <li 
            onClick={() => handleNavigation('/')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer"
          >
            Home
          </li>
          <li 
            onClick={() => handleNavigation('/about')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer"
          >
            About
          </li>
          <li 
            onClick={() => handleNavigation('/service')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer"
          >
            Service
          </li>
          <li 
            onClick={() => handleNavigation('/contact')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer"
          >
            Contact US
          </li>
        </ul>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <p className=" font-bold  py-2 px-6">Welcome, {user.name}</p>
              <button 
                onClick={handleLogout}
                className="border border-[#413329] py-2 px-6 hover:bg-[#413329] hover:text-amber-50 transform duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div 
              onClick={() => handleNavigation('/login')} 
              className="border border-[#413329] py-2 px-9 hover:bg-[#413329] hover:text-amber-50 transform duration-200 cursor-pointer"
            >
              <button>Login</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`bg-[#413329] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-[#413329] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-1 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-[#413329] block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`bg-[#FFE2D6] md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="flex flex-col items-center py-4 space-y-4">
          <li 
            onClick={() => handleNavigation('/')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer py-2"
          >
            Home
          </li>
          <li 
            onClick={() => handleNavigation('/about')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer py-2"
          >
            About
          </li>
          <li 
            onClick={() => handleNavigation('/service')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer py-2"
          >
            Service
          </li>
          <li 
            onClick={() => handleNavigation('/contact')}
            className="hover:scale-125 transform transition duration-300 cursor-pointer py-2"
          >
            Contact US
          </li>
          
          {/* Mobile Auth Section in Menu */}
          {user && (
            <li className="pt-  border-[#413329] w-full text-center">
              <button 
                onClick={handleLogout}
                className="text-red-600 font-bold hover:text-red-800 transform duration-200"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export default Header