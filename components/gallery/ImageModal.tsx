'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Download, Share2, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface HairstyleImage {
  id: string;
  image: string;
  title: string;
  category: string;
  difficulty?: string;
  duration?: number;
  favorited?: boolean;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: HairstyleImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onFavorite: (id: string) => void;
  onDownload?: (image: HairstyleImage) => void;
  onShare?: (image: HairstyleImage) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  onFavorite,
  onDownload,
  onShare,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { user } = useAuth();

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleDownload = () => {
    if (!currentImage) return;
    
    if (onDownload) {
      onDownload(currentImage);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = currentImage.image;
      link.download = `${currentImage.title}.jpg`;
      link.click();
    }
    toast.success('Image downloaded!');
  };

  const handleShare = () => {
    if (!currentImage) return;
    
    if (navigator.share) {
      navigator.share({
        title: currentImage.title,
        text: `Check out this hairstyle: ${currentImage.title}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
    
    if (onShare) {
      onShare(currentImage);
    }
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    onFavorite(currentImage.id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl h-[90vh] p-0 bg-black border-0"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">{currentImage.title}</h2>
              <p className="text-sm text-gray-300">
                {currentImage.category} • {currentIndex + 1} of {images.length}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-white text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/20"
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="relative cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <ImageWithFallback
              src={currentImage.image}
              alt={currentImage.title}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={`text-white hover:bg-white/20 ${
                  currentImage.favorited ? 'text-red-500' : ''
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${currentImage.favorited ? 'fill-current' : ''}`} />
                {currentImage.favorited ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <div className="flex gap-2 overflow-x-auto max-w-[400px] p-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    onIndexChange(index);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-white scale-110' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={image.image}
                    alt={image.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
