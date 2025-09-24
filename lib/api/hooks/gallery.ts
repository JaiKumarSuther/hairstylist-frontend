import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { Hairstyle } from '@/lib/types';
import toast from 'react-hot-toast';

// Query keys
export const galleryKeys = {
  all: ['gallery'] as const,
  hairstyles: () => [...galleryKeys.all, 'hairstyles'] as const,
  hairstylesList: (params: any) => [...galleryKeys.hairstyles(), 'list', params] as const,
  hairstyle: (id: string) => [...galleryKeys.hairstyles(), 'detail', id] as const,
  favorites: () => [...galleryKeys.all, 'favorites'] as const,
  categories: () => [...galleryKeys.all, 'categories'] as const,
};

// Get hairstyles
export const useHairstyles = (params: any = {}) => {
  return useQuery({
    queryKey: galleryKeys.hairstylesList(params),
    queryFn: async (): Promise<{ hairstyles: Hairstyle[]; total: number }> => {
      const response = await api.gallery.getHairstyles(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single hairstyle
export const useHairstyle = (id: string) => {
  return useQuery({
    queryKey: galleryKeys.hairstyle(id),
    queryFn: async (): Promise<Hairstyle> => {
      const response = await api.gallery.getHairstyle(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get favorite hairstyles
export const useFavoriteHairstyles = () => {
  return useQuery({
    queryKey: galleryKeys.favorites(),
    queryFn: async (): Promise<Hairstyle[]> => {
      const response = await api.gallery.getFavorites();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: galleryKeys.categories(),
    queryFn: async (): Promise<string[]> => {
      const response = await api.gallery.getHairstyles({ categories: true });
      return response.data.categories || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Favorite hairstyle mutation
export const useFavoriteHairstyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.gallery.favoriteHairstyle(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific hairstyle in cache
      queryClient.setQueryData(galleryKeys.hairstyle(id), (old: Hairstyle | undefined) => {
        if (old) {
          return { ...old, favorited: true };
        }
        return old;
      });

      // Update hairstyles list cache
      queryClient.setQueriesData({ queryKey: galleryKeys.hairstyles() }, (old: any) => {
        if (old?.hairstyles) {
          return {
            ...old,
            hairstyles: old.hairstyles.map((hairstyle: Hairstyle) =>
              hairstyle.id === id ? { ...hairstyle, favorited: true } : hairstyle
            ),
          };
        }
        return old;
      });

      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites() });

      toast.success('Added to favorites!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add to favorites';
      toast.error(message);
    },
  });
};

// Unfavorite hairstyle mutation
export const useUnfavoriteHairstyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.gallery.unfavoriteHairstyle(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific hairstyle in cache
      queryClient.setQueryData(galleryKeys.hairstyle(id), (old: Hairstyle | undefined) => {
        if (old) {
          return { ...old, favorited: false };
        }
        return old;
      });

      // Update hairstyles list cache
      queryClient.setQueriesData({ queryKey: galleryKeys.hairstyles() }, (old: any) => {
        if (old?.hairstyles) {
          return {
            ...old,
            hairstyles: old.hairstyles.map((hairstyle: Hairstyle) =>
              hairstyle.id === id ? { ...hairstyle, favorited: false } : hairstyle
            ),
          };
        }
        return old;
      });

      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: galleryKeys.favorites() });

      toast.success('Removed from favorites');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to remove from favorites';
      toast.error(message);
    },
  });
};

// Upload image mutation
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.gallery.uploadImage(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate hairstyles list
      queryClient.invalidateQueries({ queryKey: galleryKeys.hairstyles() });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to upload image';
      toast.error(message);
    },
  });
};
