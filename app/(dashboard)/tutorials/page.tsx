'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Clock, 
  Star, 
  Users, 
  Search, 
  Filter,
  BookOpen,
  Video,
  Download,
  Heart,
  Share2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useTutorials, useFavoriteTutorial, useUnfavoriteTutorial } from '@/lib/api/hooks/tutorials';
import { useAuth } from '@/hooks/useAuth';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Tutorial {
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
}

const categories = ['All', 'Color Theory', 'Cutting', 'Styling', 'Natural Hair', 'Business', 'Bridal Styling', 'Men\'s Grooming'];

export default function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  
  const { data: tutorialsData, isLoading, error } = useTutorials();
  const { user } = useAuth();
  const favoriteTutorial = useFavoriteTutorial();
  const unfavoriteTutorial = useUnfavoriteTutorial();

  const tutorials = tutorialsData?.tutorials || [];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleBookmark = async (id: string) => {
    if (!user) return;
    
    try {
      // This would need to be implemented in the API
      console.log('Bookmark tutorial:', id);
    } catch (error) {
      console.error('Failed to bookmark tutorial:', error);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;
    
    try {
      const tutorial = tutorials.find(t => t.id === id);
      if (tutorial?.favorited) {
        await unfavoriteTutorial.mutateAsync(id);
      } else {
        await favoriteTutorial.mutateAsync(id);
      }
    } catch (error) {
      console.error('Failed to like tutorial:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
          <p className="text-gray-600 mt-2">Learn from professional hairstylists and beauty experts</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
          <p className="text-gray-600 mt-2">Learn from professional hairstylists and beauty experts</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load tutorials. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
        <p className="text-gray-600 mt-2">Learn from professional hairstylists and beauty experts</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Category and Difficulty Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map(tutorial => (
          <Card key={tutorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  onClick={() => handleBookmark(tutorial.id)}
                  disabled={!user}
                >
                  <BookOpen className={`h-4 w-4 ${tutorial.favorited ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => handleLike(tutorial.id)}
                  disabled={!user || favoriteTutorial.isPending || unfavoriteTutorial.isPending}
                >
                  {favoriteTutorial.isPending || unfavoriteTutorial.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${tutorial.favorited ? 'fill-current text-red-500' : ''}`} />
                  )}
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                  {tutorial.difficulty}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                <Clock className="h-3 w-3" />
                {Math.floor(tutorial.duration / 60)}:{(tutorial.duration % 60).toString().padStart(2, '0')}
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
                    <span>4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 2000) + 500} views</span>
                  </div>
                  <span>{tutorial.category}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1"
                    onClick={() => setSelectedTutorial(tutorial)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTutorials.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Load More */}
      {filteredTutorials.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Tutorials
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Video Player Modal */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
          </DialogHeader>
          {selectedTutorial && (
            <VideoPlayer
              src={`https://sample-videos.com/zip/10/mp4/SampleVideo_${selectedTutorial.id.padStart(3, '0')}.mp4`}
              title={selectedTutorial.title}
              description={selectedTutorial.description}
              thumbnail={selectedTutorial.thumbnail}
              duration={selectedTutorial.duration}
              isLiked={selectedTutorial.isLiked}
              isBookmarked={selectedTutorial.isBookmarked}
              onLike={() => handleLike(selectedTutorial.id)}
              onBookmark={() => handleBookmark(selectedTutorial.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
