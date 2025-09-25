'use client';

import React from 'react';
import { X, Crown, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const TrialBanner: React.FC = () => {
  const { isPremium, trialDaysLeft } = useAuth();
  const [dismissed, setDismissed] = useLocalStorage('trial_banner_dismissed', false);
  const router = useRouter();

  // Don't show banner if user is premium or trial is dismissed
  if (isPremium || dismissed) {
    return null;
  }

  // Don't show if trial is expired
  if (trialDaysLeft <= 0) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleUpgrade = () => {
    // For now, redirect to profile page where user can manage subscription
    // In a real app, this would redirect to a payment/subscription page
    router.push('/profile?tab=subscription');
    toast.success('Redirecting to subscription management...');
  };

  const getTrialMessage = () => {
    if (trialDaysLeft === 1) {
      return 'Last day of your free trial!';
    }
    if (trialDaysLeft <= 3) {
      return `Only ${trialDaysLeft} days left in your trial`;
    }
    return `${trialDaysLeft} days left in your free trial`;
  };

  const getUrgencyLevel = () => {
    if (trialDaysLeft === 1) return 'high';
    if (trialDaysLeft <= 3) return 'medium';
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <Card className={`border-l-4 ${
      urgencyLevel === 'high' 
        ? 'border-destructive bg-destructive/5' 
        : urgencyLevel === 'medium'
        ? 'border-orange-500 bg-orange-50'
        : 'border-primary bg-primary/5'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              urgencyLevel === 'high' 
                ? 'bg-destructive/10' 
                : urgencyLevel === 'medium'
                ? 'bg-orange-100'
                : 'bg-primary/10'
            }`}>
              {urgencyLevel === 'high' ? (
                <Clock className="h-5 w-5 text-destructive" />
              ) : (
                <Crown className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">
                  {getTrialMessage()}
                </h3>
                {urgencyLevel === 'high' && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upgrade to premium to continue enjoying all features
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleUpgrade}
              className="bg-primary hover:bg-primary/90"
            >
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Now
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

