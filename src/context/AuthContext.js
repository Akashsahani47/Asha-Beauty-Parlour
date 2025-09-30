'use client'
import { createContext, useContext, useEffect } from 'react';
import useUserStore from '@/store/useStore';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, setUser, setToken, login, logout } = useUserStore();

  const checkAuthStatus = async () => {
    try {
      console.log('🔄 Checking auth status...');
      
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      console.log('📝 Stored token found:', storedToken ? `YES` : 'NO');
      
      if (!storedToken) {
        console.log('❌ No token found in storage');
        logout();
        return;
      }

      const timestamp = Date.now();
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const url = `${backendUrl}/api/user/me?t=${timestamp}`;
      
      console.log('📤 Sending request to:', url);
      console.log('🔑 Token being sent:', `Bearer ${storedToken.substring(0, 50)}...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      console.log('📡 Auth check response status:', response.status);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Expected JSON but got:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('📊 Auth check response data:', data);
      
      if (response.ok && data.user) {
        // ✅ FIX: Set both user AND token in Zustand store
        setUser(data.user);
        setToken(storedToken); // ← THIS IS THE CRITICAL MISSING LINE
        console.log('✅ User authenticated:', data.user.name);
        console.log('✅ Token stored in Zustand:', storedToken ? 'YES' : 'NO');
      } else {
        console.log('❌ Auth failed. Message:', data.message);
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        logout();
      }
    } catch (error) {
      console.error('💥 Auth check failed:', error.message);
      logout();
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login: (userData, authToken) => {
      console.log('🔐 Login called with user:', userData?.name);
      
      if (authToken) {
        localStorage.setItem("authToken", authToken);
        console.log('💾 Token saved to localStorage');
      }
      
      // ✅ FIX: Use Zustand's login function which sets both user and token
      login(userData, authToken);
    },
    logout: () => {
      console.log('🚪 Logout called');
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      logout();
    },
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};