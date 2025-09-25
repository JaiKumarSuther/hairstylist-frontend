'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Play, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Download,
  Share2,
  Heart,
  BookOpen
} from 'lucide-react';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

// Mock workshop data - in real app, this would come from API
const mockWorkshop = {
  id: '1',
  title: 'Advanced Cutting Techniques',
  description: 'Learn advanced cutting techniques from industry expert Sarah Johnson. This comprehensive workshop covers precision cutting, layering techniques, and modern styling approaches.',
  instructor: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    bio: 'Professional hairstylist with 15+ years of experience in high-end salons.',
    isVerified: true
  },
  date: '2024-01-15',
  time: '14:00',
  duration: 120,
  maxParticipants: 50,
  currentParticipants: 32,
  skillLevel: 'Advanced',
  category: 'Cutting',
  isLive: false,
  isRecorded: true,
  recordingUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4',
  thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
  materials: [
    'Professional scissors',
    'Cutting comb',
    'Sectioning clips',
    'Spray bottle'
  ],
  agenda: [
    'Introduction and overview (10 min)',
    'Basic cutting principles (20 min)',
    'Advanced layering techniques (45 min)',
    'Modern styling approaches (30 min)',
    'Q&A session (15 min)'
  ],
  isRegistered: false,
  isLiked: false,
  isBookmarked: false
};

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState(mockWorkshop);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'agenda' | 'recording'>('overview');

  useEffect(() => {
    // In real app, fetch workshop data based on params.id
    setIsLoading(true);
    setTimeout(() => {
      setWorkshop(mockWorkshop);
      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const handleRegister = () => {
    if (!user) {
      toast.error('Please login to register for workshops');
      router.push('/login');
      return;
    }

    // Toggle registration status
    setWorkshop(prev => ({
      ...prev,
      isRegistered: !prev.isRegistered,
      currentParticipants: prev.isRegistered 
        ? prev.currentParticipants - 1 
        : prev.currentParticipants + 1
    }));

    toast.success(
      workshop.isRegistered 
        ? 'Successfully unregistered from workshop' 
        : 'Successfully registered for workshop!'
    );
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like workshops');
      return;
    }

    setWorkshop(prev => ({
      ...prev,
      isLiked: !prev.isLiked
    }));

    toast.success(workshop.isLiked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark workshops');
      return;
    }

    setWorkshop(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));

    toast.success(workshop.isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!');
  };

  const handleDownload = () => {
    toast.success('Download started!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: workshop.title,
        text: workshop.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{workshop.title}</h1>
            <p className="text-muted-foreground">
              {workshop.category} • {workshop.skillLevel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workshop Video/Recording */}
            <Card>
              <CardContent className="p-0">
                {workshop.isRecorded ? (
                  <VideoPlayer
                    src={workshop.recordingUrl}
                    title={workshop.title}
                    description={workshop.description}
                    thumbnail={workshop.thumbnail}
                    duration={workshop.duration * 60} // Convert to seconds
                    isLiked={workshop.isLiked}
                    isBookmarked={workshop.isBookmarked}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {workshop.isLive ? 'Live Workshop' : 'Recording not available'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardHeader>
                <div className="flex gap-2">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'materials', label: 'Materials' },
                    { id: 'agenda', label: 'Agenda' },
                    { id: 'recording', label: 'Recording' }
                  ].map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{workshop.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(workshop.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{workshop.time}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Required Materials</h4>
                    <ul className="space-y-2">
                      {workshop.materials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'agenda' && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Workshop Agenda</h4>
                    <ul className="space-y-2">
                      {workshop.agenda.map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'recording' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Workshop Recording</h4>
                      <Badge variant="outline">
                        {workshop.isRecorded ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    {workshop.isRecorded ? (
                      <p className="text-sm text-muted-foreground">
                        This workshop recording is available for registered participants. 
                        You can watch it anytime and download for offline viewing.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Recording will be available after the workshop is completed.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={workshop.instructor.avatar} alt={workshop.instructor.name} />
                    <AvatarFallback>
                      {workshop.instructor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{workshop.instructor.name}</h4>
                      {workshop.instructor.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {workshop.instructor.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workshop Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workshop Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Skill Level</span>
                  <Badge className={getSkillLevelColor(workshop.skillLevel)}>
                    {workshop.skillLevel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm">{workshop.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Participants</span>
                  <span className="text-sm">
                    {workshop.currentParticipants}/{workshop.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">Free</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button 
                  className="w-full"
                  onClick={handleRegister}
                  variant={workshop.isRegistered ? "outline" : "default"}
                >
                  {workshop.isRegistered ? 'Registered' : 'Register for Workshop'}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={workshop.isLiked ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${workshop.isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className={workshop.isBookmarked ? 'text-blue-500 border-blue-500' : ''}
                  >
                    <BookOpen className={`h-4 w-4 mr-2 ${workshop.isBookmarked ? 'fill-current' : ''}`} />
                    Save
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
