'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useFavorites } from '@/hooks/useLocalStorage';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Mock hairstyle data
const mockHairstyles = [
  {
    id: '1',
    image: '/api/placeholder/300/400',
    category: 'Wedding',
    title: 'Elegant Updo',
    difficulty: 'intermediate',
    duration: 45,
    favorited: false,
  },
  {
    id: '2',
    image: '/api/placeholder/300/400',
    category: 'Party',
    title: 'Beach Waves',
    difficulty: 'beginner',
    duration: 30,
    favorited: true,
  },
  {
    id: '3',
    image: '/api/placeholder/300/400',
    category: 'Professional',
    title: 'Classic Bob',
    difficulty: 'advanced',
    duration: 60,
    favorited: false,
  },
  {
    id: '4',
    image: '/api/placeholder/300/400',
    category: 'Casual',
    title: 'Messy Bun',
    difficulty: 'beginner',
    duration: 15,
    favorited: true,
  },
  {
    id: '5',
    image: '/api/placeholder/300/400',
    category: 'Trending',
    title: 'Curtain Bangs',
    difficulty: 'intermediate',
    duration: 25,
    favorited: false,
  },
  {
    id: '6',
    image: '/api/placeholder/300/400',
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
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden">
        <ImageWithFallback
          src={hairstyle.image}
          alt={hairstyle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
          onClick={() => onFavorite(hairstyle.id)}
        >
          <Heart 
            className={`h-4 w-4 ${
              hairstyle.favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </Button>

        {/* Category badge */}
        <Badge className="absolute top-2 left-2 bg-white/90 text-black">
          {hairstyle.category}
        </Badge>

        {/* Difficulty badge */}
        <Badge className={`absolute bottom-2 left-2 ${getDifficultyColor(hairstyle.difficulty)}`}>
          {hairstyle.difficulty}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{hairstyle.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{hairstyle.duration} min</span>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>1.2k</span>
          </div>
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">
            Discover trending hairstyles and get inspired
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Hairstyles grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredHairstyles.map((hairstyle) => (
            <HairstyleCard
              key={hairstyle.id}
              hairstyle={hairstyle}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

