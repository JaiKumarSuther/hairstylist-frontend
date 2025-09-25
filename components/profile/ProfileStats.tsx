'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play, 
  Heart, 
  Users, 
  Award, 
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    tutorialsCompleted: number;
    tutorialsInProgress: number;
    totalWatchTime: string;
    bookmarks: number;
    likes: number;
    followers: number;
    following: number;
    achievements: number;
    streak: number;
    rating: number;
    reviews: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statCards = [
    {
      title: 'Tutorials Completed',
      value: stats.tutorialsCompleted,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'In Progress',
      value: stats.tutorialsInProgress,
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Watch Time',
      value: stats.totalWatchTime,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Bookmarks',
      value: stats.bookmarks,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Followers',
      value: stats.followers,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current Streak</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {stats.streak} days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Following</span>
              <span className="font-medium">{stats.following}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reviews</span>
              <span className="font-medium">{stats.reviews}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rating & Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.rating}</div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(stats.rating)
                        ? 'fill-current text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Based on {stats.reviews} reviews
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

