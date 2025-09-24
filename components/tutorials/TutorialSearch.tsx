'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  X, 
  Clock, 
  Star, 
  Play, 
  BookOpen,
  TrendingUp,
  Filter
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  instructor: string;
  rating: number;
  views: number;
  type: 'tutorial' | 'instructor' | 'category';
}

interface TutorialSearchProps {
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

export default function TutorialSearch({ 
  onSearch, 
  onSelect, 
  placeholder = "Search tutorials, instructors, or categories...",
  showSuggestions = true
}: TutorialSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  // Mock data - in a real app, this would come from an API
  const mockSuggestions: SearchResult[] = [
    {
      id: '1',
      title: 'Basic Hair Cutting Techniques',
      description: 'Learn the fundamentals of hair cutting',
      thumbnail: '/api/placeholder/100/60',
      duration: '45 min',
      difficulty: 'Beginner',
      category: 'Hair Cutting',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      views: 1250,
      type: 'tutorial'
    },
    {
      id: '2',
      title: 'Sarah Johnson',
      description: 'Professional hairstylist with 10+ years experience',
      thumbnail: '/api/placeholder/100/60',
      duration: '',
      difficulty: 'Beginner',
      category: 'Instructor',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      views: 0,
      type: 'instructor'
    },
    {
      id: '3',
      title: 'Hair Coloring',
      description: 'Explore hair coloring tutorials and techniques',
      thumbnail: '/api/placeholder/100/60',
      duration: '',
      difficulty: 'Beginner',
      category: 'Hair Coloring',
      instructor: '',
      rating: 0,
      views: 0,
      type: 'category'
    }
  ];

  const mockTrendingSearches = [
    'Hair Cutting Basics',
    'Color Theory',
    'Blowout Techniques',
    'Bridal Styling',
    'Men\'s Haircuts'
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
    
    // Add to recent searches
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return Play;
      case 'instructor': return BookOpen;
      case 'category': return Filter;
      default: return Search;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {query.length <= 2 && showSuggestions && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockTrendingSearches.map((trend, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(trend)}
                      className="text-xs"
                    >
                      {trend}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {query.length > 2 && suggestions.length > 0 && (
              <div className="p-2">
                {suggestions.map((suggestion) => {
                  const Icon = getTypeIcon(suggestion.type);
                  return (
                    <div
                      key={suggestion.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded"
                      onClick={() => handleSelect(suggestion)}
                    >
                      <div className="flex-shrink-0">
                        {suggestion.thumbnail ? (
                          <img
                            src={suggestion.thumbnail}
                            alt={suggestion.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <Icon className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{suggestion.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">{suggestion.description}</p>
                        {suggestion.type === 'tutorial' && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{suggestion.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="h-3 w-3 fill-current text-yellow-400" />
                              <span>{suggestion.rating}</span>
                            </div>
                            <Badge className={getDifficultyColor(suggestion.difficulty)}>
                              {suggestion.difficulty}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {query.length > 2 && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
