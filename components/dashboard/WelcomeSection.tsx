'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const WelcomeSection: React.FC = () => {
  const { user, isPremium, trialDaysLeft, isAuthenticated } = useAuth();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = () => {
    if (isPremium) {
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Crown className="h-3 w-3 mr-1" />
          Premium Member
        </Badge>
      );
    }
    
    if (trialDaysLeft > 0) {
      return (
        <Badge variant="outline" className="border-primary/20 text-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          {trialDaysLeft} days left
        </Badge>
      );
    }
    
    return null;
  };

  const getFeaturedContent = () => {
    // TODO: Replace with real featured workshop from API
    return {
      title: 'Advanced Cutting Techniques',
      instructor: 'Sarah Johnson',
      date: 'Tomorrow at 2:00 PM',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=200&fit=crop',
      isLive: true
    };
  };

  const featured = getFeaturedContent();

  const handleJoinNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to join workshops');
      router.push('/login');
      return;
    }

    // For now, redirect to workshops page with a filter for live workshops
    router.push('/workshops?filter=live');
    toast.success('Redirecting to live workshops...');
  };

  const handleLearnMore = () => {
    // For now, redirect to workshops page to show all workshops
    router.push('/workshops');
    toast.success('Explore all available workshops');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {user?.name || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to learn something new today?
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Featured Workshop */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">Featured Workshop</h2>
                {featured.isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    Live Now
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{featured.title}</h3>
              <p className="text-muted-foreground mb-4">
                with {featured.instructor} • {featured.date}
              </p>
              <div className="flex gap-2">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleJoinNow}
                >
                  {featured.isLive ? 'Join Now' : 'Register'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleLearnMore}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="ml-6">
              <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl">✂️</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

