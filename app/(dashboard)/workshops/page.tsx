'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useWorkshops, useRegisterWorkshop, useUnregisterWorkshop } from '@/lib/api/hooks/workshops';
import { useWorkshopStore } from '@/store/workshopStore';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { addToCalendar, setWorkshopReminder } from '@/lib/calendar';
import { scheduleWorkshopReminders } from '@/lib/notifications';

const WorkshopCard: React.FC<{ workshop: any }> = ({ workshop }) => {
  const registerMutation = useRegisterWorkshop();
  const unregisterMutation = useUnregisterWorkshop();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const getSkillLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegister = async () => {
    // Check if user is authenticated before attempting registration
    if (!isAuthenticated) {
      toast.error('Please login to register for workshops');
      router.push('/login');
      return;
    }

    // Check if there's a valid token in localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login to register for workshops');
      router.push('/login');
      return;
    }

    if (workshop.registered) {
      unregisterMutation.mutate(workshop.id);
    } else {
      registerMutation.mutate(workshop.id);
      
      // Add to calendar and set reminder
      const eventDate = new Date(`${workshop.date} ${workshop.time}`);
      const endDate = new Date(eventDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours duration
      
      const calendarEvent = {
        title: workshop.title,
        description: `Workshop: ${workshop.description}\nInstructor: ${workshop.instructor}`,
        startDate: eventDate,
        endDate: endDate,
        location: 'Online Workshop',
        url: `${window.location.origin}/workshops/${workshop.id}`,
      };
      
      const calendarSuccess = await addToCalendar(calendarEvent);
      const reminderSuccess = await setWorkshopReminder(workshop);
      
      // Schedule push notifications
      if (user) {
        scheduleWorkshopReminders(
          workshop.id,
          workshop.title,
          eventDate,
          user.id || user.email || 'anonymous'
        );
      }
      
      if (calendarSuccess) {
        toast.success('Workshop added to your calendar!');
      }
      
      if (reminderSuccess) {
        toast.success('Reminder set for 1 day before the workshop!');
      }
      
      toast.success('Push notifications scheduled for workshop reminders!');
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2">{workshop.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-3">
              {workshop.description}
            </CardDescription>
          </div>
          <Badge className={getSkillLevelColor(workshop.skillLevel)}>
            {workshop.skillLevel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{workshop.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{new Date(workshop.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{workshop.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
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
            onClick={handleRegister}
            disabled={registerMutation.isPending || unregisterMutation.isPending}
          >
            {registerMutation.isPending || unregisterMutation.isPending 
              ? 'Loading...' 
              : workshop.registered 
                ? 'Registered' 
                : isAuthenticated 
                  ? 'Register' 
                  : 'Login to Register'
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push(`/workshops/${workshop.id}`)}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function WorkshopsPage() {
  const { filters, setFilters, searchWorkshops } = useWorkshopStore();
  const { data: workshopsData, isLoading, error } = useWorkshops(filters);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  // Handle URL parameters for filtering
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'live') {
      // Filter for live workshops (you can implement this logic based on your data structure)
      setFilters({ ...filters, date_range: 'upcoming' });
      toast.success('Showing live workshops');
    }
  }, [searchParams, setFilters, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchWorkshops(searchQuery);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load workshops. Please try again.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workshops</h1>
          <p className="text-muted-foreground">
            Join live training sessions with industry experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshopsData?.workshops?.map((workshop: any) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>

        {workshopsData?.workshops?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No workshops found.</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

