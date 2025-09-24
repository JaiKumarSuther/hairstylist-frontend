'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isAuthenticated, user, clearUser } = useAuthStore();

  useEffect(() => {
    // Initialize auth on client-side only
    if (typeof window !== 'undefined') {
      initializeAuth();
    }
  }, [initializeAuth]);

  // Listen for invalid token events
  useEffect(() => {
    const handleInvalidToken = () => {
      clearUser();
    };

    window.addEventListener('auth:invalid-token', handleInvalidToken);
    
    return () => {
      window.removeEventListener('auth:invalid-token', handleInvalidToken);
    };
  }, [clearUser]);

  // Debug logging
  useEffect(() => {
    console.log('Auth state:', { 
      isAuthenticated, 
      user: user?.email,
      hasToken: !!localStorage.getItem('auth_token'),
      hasCookie: typeof document !== 'undefined' ? !!document.cookie.includes('auth_token=') : false
    });
  }, [isAuthenticated, user]);

  return <>{children}</>;
}
