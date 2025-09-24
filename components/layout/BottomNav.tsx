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
        "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive 
          ? "text-primary bg-primary/10" 
          : "text-muted-foreground"
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {badge && badge > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
          >
            {badge > 99 ? '99+' : badge}
          </Badge>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Mock badge counts - in real app, these would come from state
  const badgeCounts = {
    '/': 0,
    '/workshops': 2,
    '/gallery': 0,
    '/community': 5,
    '/ai-chat': 1,
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
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
    </nav>
  );
};

