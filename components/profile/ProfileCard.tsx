'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Award, Users } from 'lucide-react';

interface ProfileCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    bio?: string;
    location?: string;
    specialties?: string[];
    experience?: string;
    rating?: number;
    reviews?: number;
    followers?: number;
    certifications?: string[];
    joinDate?: string;
  };
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
}

export default function ProfileCard({ 
  user, 
  isOwnProfile = false, 
  onEdit, 
  onFollow 
}: ProfileCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-2xl">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            {user.bio && (
              <p className="text-gray-600 max-w-md">{user.bio}</p>
            )}
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button onClick={onEdit} variant="outline">
                Edit Profile
              </Button>
            ) : (
              <Button onClick={onFollow} variant="default">
                Follow
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{user.rating || 0}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user.reviews || 0}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{user.followers || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
        </div>

        {/* Location and Experience */}
        <div className="space-y-3">
          {user.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.experience && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{user.experience} years experience</span>
            </div>
          )}
        </div>

        {/* Specialties */}
        {user.specialties && user.specialties.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {user.certifications && user.certifications.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </h4>
            <div className="space-y-2">
              {user.certifications.map((cert, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Date */}
        {user.joinDate && (
          <div className="text-sm text-gray-500 text-center">
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
