'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isDesktop } = useResponsive();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      {isDesktop && (
        <Sidebar isOpen={true} onClose={() => {}} />
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      )}

      {/* Main content area */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isDesktop ? "lg:ml-64" : ""
      )}>
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Main content */}
        <main className={cn(
          "min-h-screen",
          isMobile ? "pb-20" : "" // Add padding for bottom nav on mobile
        )}>
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        {/* Bottom navigation for mobile */}
        {isMobile && <BottomNav />}
      </div>
    </div>
  );
}

