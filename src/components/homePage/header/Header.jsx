'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import useUserStore from '@/store/useStore'
import { Link } from 'react-scroll'
import Image from 'next/image'

const Header = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const { user: authUser, isAuthenticated, logout } = useAuth()
  const { user: storeUser, loading } = useUserStore()

  const user = authUser || storeUser

  const [activeTab, setActiveTab] = useState("home")
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (path, tabName) => {
    router.push(path)
    setActiveTab(tabName)
    setIsMobileMenuOpen(false)
  }

  const handleScrollNavigation = (section, tabName) => {
    setActiveTab(tabName)
    setIsMobileMenuOpen(false)
    // If we're not on the home page, navigate to home first then scroll
    if (window.location.pathname !== '/') {
      router.push('/')
      // Use setTimeout to allow navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
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
      <div className="flex justify-around bg-[#FDBD99] p-4 md:p-6 items-center relative h-20">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer">
    <Image
      src="/logo.png"
      alt="Company Logo"
      width={80}
      height={80}
      priority
      className="transform scale-150"
      onClick={()=>router.push('/')}
      
    />
  </div>
  

        
        
        {/* Mobile Login Button - Visible only on mobile */}
        <div className="md:hidden">
          {user ? (
            <div className="flex font-bold items-center space-x-2">
              <p className="py-2 px-4 text-sm">Welcome, {user.name}</p>
            </div>
          ) : (
            <div 
              onClick={() => handleNavigation('/login', 'login')} 
              className="border border-[#413329] py-2 px-6 hover:bg-[#413329] hover:text-amber-50 transform duration-200 cursor-pointer"
            >
              <button>Login</button>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-7">
          <li 
            onClick={() => handleNavigation('/', 'home')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer pb-1 ${
              activeTab === "home" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            Home
          </li>
          <li 
            className={`hover:scale-125 transform transition duration-300 cursor-pointer pb-1 ${
              activeTab === "about" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            <Link 
              to="about" 
              smooth={true} 
              duration={500} 
              offset={-80}
              onClick={() => handleScrollNavigation('about', 'about')}
              className="cursor-pointer"
            >
              About
            </Link>
          </li>
          <li 
            onClick={() => handleNavigation('/servicespage', 'services')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer pb-1 ${
              activeTab === "services" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            Service
          </li>
          <li 
            className={`hover:scale-125 transform transition duration-300 cursor-pointer pb-1 ${
              activeTab === "contact" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            <Link 
              to="contactus" 
              smooth={true} 
              duration={500} 
              offset={-80}
              onClick={() => handleScrollNavigation('contactus', 'contact')}
              className="cursor-pointer"
            >
              Contact US
            </Link>
          </li>
        </ul>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <p className="font-bold py-2 px-6">Welcome, {user.name}</p>
              <button 
                onClick={handleLogout}
                className="border border-[#413329] py-2 px-6 hover:bg-[#413329] hover:text-amber-50 transform duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div 
              onClick={() => handleNavigation('/login', 'login')} 
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
            onClick={() => handleNavigation('/', 'home')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer py-2 ${
              activeTab === "home" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            Home
          </li>
          <li 
            onClick={() => handleScrollNavigation('about', 'about')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer py-2 ${
              activeTab === "about" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            About
          </li>
          <li 
            onClick={() => handleNavigation('/servicespage', 'services')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer py-2 ${
              activeTab === "services" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            Service
          </li>
          <li 
            onClick={() => handleScrollNavigation('contactus', 'contact')}
            className={`hover:scale-125 transform transition duration-300 cursor-pointer py-2 ${
              activeTab === "contact" ? "border-b-2 border-[#413329]" : ""
            }`}
          >
            Contact US
          </li>
          
          {/* Mobile Auth Section in Menu */}
          {user && (
            <li className="pt-4 border-t border-[#413329] w-full text-center">
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