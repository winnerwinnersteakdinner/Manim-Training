import React, { useState } from 'react';
import { Plus, MapPin, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Post = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (!user) {
      toast.error('Please sign in to create a story');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual story creation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Story created successfully!');
      
      // Reset form
      setTitle('');
      setContent('');
      setLocation('');
      setIsAnonymous(false);
      
      // Navigate to feed or story view
      navigate('/');
    } catch (error) {
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (window.confirm('Are you sure you want to discard your story?')) {
        setTitle('');
        setContent('');
        setLocation('');
        setIsAnonymous(false);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const wordCount = content.split(' ').filter(word => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Share Your Story</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {!user && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Sign in to share your story with the community
              </p>
              <Button className="w-full mt-4" onClick={() => navigate('/auth')}>
                Sign In to Post
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="Give your story a meaningful title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!user}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/100 characters
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                placeholder="Share your experience, thoughts, or journey. Your story might help someone else who's going through something similar..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!user}
                rows={8}
                className="resize-none"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!user}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Adding a location helps others in your area find your story
              </p>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                disabled={!user}
              />
              <div className="flex-1">
                <Label htmlFor="anonymous" className="flex items-center gap-2 cursor-pointer">
                  {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Post anonymously
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {isAnonymous 
                    ? 'Your name will not be shown with this story'
                    : 'Your name will be visible to others'
                  }
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Community Guidelines
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be respectful and supportive of others</li>
                <li>• Share authentic experiences</li>
                <li>• Avoid identifying information if posting anonymously</li>
                <li>• No spam, harassment, or harmful content</li>
              </ul>
            </div>

            {/* Preview */}
            {(title.trim() || content.trim()) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {title.trim() || 'Untitled Story'}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{isAnonymous ? 'Anonymous' : user?.email || 'User'}</span>
                      {location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location}
                          </span>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {content.trim() || 'Your story content will appear here...'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Post;