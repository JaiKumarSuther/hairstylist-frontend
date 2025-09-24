'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Mock community posts
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
    },
    content: 'Just finished this amazing balayage technique! The color transition is so smooth. What do you think?',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    liked: false,
    category: 'Technique',
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      isVerified: false,
    },
    content: 'Looking for advice on cutting curly hair. Any tips for maintaining the natural curl pattern while adding layers?',
    timestamp: '4 hours ago',
    likes: 12,
    comments: 15,
    liked: true,
    category: 'Question',
  },
  {
    id: '3',
    author: {
      name: 'Emma Rodriguez',
      avatar: '/api/placeholder/40/40',
      isVerified: true,
    },
    content: 'Behind the scenes of our latest photoshoot! The team worked so hard to create this stunning look.',
    images: ['/api/placeholder/400/300'],
    timestamp: '6 hours ago',
    likes: 45,
    comments: 12,
    liked: false,
    category: 'Behind the Scenes',
  },
];

const PostCard: React.FC<{ post: typeof mockPosts[0] }> = ({ post }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{post.author.name}</h3>
                {post.author.isVerified && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    ✓
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{post.content}</p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 ${
            post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                <Image 
                  src={image} 
                  alt={`Post image ${index + 1}`}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 ${
                post.liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CommunityPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow stylists and share your work
            </p>
          </div>
          <Button>Create Post</Button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

