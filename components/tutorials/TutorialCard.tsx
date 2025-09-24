'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Heart, 
  Share2, 
  Download 
} from 'lucide-react';

interface TutorialCardProps {
  tutorial: {
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
    isBookmarked: boolean;
    isLiked: boolean;
    tags: string[];
  };
  onBookmark?: (id: string) => void;
  onLike?: (id: string) => void;
  onWatch?: (id: string) => void;
  onShare?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function TutorialCard({ 
  tutorial, 
  onBookmark, 
  onLike, 
  onWatch, 
  onShare, 
  onDownload 
}: TutorialCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0"
            onClick={() => onBookmark?.(tutorial.id)}
          >
            <BookOpen className={`h-4 w-4 ${tutorial.isBookmarked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0"
            onClick={() => onLike?.(tutorial.id)}
          >
            <Heart className={`h-4 w-4 ${tutorial.isLiked ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge className={getDifficultyColor(tutorial.difficulty)}>
            {tutorial.difficulty}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          <Clock className="h-3 w-3" />
          {tutorial.duration}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{tutorial.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{tutorial.description}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{tutorial.instructor}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span>{tutorial.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{tutorial.views} views</span>
            </div>
            <span>{tutorial.category}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {tutorial.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={() => onWatch?.(tutorial.id)}>
              <Play className="h-4 w-4 mr-2" />
              Watch Now
            </Button>
            <Button variant="outline" size="sm" onClick={() => onShare?.(tutorial.id)}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDownload?.(tutorial.id)}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
