// Re-export all stores for easy importing
export { useAuthStore } from './authStore';
export { useWorkshopStore } from './workshopStore';

// Store initialization helper
export const initializeStores = async () => {
  // Initialize any required store data
  // This can be called on app startup
  console.log('Stores initialized');
};

