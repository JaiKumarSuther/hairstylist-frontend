import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { useAuthStore } from '@/store/authStore';
import { User, LoginCredentials, SignupCredentials } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Get current user
export const useMe = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<User> => {
      const response = await api.auth.me();
      return response.data;
    },
    enabled: isAuthenticated && !!localStorage.getItem('auth_token'),
    retry: false,
    initialData: user,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Use the auth store's login method which handles everything
      await login(credentials);
      return { success: true };
    },
    onSuccess: () => {
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      const message = error?.message || 'Login failed';
      toast.error(message);
    },
  });
};

// Signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();
  const { signup } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      // Use the auth store's signup method which handles everything
      await signup(credentials);
      return { success: true };
    },
    onSuccess: () => {
      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      const message = error?.message || 'Signup failed';
      toast.error(message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // Use the auth store's logout method
      logout();
    },
    onSuccess: () => {
      // Clear React Query cache
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if logout fails, clear local state
      logout();
      queryClient.clear();
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.auth.forgotPassword(email);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { token: string; password: string; confirmPassword: string }) => {
      const response = await api.auth.resetPassword(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.auth.updateProfile(data);
      return response.data;
    },
    onSuccess: (user) => {
      // Update Zustand store
      updateUser(user);
      
      // Update React Query cache
      queryClient.setQueryData(authKeys.me(), user);
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await api.auth.changePassword(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
};
