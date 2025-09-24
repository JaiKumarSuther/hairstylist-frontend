'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Mock workshop data
const mockWorkshops = [
  {
    id: '1',
    title: 'Advanced Cutting Techniques',
    instructor: 'Sarah Johnson',
    date: '2024-01-15',
    time: '2:00 PM',
    image: '/api/placeholder/400/200',
    category: 'Cutting',
    description: 'Learn advanced cutting techniques for modern hairstyles',
    duration: 120,
    skillLevel: 'intermediate',
    registered: false,
    maxParticipants: 20,
    currentParticipants: 15,
    price: 0,
    isFree: true,
  },
  {
    id: '2',
    title: 'Color Theory & Application',
    instructor: 'Michael Chen',
    date: '2024-01-18',
    time: '10:00 AM',
    image: '/api/placeholder/400/200',
    category: 'Coloring',
    description: 'Master color theory and application techniques',
    duration: 180,
    skillLevel: 'beginner',
    registered: true,
    maxParticipants: 15,
    currentParticipants: 12,
    price: 0,
    isFree: true,
  },
  {
    id: '3',
    title: 'Business & Marketing for Stylists',
    instructor: 'Emma Rodriguez',
    date: '2024-01-20',
    time: '6:00 PM',
    image: '/api/placeholder/400/200',
    category: 'Business',
    description: 'Build your client base and grow your business',
    duration: 90,
    skillLevel: 'beginner',
    registered: false,
    maxParticipants: 30,
    currentParticipants: 25,
    price: 0,
    isFree: true,
  },
];

const WorkshopCard: React.FC<{ workshop: typeof mockWorkshops[0] }> = ({ workshop }) => {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{workshop.title}</CardTitle>
            <CardDescription className="text-sm">
              {workshop.description}
            </CardDescription>
          </div>
          <Badge className={getSkillLevelColor(workshop.skillLevel)}>
            {workshop.skillLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {workshop.instructor}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {workshop.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {workshop.time}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {workshop.currentParticipants}/{workshop.maxParticipants} participants
          </div>
          <div className="text-sm font-medium">
            {workshop.isFree ? 'Free' : `$${workshop.price}`}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1"
            variant={workshop.registered ? "outline" : "default"}
          >
            {workshop.registered ? 'Registered' : 'Register'}
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WorkshopsPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workshops</h1>
          <p className="text-muted-foreground">
            Join live training sessions with industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWorkshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

