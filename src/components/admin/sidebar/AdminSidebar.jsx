'use client'
import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User,
  Star,
  BarChart3,
  Package,
  CreditCard,
  MessageSquare,
  Shield
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      active: pathname === '/admin'
    },
    {
      name: 'Bookings',
      icon: Calendar,
      path: '/admin/Booking',
      active: pathname === '/admin/Booking'
    },
    {
      name: 'Services',
      icon: Package,
      path: '/admin/services',
      active: pathname === '/admin/services'
    },
    {
      name: 'Customers',
      icon: Users,
      path: '/admin/customer',
      active: pathname === '/admin/customer'
    },
    {
      name: 'Staff',
      icon: User,
      path: '/admin/staff',
      active: pathname === '/admin/staff'
    },
    {
      name: 'Payments',
      icon: CreditCard,
      path: '/admin/payments',
      active: pathname === '/admin/payments'
    },
    {
      name: 'Reviews',
      icon: Star,
      path: '/admin/reviews',
      active: pathname === '/admin/reviews'
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
      active: pathname === '/admin/messages'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      active: pathname === '/admin/analytics'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      active: pathname === '/admin/settings'
    }
  ]

  const handleNavigation = (path) => {
    router.push(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 bg-gradient-to-br from-[#413329] to-[#5D4A3A] text-[#FFE2D6] p-3 rounded-2xl shadow-2xl border-2 border-white/20 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
  fixed top-0 left-0 h-full bg-gradient-to-b from-[#FFF9F5] to-[#FAF3EB] border-r border-[#413329]/10 
  shadow-2xl z-50 transition-all duration-500 transform
  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
  lg:translate-x-0 lg:fixed lg:z-50  // ← Changed to lg:fixed
  w-80
`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b  border-[#413329]/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#413329] to-[#5D4A3A] rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
              <Shield onClick={()=>router.push("/")} className=" cursor-pointer w-6 h-6 text-[#FFE2D6]" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#413329] to-[#5D4A3A] bg-clip-text text-transparent">
                Admin
              </h1>
              <p className="text-[#413329]/60 text-sm">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300
                  ${item.active 
                    ? 'bg-gradient-to-r from-[#413329] to-[#5D4A3A] text-[#FFE2D6] shadow-lg transform scale-105 border border-white/20' 
                    : 'text-[#413329] hover:bg-white/80 hover:shadow-md hover:scale-105 hover:border hover:border-[#413329]/10'
                  }
                  group relative overflow-hidden
                `}
              >
                {/* Active indicator */}
                {item.active && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#FFE2D6] rounded-r-full" />
                )}
                
                <div className={`
                  p-2 rounded-xl transition-all duration-300 relative z-10
                  ${item.active 
                    ? 'bg-[#FFE2D6]/20 text-[#FFE2D6]' 
                    : 'bg-[#413329]/10 text-[#413329] group-hover:bg-[#413329]/20'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg relative z-10">{item.name}</span>
                
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#413329]/10 bg-white/30 backdrop-blur-sm">
          <div className="space-y-4">
            {/* Admin Profile */}
            <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-2xl shadow-sm border border-white/40 backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFE2D6] to-[#FDBD99] rounded-2xl flex items-center justify-center shadow-md border border-white/40">
                <User className="w-5 h-5 text-[#413329]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#413329] truncate">Admin User</p>
                <p className="text-[#413329]/60 text-sm truncate">Super Admin</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 group border border-rose-200 hover:border-rose-300"
            >
              <div className="p-2 bg-rose-500/10 rounded-xl group-hover:bg-rose-500/20 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="lg:hidden h-20" />
    </>
  )
}

export default AdminSidebar