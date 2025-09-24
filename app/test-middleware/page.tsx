'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function TestMiddlewarePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Middleware Test</CardTitle>
          <CardDescription>
            This page tests the authentication middleware functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Authentication Status:</h3>
            <p className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold">Token Status:</h3>
            <p>LocalStorage: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</p>
            <p>Cookie: {typeof document !== 'undefined' && document.cookie.includes('auth_token=') ? '✅ Present' : '❌ Missing'}</p>
          </div>
          
          {user && (
            <div>
              <h3 className="font-semibold">User Info:</h3>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/workshops')} 
              className="w-full"
            >
              Test Protected Route (Workshops)
            </Button>
            
            <Button 
              onClick={() => router.push('/profile')} 
              className="w-full"
              variant="outline"
            >
              Test Protected Route (Profile)
            </Button>
            
            {isAuthenticated && (
              <Button 
                onClick={handleLogout} 
                className="w-full"
                variant="destructive"
              >
                Logout
              </Button>
            )}
            
            {!isAuthenticated && (
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full"
                variant="default"
              >
                Go to Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
