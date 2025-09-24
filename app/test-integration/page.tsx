'use client';

import React from 'react';
import { ApiIntegrationTest } from '@/components/test/ApiIntegrationTest';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function TestIntegrationPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">API Integration Test</h1>
            <p className="text-muted-foreground">
              This page tests the complete API integration including React Query, Axios, Zustand, and Toast notifications.
            </p>
          </div>
          
          <ApiIntegrationTest />
          
          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Integration Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">✅ React Query</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic caching and background refetching</li>
                  <li>• Optimistic updates for better UX</li>
                  <li>• Error handling and retry logic</li>
                  <li>• DevTools integration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">✅ Axios API Client</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Centralized HTTP client</li>
                  <li>• Automatic token management</li>
                  <li>• Error handling with toasts</li>
                  <li>• Request/response interceptors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">✅ Zustand Stores</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Simplified state management</li>
                  <li>• Persistent storage</li>
                  <li>• Type-safe state</li>
                  <li>• Minimal boilerplate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">✅ Toast Notifications</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React Hot Toast integration</li>
                  <li>• Automatic error handling</li>
                  <li>• Success notifications</li>
                  <li>• Customizable options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
