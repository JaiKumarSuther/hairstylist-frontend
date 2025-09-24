import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    checkTrialStatus,
    refreshUser,
    clearError,
    forgotPassword,
    resetPassword,
  } = useAuthStore();

  const router = useRouter();

  // Check trial status on mount
  useEffect(() => {
    if (user && !user.isPremium) {
      checkTrialStatus();
    }
  }, [user, checkTrialStatus]);

  // Auto-refresh user data periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refreshUser();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshUser]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await login(credentials);
    if (isAuthenticated) {
      router.push('/');
    }
  };

  const handleSignup = async (credentials: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    await signup(credentials);
    if (isAuthenticated) {
      router.push('/');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateUser,
    clearError,
    forgotPassword,
    resetPassword,
    // Trial status helpers
    isTrialActive: user ? user.trialDaysLeft > 0 : false,
    isPremium: user?.isPremium || false,
    trialDaysLeft: user?.trialDaysLeft || 0,
  };
};

