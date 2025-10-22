// components/NavbarWrapper.tsx
'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/homePage/header/Header'

const NavbarWrapper = () => {
  const pathname = usePathname();
  
  

  if (pathname?.startsWith("/profile") || pathname?.startsWith("/admin")) {
    console.log("Current path:", pathname);
    return null;
  }

  return <Header />
}

export default NavbarWrapper