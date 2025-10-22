'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import  useUserStore  from '@/store/useStore';
import Order from '@/components/profile/orders/Order';
import { AuthGuard } from '@/components/booking';

const Page = () => {
  const router = useRouter();
  const { token } = useUserStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else  {
      router.push('/profile/profilepage');
    }
  }, [token, router]);

  return <AuthGuard />;
};

export default Page;
