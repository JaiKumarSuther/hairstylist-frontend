'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface TutorialRatingProps {
  tutorialId: string;
  currentRating?: number;
  currentReview?: string;
  onRate?: (rating: number, review: string) => void;
  onLike?: () => void;
  onDislike?: () => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  likes?: number;
  dislikes?: number;
}

export default function TutorialRating({ 
  tutorialId,
  currentRating = 0,
  currentReview = '',
  onRate,
  onLike,
  onDislike,
  isLiked = false,
  isDisliked = false,
  likes = 0,
  dislikes = 0
}: TutorialRatingProps) {
  const [rating, setRating] = useState(currentRating);
  const [review, setReview] = useState(currentReview);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    onRate?.(rating, review);
  };

  const getStarColor = (starIndex: number) => {
    const activeRating = hoveredRating || rating;
    return starIndex <= activeRating ? 'text-yellow-400' : 'text-gray-300';
  };

  const getStarFill = (starIndex: number) => {
    const activeRating = hoveredRating || rating;
    return starIndex <= activeRating ? 'fill-current' : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate this Tutorial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Your Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${getStarColor(star)} ${getStarFill(star)}`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} out of 5` : 'Click to rate'}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review">Write a Review (Optional)</Label>
          <Textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this tutorial..."
            rows={4}
          />
        </div>

        {/* Like/Dislike */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={onLike}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              {likes}
            </Button>
            <Button
              variant={isDisliked ? "default" : "outline"}
              size="sm"
              onClick={onDislike}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              {dislikes}
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Rating
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

