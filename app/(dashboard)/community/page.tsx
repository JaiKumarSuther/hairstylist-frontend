'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { usePosts, useLikePost, useUnlikePost, useCreateComment } from '@/lib/api/hooks/community';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Pin, PinOff, AlertTriangle, Shield } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
    isModerator?: boolean;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
  category: string;
  isPinned?: boolean;
  isAnnouncement?: boolean;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const createComment = useCreateComment();

  // Check if current user is a moderator (your mother)
  const isModerator = user?.email === 'mother@hairstylist.com' || user?.name?.includes('Moderator');

  const handleLike = async () => {
    if (!user) return;
    
    if (post.liked) {
      await unlikePost.mutateAsync(post.id);
    } else {
      await likePost.mutateAsync(post.id);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      await createComment.mutateAsync({
        postId: post.id,
        data: { content: commentText.trim() }
      });
      setCommentText('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handlePinPost = () => {
    // TODO: Implement pin/unpin functionality
    console.log('Pin/unpin post:', post.id);
  };

  const handleReportPost = () => {
    // TODO: Implement report functionality
    console.log('Report post:', post.id);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${
      post.isPinned ? 'border-l-4 border-l-primary bg-primary/5' : ''
    }`}>
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
                {post.author.isModerator && (
                  <Badge variant="default" className="text-xs px-1 py-0 bg-blue-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Moderator
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <Badge variant="default" className="text-xs bg-primary">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            {post.isAnnouncement && (
              <Badge variant="default" className="text-xs bg-orange-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Announcement
              </Badge>
            )}
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
              onClick={handleLike}
              disabled={likePost.isPending || unlikePost.isPending}
            >
              {likePost.isPending || unlikePost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
              )}
              {post.likes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-muted-foreground"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            {/* Moderator Actions */}
            {isModerator && (
              <div className="flex items-center gap-1 border-l pl-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePinPost}
                  className={`gap-2 text-xs ${
                    post.isPinned ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {post.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  {post.isPinned ? 'Unpin' : 'Pin'}
                </Button>
              </div>
            )}
            
            {/* Report Button for non-moderators */}
            {!isModerator && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReportPost}
                className="gap-2 text-muted-foreground hover:text-red-500"
              >
                <AlertTriangle className="h-4 w-4" />
                Report
              </Button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t pt-4 space-y-3">
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                disabled={!user || createComment.isPending}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!user || !commentText.trim() || createComment.isPending}
              >
                {createComment.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Post'
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function CommunityPage() {
  const { data: postsData, isLoading, error } = usePosts();
  const { user } = useAuth();
  
  // Check if current user is a moderator
  const isModerator = user?.email === 'mother@hairstylist.com' || user?.name?.includes('Moderator');

  if (isLoading) {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error) {
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">Failed to load posts. Please try again later.</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  const posts = postsData?.posts || [];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow stylists and share your work
            </p>
            {isModerator && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="bg-blue-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Moderator
                </Badge>
                <span className="text-sm text-muted-foreground">
                  You have moderation privileges
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {isModerator && (
              <Button variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            )}
            <Button>Create Post</Button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <PostCard 
                key={post.id} 
                post={{
                  ...post,
                  timestamp: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
                  author: {
                    name: post.author?.name || 'Unknown User',
                    avatar: post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                    isVerified: post.author?.isPremium || false,
                  },
                  images: post.images ? JSON.parse(post.images) : undefined,
                }}
              />
            ))
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

