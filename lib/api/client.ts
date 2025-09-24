import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { cookieUtils } from '@/lib/utils';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from localStorage or cookies
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Client-side: check localStorage first, then cookies
    const localToken = localStorage.getItem('auth_token');
    if (localToken) return localToken;
    
    // Fallback to cookies
    return cookieUtils.get('auth_token');
  }
  return null;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token from both localStorage and cookies
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            cookieUtils.remove('auth_token');
          }
          
          // Handle different types of 401 errors
          const errorMessage = data?.message || 'Session expired';
          
          if (errorMessage.includes('Invalid token')) {
            // Clear auth state when token is invalid
            if (window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('auth:invalid-token'));
            }
          }
          
          // Only redirect if not already on login page and not a workshop registration request
          if (!window.location.pathname.includes('/login') && !response.config?.url?.includes('/register')) {
            window.location.href = '/login';
          }
          
          // Don't show toast for workshop registration - let the component handle it
          if (!response.config?.url?.includes('/register')) {
            toast.error('Session expired. Please login again.');
          }
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data?.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach((message: any) => toast.error(message));
          } else {
            toast.error(data?.message || 'Validation failed.');
          }
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data?.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/api/auth/login', credentials),
    signup: (credentials: { name: string; email: string; password: string; confirmPassword: string }) =>
      apiClient.post('/api/auth/signup', credentials),
    logout: () => apiClient.post('/api/auth/logout'),
    me: () => apiClient.get('/api/auth/me'),
    forgotPassword: (email: string) =>
      apiClient.post('/api/auth/forgot-password', { email }),
    resetPassword: (data: { token: string; password: string; confirmPassword: string }) =>
      apiClient.post('/api/auth/reset-password', data),
    updateProfile: (data: any) =>
      apiClient.put('/api/auth/profile', data),
    changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
      apiClient.put('/api/auth/change-password', data),
  },

  // Workshop endpoints
  workshops: {
    getAll: (params?: any) => apiClient.get('/api/workshops', { params }),
    getById: (id: string) => apiClient.get(`/api/workshops/${id}`),
    register: (id: string) => apiClient.post(`/api/workshops/${id}/register`),
    unregister: (id: string) => apiClient.delete(`/api/workshops/${id}/unregister`),
    getMyRegistrations: () => apiClient.get('/api/workshops/my/registrations'),
  },

  // Community endpoints
  community: {
    getPosts: (params?: any) => apiClient.get('/api/community/posts', { params }),
    getPost: (id: string) => apiClient.get(`/api/community/posts/${id}`),
    createPost: (data: any) => apiClient.post('/api/community/posts', data),
    updatePost: (id: string, data: any) => apiClient.put(`/api/community/posts/${id}`, data),
    deletePost: (id: string) => apiClient.delete(`/api/community/posts/${id}`),
    likePost: (id: string) => apiClient.post(`/api/community/posts/${id}/like`),
    unlikePost: (id: string) => apiClient.delete(`/api/community/posts/${id}/like`),
    getComments: (postId: string) => apiClient.get(`/api/community/posts/${postId}/comments`),
    createComment: (postId: string, data: any) => apiClient.post(`/api/community/posts/${postId}/comments`, data),
    updateComment: (id: string, data: any) => apiClient.put(`/api/community/comments/${id}`, data),
    deleteComment: (id: string) => apiClient.delete(`/api/community/comments/${id}`),
    likeComment: (id: string) => apiClient.post(`/api/community/comments/${id}/like`),
    unlikeComment: (id: string) => apiClient.delete(`/api/community/comments/${id}/like`),
  },

  // Gallery endpoints
  gallery: {
    getHairstyles: (params?: any) => apiClient.get('/api/gallery/hairstyles', { params }),
    getHairstyle: (id: string) => apiClient.get(`/api/gallery/hairstyles/${id}`),
    favoriteHairstyle: (id: string) => apiClient.post(`/api/gallery/hairstyles/${id}/favorite`),
    unfavoriteHairstyle: (id: string) => apiClient.delete(`/api/gallery/hairstyles/${id}/favorite`),
    getFavorites: () => apiClient.get('/api/gallery/favorites'),
    uploadImage: (data: FormData) => apiClient.post('/api/gallery/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  },

  // Tutorial endpoints
  tutorials: {
    getAll: (params?: any) => apiClient.get('/api/tutorials', { params }),
    getById: (id: string) => apiClient.get(`/api/tutorials/${id}`),
    getProgress: (id: string) => apiClient.get(`/api/tutorials/${id}/progress`),
    updateProgress: (id: string, progress: number) => apiClient.put(`/api/tutorials/${id}/progress`, { progress }),
    favorite: (id: string) => apiClient.post(`/api/tutorials/${id}/favorite`),
    unfavorite: (id: string) => apiClient.delete(`/api/tutorials/${id}/favorite`),
    getFavorites: () => apiClient.get('/api/tutorials/favorites'),
  },

  // Chat endpoints
  chat: {
    sendMessage: (data: { message: string; sessionId?: string }) => apiClient.post('/api/chat/send', data),
    getSessions: () => apiClient.get('/api/chat/sessions'),
    getSession: (id: string) => apiClient.get(`/api/chat/sessions/${id}`),
    deleteSession: (id: string) => apiClient.delete(`/api/chat/sessions/${id}`),
  },
};

export default apiClient;
