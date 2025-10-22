'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import useUserStore from '@/store/useStore'

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const { user: authUser, logout } = useAuth()
  const { user: storeUser } = useUserStore()
  
  const user = authUser || storeUser

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Set active tab based on current path
  useEffect(() => {
    const currentTab = menuItems.find(item => 
      pathname === item.href || pathname.startsWith(item.href + '/')
    )?.href || '';
    setActiveTab(currentTab);
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
  }, [isMobileSidebarOpen])

  const handleLogout = () => {
    // localStorage.removeItem('authToken')
    // sessionStorage.removeItem('authToken')
    // setIsMobileSidebarOpen(false)
  }

  const menuItems = [
    //{ href: "/profile/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/profile/profilepage", label: "Profile", icon: "👤" },
    { href: "/profile/order", label: "Orders", icon: "📦" },
    { href: "/profile/appointments", label: "Bride Appointments", icon: "📅" },
    { href: "/profile/staff", label: "Staff", icon: "👩‍💼" },
  ]

  const isActiveLink = (href) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const getUserInitials = (name) => {
    if (!name) return "AS"
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleHomeClick = () => {
    setActiveTab('home')
    setIsMobileSidebarOpen(false)
    router.push('/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-6 left-4 z-50 p-3  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group backdrop-blur-sm"
        onClick={() => setIsMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <div className="flex flex-col justify-center items-center w-6 h-6">
          <span className="bg-black block h-0.5 w-6 rounded-sm mb-1.5 group-hover:bg-[#2A211A] transition-all duration-300 transform group-hover:rotate-45 group-hover:translate-y-2"></span>
          <span className="bg-black block h-0.5 w-6 rounded-sm mb-1.5 group-hover:opacity-0 transition-all duration-300"></span>
          <span className="bg-black block h-0.5 w-6 rounded-sm group-hover:bg-[#2A211A] transition-all duration-300 transform group-hover:-rotate-45 group-hover:-translate-y-2"></span>
        </div>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#FFF5F0] to-[#FFE2D6] z-50 transform transition-all duration-500 ease-out
        border-r border-[#FDBD99] shadow-2xl
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#FDBD99] bg-gradient-to-r from-[#FFE2D6] to-[#FFF5F0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div 
                className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 border border-[#FDBD99]"
                onClick={handleHomeClick}
              >
                <Image
                  src="/logo.png"
                  alt="ASHA Beauty Parlour Logo"
                  width={56}
                  height={56}
                  priority
                  className="rounded-xl object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#413329] bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] bg-clip-text text-transparent">
                  ASHA Beauty
                </h2>
                <p className="text-sm text-[#413329] opacity-70">Parlour Management</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-3 hover:bg-[#FDBD99] rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-sm"
              aria-label="Close sidebar"
            >
              <span className="text-2xl text-[#413329] font-light">✕</span>
            </button>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[#FDBD99] to-[#FF9B70] rounded-2xl shadow-lg border border-[#FDAD80]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-[#FFF5F0] rounded-2xl flex items-center justify-center shadow-lg border border-[#FDBD99]">
                  <span className="text-[#FF6B35] font-bold text-sm">
                    {getUserInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-shadow-sm">{user.name}</p>
                  <p className="text-sm text-white opacity-90 truncate">{user.email}</p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = isActiveLink(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300
                      border-2 border-transparent hover:border-[#FF9B70] relative overflow-hidden
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#FF9B70] to-[#FDAD80] text-white font-semibold shadow-lg scale-[1.02] border-[#FF6B35]' 
                        : 'text-[#413329] hover:bg-[#FDBD99] hover:bg-opacity-30 hover:shadow-md bg-white bg-opacity-50'
                      }
                    `}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-white rounded-r-full shadow-sm"></div>
                    )}
                    
                    <span className={`
                      text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
                      ${isActive ? 'scale-110 filter drop-shadow-sm' : ''}
                    `}>{item.icon}</span>
                    <span className="font-medium text-[15px]">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isActive ? 'opacity-10' : ''}`}></div>
                  </Link>
                </li>
              )
            })}
          </ul>

         
          
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#FDBD99] border-opacity-50 bg-white bg-opacity-30 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-sm text-[#413329] opacity-70 font-medium">
              ASHA Beauty Parlour
            </div>
            <div className="text-xs text-[#413329] opacity-50 mt-1">
              v2.1.0 • Premium Beauty Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 bg-gradient-to-b from-[#FFF5F0] to-[#FFE2D6] min-h-screen fixed top-0 border-r border-[#FDBD99] shadow-2xl">
        <div className="flex flex-col w-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#FDBD99] bg-gradient-to-r from-[#FFE2D6] to-[#FFF5F0]">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div 
                className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 border border-[#FDBD99]"
                onClick={handleHomeClick}
              >
                <Image
                  src="/logo.png"
                  alt="ASHA Beauty Parlour Logo"
                  width={56}
                  height={56}
                  priority
                  className="rounded-xl object-contain p-1"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#413329] bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] bg-clip-text text-transparent">
                  ASHA Beauty
                </h2>
                <p className="text-sm text-[#413329] opacity-70">Parlour Management</p>
              </div>
            </div>
            
            {/* User Info */}
            {user && (
              <div className="mt-6 p-4 bg-gradient-to-r from-[#FDBD99] to-[#FF9B70] rounded-2xl shadow-lg border border-[#FDAD80]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-[#FFF5F0] rounded-2xl flex items-center justify-center shadow-lg border border-[#FDBD99]">
                    <span className="text-[#FF6B35] font-bold text-sm">
                      {getUserInitials(user.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-shadow-sm">{user.name}</p>
                    <p className="text-sm text-white opacity-90 truncate">{user.email}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex-1">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const isActive = isActiveLink(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300
                        border-2 border-transparent hover:border-[#FF9B70] relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#FF9B70] to-[#FDAD80] text-white font-semibold shadow-lg scale-[1.02] border-[#FF6B35]' 
                          : 'text-[#413329] hover:bg-[#FDBD99] hover:bg-opacity-30 hover:shadow-md bg-white bg-opacity-50'
                        }
                      `}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-white rounded-r-full shadow-sm"></div>
                      )}
                      
                      <span className={`
                        text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
                        ${isActive ? 'scale-110 filter drop-shadow-sm' : ''}
                      `}>{item.icon}</span>
                      <span className="font-medium text-[15px]">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"></div>
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isActive ? 'opacity-10' : ''}`}></div>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Logout Button */}
            
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#FDBD99] border-opacity-50 bg-white bg-opacity-30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-sm text-[#413329] opacity-70 font-medium">
                ASHA Beauty Parlour
              </div>
              <div className="text-xs text-[#413329] opacity-50 mt-1">
                v2.1.0 • Premium Beauty Solutions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop for content shift */}
      {isMobileSidebarOpen && <div className="lg:hidden" />}

      {/* Custom styles for text shadow */}
      <style jsx global>{`
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  )
}

export default Sidebar