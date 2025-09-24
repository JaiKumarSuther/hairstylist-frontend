'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Menu, ArrowLeft, Home, Calendar, Image, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  actions,
  onMenuClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { isMobile } = useResponsive();

  const handleBack = () => {
    router.back();
  };

  // Navigation items
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Calendar, label: 'Workshops', href: '/workshops' },
    { icon: Image, label: 'Gallery', href: '/gallery' },
    { icon: Users, label: 'Community', href: '/community' },
    { icon: MessageCircle, label: 'AI Chat', href: '/ai-chat' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {isMobile && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            {!isMobile && (
              <span className="font-semibold text-lg">Hairstylist</span>
            )}
          </Link>
        </div>

        {/* Center section - Navigation */}
        {!isMobile && isAuthenticated && (
          <nav className="flex-1 flex items-center justify-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                {/* TODO: Add real notification count from API */}
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <span className="text-sm font-medium">{user?.name}</span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {actions}
        </div>
      </div>
    </header>
  );
};

