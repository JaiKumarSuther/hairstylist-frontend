'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import TutorialPlayer from '@/components/tutorials/TutorialPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Heart, Share2, Download } from 'lucide-react';
import Link from 'next/link';

// Mock tutorial data - in a real app, this would come from an API
const mockTutorial = {
  id: '1',
  title: 'Basic Hair Cutting Techniques',
  description: 'Learn the fundamentals of hair cutting with professional techniques and tools. This comprehensive tutorial covers everything from basic scissor work to advanced cutting methods.',
  videoUrl: '/api/placeholder/video.mp4',
  thumbnail: '/api/placeholder/300/200',
  duration: '45 min',
  difficulty: 'Beginner' as const,
  category: 'Hair Cutting',
  instructor: 'Sarah Johnson',
  rating: 4.8,
  views: 1250,
  isBookmarked: false,
  isLiked: false,
  tags: ['cutting', 'basics', 'techniques', 'scissors', 'fundamentals']
};

export default function TutorialDetailPage() {
  const params = useParams();
  const [tutorial, setTutorial] = useState(mockTutorial);

  const handleBookmark = (id: string) => {
    setTutorial(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  const handleLike = (id: string) => {
    setTutorial(prev => ({
      ...prev,
      isLiked: !prev.isLiked
    }));
  };

  const handleShare = (id: string) => {
    // Implement share functionality
    console.log('Sharing tutorial:', id);
  };

  const handleDownload = (id: string) => {
    // Implement download functionality
    console.log('Downloading tutorial:', id);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/tutorials">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <TutorialPlayer
            tutorial={tutorial}
            onBookmark={handleBookmark}
            onLike={handleLike}
            onShare={handleShare}
            onDownload={handleDownload}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tutorial Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tutorial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  {tutorial.difficulty}
                </Badge>
                <Badge variant="outline">{tutorial.category}</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Instructor</h4>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {tutorial.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{tutorial.instructor}</p>
                    <p className="text-sm text-gray-600">Professional Stylist</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">What you'll learn</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Basic scissor techniques</li>
                  <li>• Proper hand positioning</li>
                  <li>• Sectioning and parting</li>
                  <li>• Safety considerations</li>
                  <li>• Common cutting mistakes to avoid</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Materials needed</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Professional hair cutting scissors</li>
                  <li>• Comb</li>
                  <li>• Hair clips</li>
                  <li>• Spray bottle with water</li>
                  <li>• Cape or towel</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Related Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Tutorials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: '2',
                  title: 'Advanced Cutting Techniques',
                  instructor: 'Michael Chen',
                  duration: '1h 20min',
                  difficulty: 'Advanced'
                },
                {
                  id: '3',
                  title: 'Hair Styling Basics',
                  instructor: 'Emma Rodriguez',
                  duration: '35 min',
                  difficulty: 'Beginner'
                }
              ].map(related => (
                <div key={related.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs">📹</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{related.title}</h5>
                    <p className="text-xs text-gray-600">{related.instructor} • {related.duration}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {related.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

