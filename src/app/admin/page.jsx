
'use client';
import React from 'react'
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  return router.push('/admin/Booking');
}

export default page
