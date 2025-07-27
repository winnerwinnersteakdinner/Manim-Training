import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark, Flag, Eye, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface WellnessStory {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  location?: string;
  createdAt: string;
  isAnonymous: boolean;
  emotionalTags: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface WellnessStoryCardProps {
  story: WellnessStory;
  onLike?: (storyId: string) => void;
  onComment?: (storyId: string) => void;
  onShare?: (storyId: string) => void;
  onBookmark?: (storyId: string) => void;
  onReport?: (storyId: string) => void;
  compact?: boolean;
}

const WellnessStoryCard = ({
  story,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReport,
  compact = false
}: WellnessStoryCardProps) => {
  const [isLiked, setIsLiked] = useState(story.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(story.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(story.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike?.(story.id);
    toast.success(isLiked ? 'Removed from likes' : 'Added to likes');
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(story.id);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    onShare?.(story.id);
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {story.isAnonymous ? (
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  ?
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-10 h-10">
                <AvatarImage src={story.author.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {story.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground text-sm truncate">
                  {story.isAnonymous ? 'Anonymous' : story.author.name}
                </p>
                {story.author.verified && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(story.createdAt)}
                {story.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {story.location}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onReport?.(story.id)}
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-2 leading-tight">
            {story.title}
          </h3>
          <p className={`text-muted-foreground leading-relaxed ${compact ? 'line-clamp-3' : ''}`}>
            {story.content}
          </p>
        </div>

        {/* Emotional Tags */}
        {story.emotionalTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {story.emotionalTags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {story.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {story.comments}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-3 ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(story.id)}
              className="h-8 px-3"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Comment
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`h-8 w-8 p-0 ${isBookmarked ? 'text-primary' : ''}`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessStoryCard;