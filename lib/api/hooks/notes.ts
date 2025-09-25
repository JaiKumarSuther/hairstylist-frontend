import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import toast from 'react-hot-toast';

// Query keys
export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  list: (params: any) => [...notesKeys.lists(), params] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: string) => [...notesKeys.details(), id] as const,
  favorites: () => [...notesKeys.all, 'favorites'] as const,
  categories: () => [...notesKeys.all, 'categories'] as const,
};

// Get all notes
export const useNotes = (params: any = {}) => {
  return useQuery({
    queryKey: notesKeys.list(params),
    queryFn: async () => {
      const response = await api.notes.getAll(params);
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single note
export const useNote = (id: string) => {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: async () => {
      const response = await api.notes.getById(id);
      return response.data;
    },
    enabled: !!id && !!localStorage.getItem('auth_token'),
  });
};

// Get favorite notes
export const useFavoriteNotes = () => {
  return useQuery({
    queryKey: notesKeys.favorites(),
    queryFn: async () => {
      const response = await api.notes.getFavorites();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
  });
};

// Get note categories
export const useNoteCategories = () => {
  return useQuery({
    queryKey: notesKeys.categories(),
    queryFn: async () => {
      const response = await api.notes.getCategories();
      return response.data;
    },
    enabled: !!localStorage.getItem('auth_token'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create note mutation
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; category: string; tags: string[] }) => {
      const response = await api.notes.create(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      toast.success('Note created successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create note';
      toast.error(message);
    },
  });
};

// Update note mutation
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.notes.update(id, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the specific note in cache
      queryClient.setQueryData(notesKeys.detail(variables.id), data);
      
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      
      toast.success('Note updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update note';
      toast.error(message);
    },
  });
};

// Delete note mutation
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.notes.delete(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: notesKeys.detail(id) });
      
      // Invalidate notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      
      toast.success('Note deleted successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete note';
      toast.error(message);
    },
  });
};

// Toggle note favorite mutation
export const useToggleNoteFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.notes.toggleFavorite(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      // Update the specific note in cache
      queryClient.setQueryData(notesKeys.detail(id), (old: any) => {
        if (old) {
          return { ...old, isFavorite: data.isFavorite };
        }
        return old;
      });

      // Update notes list cache
      queryClient.setQueriesData({ queryKey: notesKeys.lists() }, (old: any) => {
        if (old?.notes) {
          return {
            ...old,
            notes: old.notes.map((note: any) =>
              note.id === id ? { ...note, isFavorite: data.isFavorite } : note
            ),
          };
        }
        return old;
      });

      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: notesKeys.favorites() });

      toast.success(data.isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update favorite status';
      toast.error(message);
    },
  });
};
