'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Image, 
  Play, 
  Users, 
  MessageCircle,
  LucideIcon 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/lib/types';
// import { useAuth } from '@/hooks/useAuth'; // Will be used for premium features

interface DashboardCardProps {
  card: DashboardCard;
}

const DashboardCardComponent: React.FC<DashboardCardProps> = ({ card }) => {
  const iconMap: Record<string, LucideIcon> = {
    Calendar,
    Image,
    Play,
    Users,
    MessageCircle,
  };
  
  const IconComponent = iconMap[card.icon] || Calendar;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={card.href}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.description && (
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                )}
              </div>
            </div>
            {card.badge && card.badge > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {card.badge}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{card.preview}</p>
          <Button variant="ghost" className="w-full group-hover:bg-primary/10">
            Explore
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};

export const DashboardCards: React.FC = () => {
  // const { user, isPremium, trialDaysLeft } = useAuth(); // Will be used for premium features

  // Mock data - in real app, this would come from API
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Workshops',
      icon: 'Calendar',
      preview: 'Join our next cutting techniques workshop',
      href: '/workshops',
      badge: 2,
      description: 'Live training sessions'
    },
    {
      title: 'Gallery',
      icon: 'Image',
      preview: 'Discover trending hairstyles and techniques',
      href: '/gallery',
      description: 'Style inspiration'
    },
    {
      title: 'Tutorials',
      icon: 'Play',
      preview: 'Step-by-step video tutorials',
      href: '/tutorials',
      description: 'Learn at your pace'
    },
    {
      title: 'Community',
      icon: 'Users',
      preview: 'Connect with fellow stylists',
      href: '/community',
      badge: 5,
      description: 'Share and learn'
    },
    {
      title: 'AI Chat',
      icon: 'MessageCircle',
      preview: 'Get instant styling advice',
      href: '/ai-chat',
      badge: 1,
      description: 'AI-powered assistance'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboardCards.map((card, index) => (
        <DashboardCardComponent key={index} card={card} />
      ))}
    </div>
  );
};

