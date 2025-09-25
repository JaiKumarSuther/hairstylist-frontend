'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Edit3, Save, X, User, Mail, Phone, MapPin, Calendar, Crown, Check, Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isPremium, trialDaysLeft } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const searchParams = useSearchParams();

  // Handle URL parameters for tab selection
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'subscription') {
      setActiveTab('subscription');
    }
  }, [searchParams]);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    specialties: user?.specialties || [],
    experience: user?.experience || '',
    certifications: user?.certifications || []
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      specialties: user?.specialties || [],
      experience: user?.experience || '',
      certifications: user?.certifications || []
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpgrade = (planType: 'monthly' | 'annual') => {
    const price = planType === 'monthly' ? '$19.99' : '$199.99';
    const period = planType === 'monthly' ? 'month' : 'year';
    
    // For now, show a toast message
    // In a real app, this would redirect to a payment processor like Stripe
    toast.success(`Redirecting to payment for ${planType} plan (${price}/${period})...`);
    
    // Simulate redirect to payment page
    setTimeout(() => {
      toast.success('Payment integration would be implemented here (Stripe, PayPal, etc.)');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0] || user?.name?.[0]}{user?.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-600">Click edit to change your profile photo</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., 5 years"
                />
              </div>

              <div className="space-y-2">
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Add Specialty
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Certifications</Label>
                <div className="space-y-2">
                  {profileData.certifications.map((cert: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span>{cert}</span>
                      {isEditing && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Add Certification
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email updates about new content</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Toggle
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified about community activity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Toggle
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Toggle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isPremium ? 'bg-primary/10' : 'bg-orange-100'
                  }`}>
                    {isPremium ? (
                      <Crown className="h-5 w-5 text-primary" />
                    ) : (
                      <Star className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isPremium ? 'Premium Member' : 'Free Trial'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isPremium 
                        ? 'You have access to all premium features'
                        : `${trialDaysLeft} days left in your trial`
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? 'Active' : 'Trial'}
                </Badge>
              </div>

              {/* Premium Features */}
              <div className="space-y-4">
                <h4 className="font-semibold">Premium Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Unlimited workshop access</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Advanced AI chat features</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Exclusive content</span>
                  </div>
                </div>
              </div>

              {/* Upgrade Options */}
              {!isPremium && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Upgrade Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h5 className="font-semibold mb-2">Monthly Plan</h5>
                          <div className="text-2xl font-bold text-primary mb-2">$19.99</div>
                          <p className="text-sm text-muted-foreground mb-4">per month</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleUpgrade('monthly')}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h5 className="font-semibold mb-2">Annual Plan</h5>
                          <div className="text-2xl font-bold text-primary mb-2">$199.99</div>
                          <p className="text-sm text-muted-foreground mb-4">per year (Save 17%)</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleUpgrade('annual')}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Payment Methods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 font-bold">S</span>
                          </div>
                          <h6 className="font-medium">Stripe</h6>
                          <p className="text-xs text-muted-foreground">Credit/Debit Cards</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Pay with Stripe
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-orange-200">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-orange-600 font-bold">P</span>
                          </div>
                          <h6 className="font-medium">PayPal</h6>
                          <p className="text-xs text-muted-foreground">PayPal Account</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Pay with PayPal
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-green-200">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-600 font-bold">J</span>
                          </div>
                          <h6 className="font-medium">JazzCash</h6>
                          <p className="text-xs text-muted-foreground">Mobile Wallet</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Pay with JazzCash
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-purple-200">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-purple-600 font-bold">E</span>
                          </div>
                          <h6 className="font-medium">EasyPaisa</h6>
                          <p className="text-xs text-muted-foreground">Mobile Wallet</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Pay with EasyPaisa
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-gray-200">
                        <CardContent className="p-4 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-gray-600 font-bold">B</span>
                          </div>
                          <h6 className="font-medium">Bank Transfer</h6>
                          <p className="text-xs text-muted-foreground">Direct Bank Transfer</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            Bank Details
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Information */}
              {isPremium && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Billing Information</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Next billing date</span>
                      <span className="text-sm">January 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Amount</span>
                      <span className="text-sm">$19.99</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update Payment Method
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}