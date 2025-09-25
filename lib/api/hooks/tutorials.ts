import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Tutorial } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const tutorialKeys = {
  all: ['tutorials'] as const,
  lists: () => [...tutorialKeys.all, 'list'] as const,
  list: (params: any) => [...tutorialKeys.lists(), params] as const,
  details: () => [...tutorialKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorialKeys.details(), id] as const,
  progress: (id: string) => [...tutorialKeys.detail(id), 'progress'] as const,
  favorites: () => [...tutorialKeys.all, 'favorites'] as const,
};

// Get all tutorials
export const useTutorials = (params: any = {}) => {
  return useQuery({
    queryKey: tutorialKeys.list(params),
    queryFn: async (): Promise<{ tutorials: Tutorial[]; total: number }> => {
      const response = await api.tutorials.getAll(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get tutorial by ID
export const useTutorial = (id: string) => {
  return useQuery({
    queryKey: tutorialKeys.detail(id),
    queryFn: async (): Promise<Tutorial> => {
      const response = await api.tutorials.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get tutorial progress
export const useTutorialProgress = (id: string) => {
  return useQuery({
    queryKey: tutorialKeys.progress(id),
    queryFn: async (): Promise<{ progress: number }> => {
      const response = await api.tutorials.getProgress(id);
      return response.data;
    },
    enabled: !!id && !!localStorage.getItem('auth_token'),
  });
};

// Get favorite tutorials
export const useFavoriteTutorials = () => {
  return useQuery({
    queryKey: tutorialKeys.favorites(),
    queryFn: async (): Promise<Tutorial[]> => {
      const response = await api.tutorials.getFavorites();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Update tutorial progress mutation
export const useUpdateTutorialProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const response = await api.tutorials.updateProgress(id, progress);
      return response.data;
    },
    onSuccess: (data, { id, progress }) => {
      // Update the specific tutorial in cache
      queryClient.setQueryData(tutorialKeys.detail(id), (old: Tutorial | undefined) => {
        if (old) {
          return { ...old, progress };
        }
        return old;
      });

      // Update tutorials list cache
      queryClient.setQueriesData({ queryKey: tutorialKeys.lists() }, (old: any) => {
        if (old?.tutorials) {
          return {
            ...old,
            tutorials: old.tutorials.map((tutorial: Tutorial) =>
              tutorial.id === id ? { ...tutorial, progress } : tutorial
            ),
          };
        }
        return old;
      });

      // Update progress cache
      queryClient.setQueryData(tutorialKeys.progress(id), { progress });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update progress';
      toast.error(message);
    },
  });
};

// Favorite tutorial mutation
export const useFavoriteTutorial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.tutorials.favorite(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific tutorial in cache
      queryClient.setQueryData(tutorialKeys.detail(id), (old: Tutorial | undefined) => {
        if (old) {
          return { ...old, favorited: true };
        }
        return old;
      });

      // Update tutorials list cache
      queryClient.setQueriesData({ queryKey: tutorialKeys.lists() }, (old: any) => {
        if (old?.tutorials) {
          return {
            ...old,
            tutorials: old.tutorials.map((tutorial: Tutorial) =>
              tutorial.id === id ? { ...tutorial, favorited: true } : tutorial
            ),
          };
        }
        return old;
      });

      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: tutorialKeys.favorites() });

      toast.success('Added to favorites!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add to favorites';
      toast.error(message);
    },
  });
};

// Unfavorite tutorial mutation
export const useUnfavoriteTutorial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.tutorials.unfavorite(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific tutorial in cache
      queryClient.setQueryData(tutorialKeys.detail(id), (old: Tutorial | undefined) => {
        if (old) {
          return { ...old, favorited: false };
        }
        return old;
      });

      // Update tutorials list cache
      queryClient.setQueriesData({ queryKey: tutorialKeys.lists() }, (old: any) => {
        if (old?.tutorials) {
          return {
            ...old,
            tutorials: old.tutorials.map((tutorial: Tutorial) =>
              tutorial.id === id ? { ...tutorial, favorited: false } : tutorial
            ),
          };
        }
        return old;
      });

      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: tutorialKeys.favorites() });

      toast.success('Removed from favorites');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to remove from favorites';
      toast.error(message);
    },
  });
};

// Get favorite tutorials
export const useFavoriteTutorials = () => {
  return useQuery({
    queryKey: tutorialKeys.favorites(),
    queryFn: async () => {
      const response = await api.tutorials.getFavorites();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Get tutorial categories
export const useTutorialCategories = () => {
  return useQuery({
    queryKey: tutorialKeys.categories(),
    queryFn: async () => {
      const response = await api.tutorials.getCategories();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};