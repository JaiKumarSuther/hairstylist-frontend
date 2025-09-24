// User types
export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  experience?: string;
  certifications?: string[];
  social_links?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  isPremium: boolean;
  trialDaysLeft: number;
  createdAt: Date;
  updatedAt: Date;
}

// Workshop types
export interface Workshop {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
  date: string;
  time: string;
  image: string;
  category: string;
  description?: string;
  duration?: number; // in minutes
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  materials?: string[];
  registered?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkshopFilters {
  category?: string;
  skill_level?: string;
  date_range?: 'upcoming' | 'past' | 'all';
  search?: string;
}

// Hairstyle types
export interface Hairstyle {
  id: string;
  image: string;
  category: string;
  title?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  instructions?: string[];
  favorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tutorial types
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: string;
  instructorId: string;
  progress?: number; // 0-100
  favorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Community types
export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  liked?: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  parentId?: string; // for nested comments
  likes: number;
  liked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// AI Chat types
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Navigation types
export interface NavItem {
  icon: string; // Lucide icon name
  label: string;
  href: string;
  badge?: number;
}

// Dashboard types
export interface DashboardCard {
  title: string;
  icon: string; // Lucide icon name
  preview: string;
  href: string;
  badge?: number;
  description?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Store types
export interface WorkshopState {
  workshops: Workshop[];
  registeredWorkshops: string[];
  filters: WorkshopFilters;
  loading: boolean;
  error: string | null;
}

export interface GalleryState {
  hairstyles: Hairstyle[];
  categories: string[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

export interface CommunityState {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// UI Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Search types
export interface SearchResult {
  type: 'workshop' | 'hairstyle' | 'tutorial' | 'user';
  id: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}
