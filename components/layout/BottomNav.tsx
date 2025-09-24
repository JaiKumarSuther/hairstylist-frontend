'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Image, 
  Users, 
  MessageCircle,
  LucideIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive, 
  badge 
}) => {
  return (
    <Link
      href={href}
      className={cn(
        // Flutter Material Design base styles
        "group flex flex-col items-center justify-center gap-1 px-2 py-2 min-w-0 flex-1",
        "flutter-transition flutter-ripple",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
        "relative overflow-hidden",
        // Flutter-style active state
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {/* Flutter Material Design ripple effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute inset-0 flutter-transition",
          "group-active:bg-primary/12 group-active:scale-110",
          isActive ? "bg-primary/8" : "group-hover:bg-primary/6"
        )} />
      </div>
      
      {/* Icon with Flutter Material Design styling */}
      <div className="relative z-10 flex items-center justify-center">
        <div className={cn(
          "p-1.5 rounded-full flutter-transition",
          isActive 
            ? "bg-primary/12 flutter-elevation-1" 
            : "group-hover:bg-primary/8"
        )}>
          <Icon className={cn(
            "h-5 w-5 flutter-transition",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground group-hover:text-foreground"
          )} />
        </div>
        
        {/* Flutter Material Design badge */}
        {badge && badge > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs font-medium rounded-full flutter-elevation-1"
          >
            {badge > 99 ? '99+' : badge}
          </Badge>
        )}
      </div>
      
      {/* Flutter Material Design typography */}
      <span className={cn(
        "text-xs font-medium flutter-transition z-10 text-center leading-tight",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground group-hover:text-foreground"
      )}>
        {label}
      </span>
      
      {/* Flutter-style active indicator with Material Design animation */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full flutter-transition" />
      )}
    </Link>
  );
};

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // TODO: Replace with real badge counts from API
  const badgeCounts = {
    '/': 0,
    '/workshops': 0, // Will be populated from API
    '/gallery': 0,
    '/community': 0, // Will be populated from API
    '/ai-chat': 0, // Will be populated from API
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flutter-bottom-nav">
      {/* Flutter Material Design background with elevation */}
      <div className="absolute inset-0 flutter-elevation-2" />
      
      {/* Navigation content with Flutter layout */}
      <div className="relative">
        <div className="flex items-stretch h-16 px-1">
          {NAV_ITEMS.map((item) => {
            const iconMap: Record<string, LucideIcon> = {
              Home,
              Calendar,
              Image,
              Users,
              MessageCircle,
            };
            
            const IconComponent = iconMap[item.icon] || Home;

            return (
              <NavItem
                key={item.href}
                icon={IconComponent}
                label={item.label}
                href={item.href}
                isActive={isActive(item.href)}
                badge={badgeCounts[item.href as keyof typeof badgeCounts]}
              />
            );
          })}
        </div>
      </div>
      
      {/* Flutter-style safe area */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
};

