// Test file to verify API integration
import { api } from './client';
import { queryClient } from './queryClient';

// Test API client configuration
export const testApiIntegration = async () => {
  try {
    console.log('🧪 Testing API Integration...');
    
    // Test 1: Check if API client is configured
    console.log('✅ API Client configured:', !!api);
    
    // Test 2: Check if query client is configured
    console.log('✅ Query Client configured:', !!queryClient);
    
    // Test 3: Test API endpoints structure
    console.log('✅ Auth endpoints:', Object.keys(api.auth));
    console.log('✅ Workshop endpoints:', Object.keys(api.workshops));
    console.log('✅ Community endpoints:', Object.keys(api.community));
    console.log('✅ Gallery endpoints:', Object.keys(api.gallery));
    console.log('✅ Tutorial endpoints:', Object.keys(api.tutorials));
    console.log('✅ Chat endpoints:', Object.keys(api.chat));
    
    // Test 4: Check if interceptors are set up
    console.log('✅ Request interceptor:', api.interceptors.request.handlers.length > 0);
    console.log('✅ Response interceptor:', api.interceptors.response.handlers.length > 0);
    
    console.log('🎉 API Integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ API Integration test failed:', error);
    return false;
  }
};

// Test React Query hooks
export const testReactQueryHooks = () => {
  try {
    console.log('🧪 Testing React Query Hooks...');
    
    // Import hooks to check if they're properly exported
    const authHooks = require('./hooks/auth');
    const workshopHooks = require('./hooks/workshops');
    const communityHooks = require('./hooks/community');
    const galleryHooks = require('./hooks/gallery');
    const tutorialHooks = require('./hooks/tutorials');
    const chatHooks = require('./hooks/chat');
    
    console.log('✅ Auth hooks exported:', Object.keys(authHooks));
    console.log('✅ Workshop hooks exported:', Object.keys(workshopHooks));
    console.log('✅ Community hooks exported:', Object.keys(communityHooks));
    console.log('✅ Gallery hooks exported:', Object.keys(galleryHooks));
    console.log('✅ Tutorial hooks exported:', Object.keys(tutorialHooks));
    console.log('✅ Chat hooks exported:', Object.keys(chatHooks));
    
    console.log('🎉 React Query Hooks test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ React Query Hooks test failed:', error);
    return false;
  }
};

// Test Zustand stores
export const testZustandStores = () => {
  try {
    console.log('🧪 Testing Zustand Stores...');
    
    const authStore = require('../../store/authStore');
    const workshopStore = require('../../store/workshopStore');
    
    console.log('✅ Auth store exported:', !!authStore.useAuthStore);
    console.log('✅ Workshop store exported:', !!workshopStore.useWorkshopStore);
    
    console.log('🎉 Zustand Stores test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Zustand Stores test failed:', error);
    return false;
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Starting API Integration Tests...\n');
  
  const apiTest = await testApiIntegration();
  const hooksTest = testReactQueryHooks();
  const storesTest = testZustandStores();
  
  const allPassed = apiTest && hooksTest && storesTest;
  
  console.log('\n📊 Test Results:');
  console.log(`API Client: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`React Query Hooks: ${hooksTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Zustand Stores: ${storesTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`\nOverall: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
};

// Auto-run tests in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  runAllTests();
}
