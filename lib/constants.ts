// App constants
export const APP_NAME = 'Hairstylist';
export const APP_DESCRIPTION = 'Your Personal Hairstylist - Professional hairstyling education and community';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Navigation items
export const NAV_ITEMS = [
  {
    icon: 'Home',
    label: 'Home',
    href: '/',
    badge: 0
  },
  {
    icon: 'Calendar',
    label: 'Workshops',
    href: '/workshops',
    badge: 0
  },
  {
    icon: 'Image',
    label: 'Gallery',
    href: '/gallery',
    badge: 0
  },
  {
    icon: 'Users',
    label: 'Community',
    href: '/community',
    badge: 0
  },
  {
    icon: 'MessageCircle',
    label: 'AI Chat',
    href: '/ai-chat',
    badge: 0
  }
] as const;

// Workshop categories
export const WORKSHOP_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'cutting', label: 'Cutting Techniques' },
  { value: 'coloring', label: 'Hair Coloring' },
  { value: 'styling', label: 'Styling & Blowouts' },
  { value: 'braiding', label: 'Braiding & Updos' },
  { value: 'business', label: 'Business & Marketing' },
  { value: 'trends', label: 'Latest Trends' }
] as const;

// Hairstyle categories
export const HAIRSTYLE_CATEGORIES = [
  { value: 'all', label: 'All Styles' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'party', label: 'Party' },
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'trending', label: 'Trending' }
] as const;

// Tutorial categories
export const TUTORIAL_CATEGORIES = [
  { value: 'all', label: 'All Tutorials' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
] as const;

// Skill levels
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
] as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
] as const;

// Time filters
export const TIME_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' }
] as const;

// Pagination
export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

// Breakpoints
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1400
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060
} as const;

// File upload limits
export const FILE_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 5
} as const;

// Social media links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/hairstylist',
  twitter: 'https://twitter.com/hairstylist',
  facebook: 'https://facebook.com/hairstylist',
  youtube: 'https://youtube.com/hairstylist'
} as const;

// Contact information
export const CONTACT_INFO = {
  email: 'support@hairstylist.com',
  phone: '+1 (555) 123-4567',
  address: '123 Beauty Street, Style City, SC 12345'
} as const;

// Trial information
export const TRIAL_INFO = {
  duration: 14, // days
  features: [
    'Access to all workshops',
    'Premium gallery content',
    'AI chat assistance',
    'Community features'
  ]
} as const;

// Premium features
export const PREMIUM_FEATURES = [
  'Unlimited workshop access',
  'Premium gallery content',
  'Advanced AI chat features',
  'Priority support',
  'Exclusive community access',
  'Offline content download'
] as const;

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  generic: 'Something went wrong. Please try again.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  profileUpdated: 'Profile updated successfully',
  workshopRegistered: 'Successfully registered for workshop',
  postCreated: 'Post created successfully',
  commentAdded: 'Comment added successfully',
  favoriteAdded: 'Added to favorites',
  favoriteRemoved: 'Removed from favorites'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  auth: 'hairstylist_auth',
  theme: 'hairstylist_theme',
  preferences: 'hairstylist_preferences',
  favorites: 'hairstylist_favorites',
  recentSearches: 'hairstylist_recent_searches'
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  aiChat: true,
  offlineMode: false,
  pushNotifications: true,
  socialSharing: true,
  darkMode: true
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  pageView: 'page_view',
  workshopView: 'workshop_view',
  workshopRegister: 'workshop_register',
  galleryView: 'gallery_view',
  tutorialStart: 'tutorial_start',
  tutorialComplete: 'tutorial_complete',
  communityPost: 'community_post',
  aiChatMessage: 'ai_chat_message',
  search: 'search',
  favorite: 'favorite',
  share: 'share'
} as const;

