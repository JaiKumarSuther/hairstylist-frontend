# API Integration Guide

This guide explains the complete API integration setup for the Hairstylist application using React Query, Axios, Zustand, and React Hot Toast.

## 🚀 Features Implemented

### 1. **React Query Integration**
- Centralized query client configuration
- Automatic caching and background refetching
- Optimistic updates for better UX
- Error handling and retry logic
- DevTools integration for debugging

### 2. **Axios API Client**
- Centralized HTTP client with interceptors
- Automatic token management
- Error handling with toast notifications
- Request/response transformation
- Base URL configuration

### 3. **Zustand State Management**
- Simplified auth store
- Workshop store for filters and state
- Persistent storage for user data
- Type-safe state management

### 4. **Toast Notifications**
- React Hot Toast integration
- Success, error, and info notifications
- Automatic error handling
- Customizable toast options

## 📁 File Structure

```
lib/
├── api/
│   ├── client.ts              # Axios configuration
│   ├── queryClient.ts         # React Query setup
│   └── hooks/
│       ├── auth.ts           # Authentication hooks
│       ├── workshops.ts      # Workshop hooks
│       ├── community.ts      # Community hooks
│       ├── gallery.ts        # Gallery hooks
│       ├── tutorials.ts      # Tutorial hooks
│       └── chat.ts          # Chat hooks
├── providers/
│   ├── QueryProvider.tsx     # React Query provider
│   └── ToastProvider.tsx     # Toast provider
└── types.ts                  # TypeScript definitions

store/
├── authStore.ts              # Authentication state
└── workshopStore.ts          # Workshop state
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### API Client Setup

The API client (`lib/api/client.ts`) includes:

- **Base URL**: Configurable via environment variables
- **Interceptors**: Automatic token injection and error handling
- **Error Handling**: Centralized error processing with toast notifications
- **Type Safety**: Full TypeScript support

### React Query Configuration

```typescript
// lib/api/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount, error) => {
        // Custom retry logic
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

## 🎯 Usage Examples

### Authentication

```typescript
import { useLogin, useSignup, useLogout } from '@/lib/api/hooks/auth';

function LoginComponent() {
  const loginMutation = useLogin();
  
  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        router.push('/dashboard');
      },
    });
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Data Fetching

```typescript
import { useWorkshops } from '@/lib/api/hooks/workshops';

function WorkshopsList() {
  const { data, isLoading, error } = useWorkshops(filters);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return (
    <div>
      {data?.workshops?.map(workshop => (
        <WorkshopCard key={workshop.id} workshop={workshop} />
      ))}
    </div>
  );
}
```

### Mutations with Optimistic Updates

```typescript
import { useRegisterWorkshop } from '@/lib/api/hooks/workshops';

function WorkshopCard({ workshop }) {
  const registerMutation = useRegisterWorkshop();
  
  const handleRegister = () => {
    registerMutation.mutate(workshop.id, {
      onSuccess: () => {
        // Optimistic update handled automatically
        toast.success('Successfully registered!');
      },
    });
  };
  
  return (
    <button 
      onClick={handleRegister}
      disabled={registerMutation.isPending}
    >
      {registerMutation.isPending ? 'Registering...' : 'Register'}
    </button>
  );
}
```

## 🔄 State Management

### Auth Store

```typescript
import { useAuthStore } from '@/store/authStore';

function ProfileComponent() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();
  
  // Auth state is automatically managed by React Query hooks
  // No need for manual state updates
}
```

### Workshop Store

```typescript
import { useWorkshopStore } from '@/store/workshopStore';

function WorkshopFilters() {
  const { filters, setFilters, searchWorkshops } = useWorkshopStore();
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // React Query will automatically refetch with new filters
  };
}
```

## 🎨 Toast Notifications

Toast notifications are automatically handled by the API client:

```typescript
// Success toast (automatic)
api.workshops.register(id); // Shows success toast

// Error toast (automatic)
api.workshops.register(id); // Shows error toast if fails

// Custom toast
import toast from 'react-hot-toast';

toast.success('Custom success message');
toast.error('Custom error message');
```

## 🛠️ Error Handling

### Global Error Handling

The API client automatically handles:

- **401 Unauthorized**: Redirects to login
- **403 Forbidden**: Shows access denied message
- **404 Not Found**: Shows not found message
- **422 Validation**: Shows validation errors
- **429 Rate Limited**: Shows rate limit message
- **500 Server Error**: Shows server error message
- **Network Errors**: Shows connection error message

### Component-Level Error Handling

```typescript
function MyComponent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['my-data'],
    queryFn: fetchMyData,
  });
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  // Component content
}
```

## 🚀 Performance Optimizations

### Caching Strategy

- **Stale Time**: 5 minutes for most queries
- **Cache Time**: 10 minutes for background cache
- **Background Refetch**: Enabled for fresh data
- **Window Focus Refetch**: Disabled to prevent unnecessary requests

### Optimistic Updates

```typescript
// Automatic optimistic updates for mutations
const registerMutation = useRegisterWorkshop();

// The mutation automatically updates the cache
// before the server responds
registerMutation.mutate(workshopId);
```

### Prefetching

```typescript
import { usePrefetchWorkshop } from '@/lib/api/hooks/workshops';

function WorkshopList() {
  const prefetchWorkshop = usePrefetchWorkshop();
  
  return (
    <div>
      {workshops.map(workshop => (
        <Link
          key={workshop.id}
          href={`/workshops/${workshop.id}`}
          onMouseEnter={() => prefetchWorkshop(workshop.id)}
        >
          {workshop.title}
        </Link>
      ))}
    </div>
  );
}
```

## 🧪 Testing

### Query Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWorkshops } from '@/lib/api/hooks/workshops';

test('should fetch workshops', async () => {
  const queryClient = new QueryClient();
  
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => useWorkshops(), { wrapper });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## 🔧 Development Tools

### React Query DevTools

The DevTools are automatically included in development:

```typescript
// lib/providers/QueryProvider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 📝 Best Practices

### 1. **Query Keys**
- Use consistent query key patterns
- Include all dependencies in query keys
- Use query key factories for type safety

### 2. **Error Handling**
- Let the API client handle global errors
- Use component-level error boundaries
- Provide fallback UI for error states

### 3. **Loading States**
- Use `isLoading` for initial loads
- Use `isFetching` for background updates
- Show skeleton loaders for better UX

### 4. **Mutations**
- Use optimistic updates when possible
- Handle success/error callbacks
- Provide loading states for buttons

### 5. **Caching**
- Set appropriate stale times
- Use background refetching
- Invalidate related queries after mutations

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools axios react-hot-toast
   ```

2. **Set Environment Variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Open DevTools**:
   - React Query DevTools will be available in development
   - Use browser dev tools to inspect network requests

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your frontend URL
2. **Token Issues**: Check localStorage for auth_token
3. **Cache Issues**: Use React Query DevTools to inspect cache
4. **Network Errors**: Check API URL configuration

### Debug Tips

- Use React Query DevTools to inspect queries
- Check browser network tab for API calls
- Use console.log in query functions for debugging
- Enable React Query DevTools in production for debugging

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hot Toast Documentation](https://react-hot-toast.com/)

---

This integration provides a robust, scalable, and maintainable API layer for the Hairstylist application with excellent developer experience and user experience.
