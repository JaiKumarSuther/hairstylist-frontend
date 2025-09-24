import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Workshop, WorkshopFilters } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const workshopKeys = {
  all: ['workshops'] as const,
  lists: () => [...workshopKeys.all, 'list'] as const,
  list: (filters: WorkshopFilters) => [...workshopKeys.lists(), filters] as const,
  details: () => [...workshopKeys.all, 'detail'] as const,
  detail: (id: string) => [...workshopKeys.details(), id] as const,
  myRegistrations: () => [...workshopKeys.all, 'my-registrations'] as const,
};

// Get all workshops
export const useWorkshops = (filters: WorkshopFilters = {}) => {
  return useQuery({
    queryKey: workshopKeys.list(filters),
    queryFn: async (): Promise<{ workshops: Workshop[]; pagination: any }> => {
      const response = await api.workshops.getAll(filters);
      return response.data.data; // Access the nested data object
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get workshop by ID
export const useWorkshop = (id: string) => {
  return useQuery({
    queryKey: workshopKeys.detail(id),
    queryFn: async (): Promise<Workshop> => {
      const response = await api.workshops.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Get my registrations
export const useMyRegistrations = () => {
  return useQuery({
    queryKey: workshopKeys.myRegistrations(),
    queryFn: async (): Promise<Workshop[]> => {
      const response = await api.workshops.getMyRegistrations();
      return response.data.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Register for workshop mutation
export const useRegisterWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workshopId: string) => {
      const response = await api.workshops.register(workshopId);
      return response.data;
    },
    onSuccess: (data, workshopId) => {
      // Update the specific workshop in cache
      queryClient.setQueryData(workshopKeys.detail(workshopId), (old: Workshop | undefined) => {
        if (old) {
          return { ...old, registered: true, currentParticipants: (old.currentParticipants || 0) + 1 };
        }
        return old;
      });

      // Update workshops list cache
      queryClient.setQueriesData({ queryKey: workshopKeys.lists() }, (old: any) => {
        if (old?.workshops) {
          return {
            ...old,
            workshops: old.workshops.map((workshop: Workshop) =>
              workshop.id === workshopId
                ? { ...workshop, registered: true, currentParticipants: (workshop.currentParticipants || 0) + 1 }
                : workshop
            ),
          };
        }
        return old;
      });

      // Invalidate my registrations
      queryClient.invalidateQueries({ queryKey: workshopKeys.myRegistrations() });

      toast.success('Successfully registered for workshop!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to register for workshop';
      
      // Handle specific error cases
      if (message.includes('Invalid token') || message.includes('Token expired')) {
        // Don't show toast for token errors - the API client already handles this
        return;
      }
      
      toast.error(message);
    },
  });
};

// Unregister from workshop mutation
export const useUnregisterWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workshopId: string) => {
      const response = await api.workshops.unregister(workshopId);
      return response.data;
    },
    onSuccess: (data, workshopId) => {
      // Update the specific workshop in cache
      queryClient.setQueryData(workshopKeys.detail(workshopId), (old: Workshop | undefined) => {
        if (old) {
          return { ...old, registered: false, currentParticipants: Math.max(0, (old.currentParticipants || 1) - 1) };
        }
        return old;
      });

      // Update workshops list cache
      queryClient.setQueriesData({ queryKey: workshopKeys.lists() }, (old: any) => {
        if (old?.workshops) {
          return {
            ...old,
            workshops: old.workshops.map((workshop: Workshop) =>
              workshop.id === workshopId
                ? { ...workshop, registered: false, currentParticipants: Math.max(0, (workshop.currentParticipants || 1) - 1) }
                : workshop
            ),
          };
        }
        return old;
      });

      // Invalidate my registrations
      queryClient.invalidateQueries({ queryKey: workshopKeys.myRegistrations() });

      toast.success('Successfully unregistered from workshop');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to unregister from workshop';
      
      // Handle specific error cases
      if (message.includes('Invalid token') || message.includes('Token expired')) {
        // Don't show toast for token errors - the API client already handles this
        return;
      }
      
      toast.error(message);
    },
  });
};

// Prefetch workshop
export const usePrefetchWorkshop = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: workshopKeys.detail(id),
      queryFn: async () => {
        const response = await api.workshops.getById(id);
        return response.data.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};
