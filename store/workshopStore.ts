import { create } from 'zustand';
import { Workshop, WorkshopFilters, WorkshopState } from '@/lib/types';

interface WorkshopStore extends WorkshopState {
  // Actions
  setFilters: (filters: Partial<WorkshopFilters>) => void;
  clearFilters: () => void;
  searchWorkshops: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
  setFilters: (newFilters: Partial<WorkshopFilters>) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },

  searchWorkshops: (query: string) => {
    get().setFilters({ search: query });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

