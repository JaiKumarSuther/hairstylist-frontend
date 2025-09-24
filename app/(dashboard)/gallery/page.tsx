'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useFavorites } from '@/hooks/useLocalStorage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// TODO: Replace with real data from API hooks
const mockHairstyles = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=400&fit=crop',
    category: 'Wedding',
    title: 'Elegant Updo',
    difficulty: 'intermediate',
    duration: 45,
    favorited: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=400&fit=crop',
    category: 'Party',
    title: 'Beach Waves',
    difficulty: 'beginner',
    duration: 30,
    favorited: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop',
    category: 'Professional',
    title: 'Classic Bob',
    difficulty: 'advanced',
    duration: 60,
    favorited: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    category: 'Casual',
    title: 'Messy Bun',
    difficulty: 'beginner',
    duration: 15,
    favorited: true,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1594736797933-d0c29b1a0b5a?w=300&h=400&fit=crop',
    category: 'Trending',
    title: 'Curtain Bangs',
    difficulty: 'intermediate',
    duration: 25,
    favorited: false,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=400&fit=crop',
    category: 'Wedding',
    title: 'Romantic Braids',
    difficulty: 'advanced',
    duration: 90,
    favorited: false,
  },
];

const categories = ['All', 'Wedding', 'Party', 'Professional', 'Casual', 'Trending'];

const HairstyleCard: React.FC<{ 
  hairstyle: typeof mockHairstyles[0];
  onFavorite: (id: string) => void;
}> = ({ hairstyle, onFavorite }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-emerald-200';
      case 'intermediate': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-200';
      case 'advanced': return 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-rose-200';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wedding': return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'Party': return 'bg-gradient-to-r from-purple-500 to-violet-500';
      case 'Professional': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'Casual': return 'bg-gradient-to-r from-teal-500 to-cyan-500';
      case 'Trending': return 'bg-gradient-to-r from-orange-500 to-pink-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={hairstyle.image}
          alt={hairstyle.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Dynamic gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Favorite button with enhanced styling */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-10 w-10 bg-white/90 hover:bg-white backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full"
          onClick={() => onFavorite(hairstyle.id)}
        >
          <Heart 
            className={`h-5 w-5 transition-all duration-300 ${
              hairstyle.favorited 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-gray-600 hover:text-red-400 hover:scale-110'
            }`} 
          />
        </Button>

        {/* Enhanced category badge */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg ${getCategoryColor(hairstyle.category)}`}>
          {hairstyle.category}
        </div>

        {/* Enhanced difficulty badge */}
        <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getDifficultyColor(hairstyle.difficulty)}`}>
          {hairstyle.difficulty}
        </div>

        {/* View count with enhanced styling */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs font-medium">
          <Eye className="h-3.5 w-3.5" />
          <span>1.2k</span>
        </div>
      </div>

      <CardContent className="relative p-5 bg-white">
        {/* Enhanced title with better typography */}
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
          {hairstyle.title}
        </h3>
        
        {/* Enhanced duration display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600">
              {hairstyle.duration} min
            </span>
          </div>
          
          {/* Enhanced action button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all duration-300"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toggleFavorite } = useFavorites();

  const filteredHairstyles = selectedCategory === 'All' 
    ? mockHairstyles 
    : mockHairstyles.filter(h => h.category === selectedCategory);

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Enhanced header section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            Featured Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trending hairstyles and get inspired by our curated collection of beautiful looks
          </p>
        </div>

        {/* Enhanced category filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Enhanced hairstyles grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredHairstyles.map((hairstyle, index) => (
            <div 
              key={hairstyle.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HairstyleCard
                hairstyle={hairstyle}
                onFavorite={handleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

