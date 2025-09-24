'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Play, BookOpen } from 'lucide-react';

interface TutorialProgressProps {
  tutorial: {
    id: string;
    title: string;
    duration: string;
    progress: number; // 0-100
    completed: boolean;
    lastWatched?: Date;
    bookmarked: boolean;
  };
  onContinue?: () => void;
  onBookmark?: () => void;
}

export default function TutorialProgress({ 
  tutorial, 
  onContinue, 
  onBookmark 
}: TutorialProgressProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return 'Completed';
    if (progress >= 50) return 'In Progress';
    if (progress >= 25) return 'Started';
    return 'Not Started';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{tutorial.duration}</span>
              {tutorial.lastWatched && (
                <>
                  <span>•</span>
                  <span>Last watched {tutorial.lastWatched.toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
            >
              <BookOpen className={`h-4 w-4 ${tutorial.bookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={tutorial.completed ? "default" : "secondary"}
                className={tutorial.completed ? "bg-green-100 text-green-800" : ""}
              >
                {getProgressText(tutorial.progress)}
              </Badge>
              <span className="text-sm text-gray-600">{tutorial.progress}%</span>
            </div>
          </div>
          <Progress 
            value={tutorial.progress} 
            className="h-2"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {tutorial.completed ? (
            <Button className="w-full" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Tutorial
            </Button>
          ) : tutorial.progress > 0 ? (
            <Button className="w-full" onClick={onContinue}>
              <Play className="h-4 w-4 mr-2" />
              Continue Watching
            </Button>
          ) : (
            <Button className="w-full" onClick={onContinue}>
              <Play className="h-4 w-4 mr-2" />
              Start Tutorial
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
