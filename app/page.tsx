'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { TrialBanner } from '@/components/dashboard/TrialBanner';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile, isDesktop } = useResponsive();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <ErrorBoundary>
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
              <div className="space-y-8">
                {/* Welcome Section */}
                <WelcomeSection />

                {/* Trial Banner */}
                <TrialBanner />

                {/* Dashboard Cards */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Explore</h2>
                  <DashboardCards />
                </div>
              </div>
            </div>
          </main>

          {/* Bottom navigation for mobile */}
          {isMobile && <BottomNav />}
        </div>
      </div>
    </ErrorBoundary>
  );
}
