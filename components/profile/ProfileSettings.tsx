'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Eye, Globe, Save, X } from 'lucide-react';

interface ProfileSettingsProps {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string;
    location?: string;
    specialties?: string[];
    experience?: string;
    certifications?: string[];
  };
  onSave?: (settings: any) => void;
  onCancel?: () => void;
}

export default function ProfileSettings({ user, onSave, onCancel }: ProfileSettingsProps) {
  const [settings, setSettings] = useState({
    // Privacy settings
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    showExperience: true,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    communityUpdates: true,
    tutorialUpdates: true,
    workshopReminders: true,
    
    // Account settings
    twoFactorAuth: false,
    dataExport: false,
    accountDeletion: false
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave?.(settings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setIsEditing(false);
  };

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVisibility">Profile Visibility</Label>
              <p className="text-sm text-gray-600">Control who can see your profile</p>
            </div>
            <select
              id="profileVisibility"
              value={settings.profileVisibility}
              onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
              disabled={!isEditing}
              className="px-3 py-1 border rounded"
            >
              <option value="public">Public</option>
              <option value="followers">Followers Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email</Label>
                <p className="text-sm text-gray-600">Display your email on your profile</p>
              </div>
              <Switch
                checked={settings.showEmail}
                onCheckedChange={() => handleToggle('showEmail')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Location</Label>
                <p className="text-sm text-gray-600">Display your location on your profile</p>
              </div>
              <Switch
                checked={settings.showLocation}
                onCheckedChange={() => handleToggle('showLocation')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Experience</Label>
                <p className="text-sm text-gray-600">Display your experience level</p>
              </div>
              <Switch
                checked={settings.showExperience}
                onCheckedChange={() => handleToggle('showExperience')}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Emails</Label>
                <p className="text-sm text-gray-600">Receive promotional content</p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Community Updates</Label>
                <p className="text-sm text-gray-600">Get notified about community activity</p>
              </div>
              <Switch
                checked={settings.communityUpdates}
                onCheckedChange={() => handleToggle('communityUpdates')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Tutorial Updates</Label>
                <p className="text-sm text-gray-600">Get notified about new tutorials</p>
              </div>
              <Switch
                checked={settings.tutorialUpdates}
                onCheckedChange={() => handleToggle('tutorialUpdates')}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Workshop Reminders</Label>
                <p className="text-sm text-gray-600">Get reminded about upcoming workshops</p>
              </div>
              <Switch
                checked={settings.workshopReminders}
                onCheckedChange={() => handleToggle('workshopReminders')}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
              disabled={!isEditing}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label>Data Export</Label>
              <p className="text-sm text-gray-600 mb-2">Download a copy of your data</p>
              <Button variant="outline" size="sm" disabled={!isEditing}>
                Request Data Export
              </Button>
            </div>

            <div>
              <Label>Account Deletion</Label>
              <p className="text-sm text-gray-600 mb-2">Permanently delete your account</p>
              <Button variant="destructive" size="sm" disabled={!isEditing}>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}

