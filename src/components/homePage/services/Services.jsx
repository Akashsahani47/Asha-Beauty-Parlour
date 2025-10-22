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
  const { user: authUser, logout } = useAuth()
  const { user: storeUser } = useUserStore()
  
  const user = authUser || storeUser

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileSidebarOpen])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    setIsMobileSidebarOpen(false)
    router.push('/')
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/orders", label: "Orders", icon: "📦" },
    { href: "/services", label: "Services", icon: "✨" },
    { href: "/customers", label: "Customers", icon: "👥" },
    { href: "/appointments", label: "Appointments", icon: "📅" },
    { href: "/staff", label: "Staff", icon: "💼" },
    { href: "/inventory", label: "Inventory", icon: "📋" },
    { href: "/reports", label: "Reports", icon: "📈" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ]

  // Fixed active link logic
  const isActiveLink = (href) => {
    // Don't highlight anything on home route
    if (pathname === '/') return false
    
    // For exact matches
    if (pathname === href) return true
    
    // For nested routes (e.g., /dashboard/analytics should highlight dashboard)
    if (pathname.startsWith(href + '/')) return true
    
    return false
  }

  const getUserInitials = (name) => {
    if (!name) return "AB"
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleHomeClick = () => {
    setIsMobileSidebarOpen(false)
    router.push('/')
  }

  // Don't show sidebar on home page
  if (pathname === '/') {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button - Only show when sidebar is not visible */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#413329] rounded-lg shadow-md hover:bg-[#2A211A] transition-all duration-200"
        onClick={() => setIsMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <div className="flex flex-col justify-center items-center w-5 h-5">
          <span className="bg-white block h-0.5 w-5 rounded-sm mb-1"></span>
          <span className="bg-white block h-0.5 w-5 rounded-sm mb-1"></span>
          <span className="bg-white block h-0.5 w-5 rounded-sm"></span>
        </div>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-80 bg-[#FFF5F0] z-50 transform transition-all duration-300 ease-in-out
        border-r border-[#FDBD99] shadow-xl
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#FDBD99] bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div 
                className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer border border-[#FDBD99]"
                onClick={handleHomeClick}
              >
                <Image
                  src="/logo.png"
                  alt="ASHA Beauty Parlour Logo"
                  width={48}
                  height={48}
                  priority
                  className="rounded-lg object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#413329]">
                  ASHA Beauty
                </h2>
                <p className="text-xs text-[#413329] opacity-60">Management System</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 hover:bg-[#FFE2D6] rounded-lg transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <span className="text-lg text-[#413329]">×</span>
            </button>
          </div>
          
          {/* User Info */}
          {user && (
            <div className="mt-4 p-3 bg-[#FFE2D6] rounded-lg border border-[#FDBD99]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-[#FDBD99]">
                  <span className="text-[#413329] font-semibold text-sm">
                    {getUserInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#413329] truncate text-sm">{user.name}</p>
                  <p className="text-xs text-[#413329] opacity-70 truncate">{user.email}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = isActiveLink(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                      border border-transparent
                      ${isActive 
                        ? 'bg-[#413329] text-white shadow-sm' 
                        : 'text-[#413329] hover:bg-[#FFE2D6] hover:border-[#FDBD99] bg-white'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Logout Button */}
          {user && (
            <div className="mt-6 pt-4 border-t border-[#FDBD99]">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 w-full text-[#413329] hover:bg-red-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-red-200 bg-white"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#FDBD99] bg-white">
          <div className="text-center">
            <div className="text-sm text-[#413329] font-medium">
              ASHA Beauty Parlour
            </div>
            <div className="text-xs text-[#413329] opacity-60 mt-1">
              Management System v2.1.0
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 bg-[#FFF5F0] min-h-screen sticky top-0 border-r border-[#FDBD99] shadow-sm">
        <div className="flex flex-col w-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#FDBD99] bg-white">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div 
                className="relative w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer border border-[#FDBD99]"
                onClick={handleHomeClick}
              >
                <Image
                  src="/logo.png"
                  alt="ASHA Beauty Parlour Logo"
                  width={48}
                  height={48}
                  priority
                  className="rounded-lg object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#413329]">
                  ASHA Beauty
                </h2>
                <p className="text-xs text-[#413329] opacity-60">Management System</p>
              </div>
            </div>
            
            {/* User Info */}
            {user && (
              <div className="mt-4 p-3 bg-[#FFE2D6] rounded-lg border border-[#FDBD99]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-[#FDBD99]">
                    <span className="text-[#413329] font-semibold text-sm">
                      {getUserInitials(user.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#413329] truncate text-sm">{user.name}</p>
                    <p className="text-xs text-[#413329] opacity-70 truncate">{user.email}</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = isActiveLink(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                        border border-transparent
                        ${isActive 
                          ? 'bg-[#413329] text-white shadow-sm' 
                          : 'text-[#413329] hover:bg-[#FFE2D6] hover:border-[#FDBD99] bg-white'
                        }
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Logout Button */}
            {user && (
              <div className="mt-6 pt-4 border-t border-[#FDBD99]">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 w-full text-[#413329] hover:bg-red-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-red-200 bg-white"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#FDBD99] bg-white">
            <div className="text-center">
              <div className="text-sm text-[#413329] font-medium">
                ASHA Beauty Parlour
              </div>
              <div className="text-xs text-[#413329] opacity-60 mt-1">
                Management System v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop for content shift */}
      {isMobileSidebarOpen && <div className="lg:hidden" />}
    </>
  )
}

export default Sidebar