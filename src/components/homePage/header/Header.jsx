'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <div className=' flex justify-around bg-[#FFE2D6] p-4 md:p-6 items-center relative'>
        {/* Logo */}
        <span onClick={()=> router.push('/')} className='font-bold text-2xl animate-bounce cursor-pointer'>ASHA</span>
        
        {/* Mobile Login Button - Visible only on mobile */}
        <div onClick={()=>router.push("/login")} className='md:hidden border border-[#413329] py-2 px-6 hover:bg-[#413329] hover:text-amber-50 transform duration-200 cursor-pointer'>
          <button >Login</button>
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden md:flex gap-7'>
          <li className='hover:scale-150 transform transition duration-300 cursor-pointer'>Home</li>
          <li className='hover:scale-150 transform transition duration-300 cursor-pointer'>About</li>
          <li className='hover:scale-150 transform transition duration-300 cursor-pointer'>Service</li>
          <li className='hover:scale-150 transform transition duration-300 cursor-pointer'>Contact US</li>
        </ul>

        {/* Desktop Login Button */}
        <div onClick={()=>router.push("/login")} className='hidden md:block border py-2 px-9 hover:bg-[#413329] hover:text-amber-50 transform duration-200 cursor-pointer'>
          <button className='cursor-pointer'  >Login</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className='md:hidden flex flex-col justify-center items-center w-10 h-10'
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
        <ul className='flex flex-col items-center py-4 space-y-4'>
          <li className='hover:scale-125 transform transition duration-300 cursor-pointer py-2'>Home</li>
          <li className='hover:scale-125 transform transition duration-300 cursor-pointer py-2'>About</li>
          <li className='hover:scale-125 transform transition duration-300 cursor-pointer py-2'>Service</li>
          <li className='hover:scale-125 transform transition duration-300 cursor-pointer py-2'>Contact US</li>
        </ul>
      </div>
      
    </>
  )
}

export default Header
