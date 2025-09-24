import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, SignupCredentials, AuthState } from '@/lib/types';
import { api } from '@/lib/api/client';
import { cookieUtils } from '@/lib/utils';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
  clearError: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => {
        set({ user });
      },

      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },

  clearUser: () => {
    // Clear token from both localStorage and cookies when clearing user
    localStorage.removeItem('auth_token');
    cookieUtils.remove('auth_token');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },


      clearError: () => {
        set({ error: null });
      },

      // Authentication methods
      login: async (credentials: LoginCredentials) => {
        console.log('Auth store - Starting login');
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.login(credentials);
          const { user, token } = response.data.data;
          
          console.log('Auth store - Login response received:', { user: user?.email, hasToken: !!token });
          
          // Store token in both localStorage and cookies
          localStorage.setItem('auth_token', token);
          cookieUtils.set('auth_token', token, 7);
          
          console.log('Auth store - Token stored, setting auth state');
          
          // Calculate trial status if user is not premium
          if (!user.isPremium) {
            const now = new Date();
            const trialEnd = new Date(user.createdAt);
            trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
            
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            user.trialDaysLeft = Math.max(0, daysLeft);
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          console.log('Auth store - Login completed successfully');
        } catch (error: any) {
          console.error('Auth store - Login failed:', error);
          set({
            error: error?.response?.data?.message || 'Login failed. Please check your credentials.',
            isLoading: false,
          });
        }
      },

      signup: async (credentials: SignupCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.auth.signup(credentials);
          const { user, token } = response.data.data;
          
          // Store token in both localStorage and cookies
          localStorage.setItem('auth_token', token);
          cookieUtils.set('auth_token', token, 7);
          
          // Calculate trial status if user is not premium
          if (!user.isPremium) {
            const now = new Date();
            const trialEnd = new Date(user.createdAt);
            trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
            
            const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            user.trialDaysLeft = Math.max(0, daysLeft);
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Signup failed. Please try again.',
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Clear token from both localStorage and cookies
        localStorage.removeItem('auth_token');
        cookieUtils.remove('auth_token');
        
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshUser: async () => {
        try {
          const response = await api.auth.me();
          const user = response.data.data;
          set({ user });
        } catch (error) {
          // If refresh fails, user might be logged out
          console.error('Failed to refresh user:', error);
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.forgotPassword(email);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Failed to send reset email. Please try again.',
            isLoading: false,
          });
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.resetPassword({ token, password, confirmPassword: password });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Failed to reset password. Please try again.',
            isLoading: false,
          });
        }
      },

      initializeAuth: async () => {
        // Check for token in localStorage first, then cookies
        let token = localStorage.getItem('auth_token');
        
        if (!token) {
          // Fallback to cookies if localStorage doesn't have token
          const cookieToken = cookieUtils.get('auth_token');
          if (cookieToken) {
            token = cookieToken;
            // Sync to localStorage for consistency
            localStorage.setItem('auth_token', token);
          }
        }
        
        if (token && !get().user) {
          try {
            const response = await api.auth.me();
            const user = response.data.data;
            
            // Calculate trial status if user is not premium
            if (user && !user.isPremium) {
              const now = new Date();
              const trialEnd = new Date(user.createdAt);
              trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial
              
              const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              user.trialDaysLeft = Math.max(0, daysLeft);
            }
            
            set({ user, isAuthenticated: true });
          } catch (error) {
            // Token is invalid, clear it from both localStorage and cookies
            localStorage.removeItem('auth_token');
            cookieUtils.remove('auth_token');
            set({ user: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

