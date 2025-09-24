'use client';

import React from 'react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { TrialBanner } from '@/components/dashboard/TrialBanner';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

