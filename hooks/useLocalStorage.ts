import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('hairstylist_favorites', []);

  const addFavorite = (id: string) => {
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(favId => favId !== id));
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}

// Hook for managing recent searches
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'hairstylist_recent_searches',
    []
  );

  const addSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newSearches = [query.trim(), ...recentSearches].slice(0, 10); // Keep only 10 recent searches
      setRecentSearches(newSearches);
    }
  };

  const clearSearches = () => {
    setRecentSearches([]);
  };

  const removeSearch = (query: string) => {
    setRecentSearches(recentSearches.filter(search => search !== query));
  };

  return {
    recentSearches,
    addSearch,
    clearSearches,
    removeSearch,
  };
}

// Hook for managing user preferences
export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage('hairstylist_preferences', {
    theme: 'light',
    notifications: true,
    autoPlay: false,
    quality: 'high',
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };

  return {
    preferences,
    updatePreference,
    setPreferences,
  };
}

