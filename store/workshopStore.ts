import { create } from 'zustand';
import { Workshop, WorkshopFilters, WorkshopState } from '@/lib/types';

interface WorkshopStore extends WorkshopState {
  // Actions
  fetchWorkshops: () => Promise<void>;
  fetchWorkshop: (id: string) => Promise<Workshop | null>;
  registerForWorkshop: (workshopId: string) => Promise<void>;
  unregisterFromWorkshop: (workshopId: string) => Promise<void>;
  setFilters: (filters: Partial<WorkshopFilters>) => void;
  clearFilters: () => void;
  searchWorkshops: (query: string) => void;
  refreshWorkshops: () => Promise<void>;
}

const defaultFilters: WorkshopFilters = {
  category: 'all',
  skill_level: 'all',
  date_range: 'upcoming',
  search: '',
};

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
  // Initial state
  workshops: [],
  registeredWorkshops: [],
  filters: defaultFilters,
  loading: false,
  error: null,

  // Actions
  fetchWorkshops: async () => {
    set({ loading: true, error: null });
    
    try {
      const { filters } = get();
      const queryParams = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.skill_level && filters.skill_level !== 'all') {
        queryParams.append('skill_level', filters.skill_level);
      }
      if (filters.date_range && filters.date_range !== 'all') {
        queryParams.append('date_range', filters.date_range);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/workshops?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch workshops');
      }

      const data = await response.json();
      
      set({
        workshops: data.workshops || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workshops',
      });
    }
  },

  fetchWorkshop: async (id: string) => {
    try {
      const response = await fetch(`/api/workshops/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch workshop');
      }

      const workshop = await response.json();
      return workshop;
    } catch (error) {
      console.error('Failed to fetch workshop:', error);
      return null;
    }
  },

  registerForWorkshop: async (workshopId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register for workshop');
      }

      // Update local state
      const { workshops, registeredWorkshops } = get();
      const updatedWorkshops = workshops.map(workshop => 
        workshop.id === workshopId 
          ? { ...workshop, registered: true }
          : workshop
      );

      set({
        workshops: updatedWorkshops,
        registeredWorkshops: [...registeredWorkshops, workshopId],
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register for workshop',
      });
    }
  },

  unregisterFromWorkshop: async (workshopId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/workshops/${workshopId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to unregister from workshop');
      }

      // Update local state
      const { workshops, registeredWorkshops } = get();
      const updatedWorkshops = workshops.map(workshop => 
        workshop.id === workshopId 
          ? { ...workshop, registered: false }
          : workshop
      );

      set({
        workshops: updatedWorkshops,
        registeredWorkshops: registeredWorkshops.filter(id => id !== workshopId),
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unregister from workshop',
      });
    }
  },

  setFilters: (newFilters: Partial<WorkshopFilters>) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    
    set({ filters: updatedFilters });
    
    // Automatically fetch workshops with new filters
    get().fetchWorkshops();
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
    get().fetchWorkshops();
  },

  searchWorkshops: (query: string) => {
    get().setFilters({ search: query });
  },

  refreshWorkshops: async () => {
    await get().fetchWorkshops();
  },
}));

