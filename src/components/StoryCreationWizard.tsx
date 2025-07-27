import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Shield, 
  MessageSquare, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface StoryStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const storySteps: StoryStep[] = [
  {
    id: 'title',
    title: 'Story Title',
    description: 'Give your story a meaningful title that captures the essence of your experience',
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    id: 'content',
    title: 'Your Story',
    description: 'Share your experience, feelings, and what you learned from this journey',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 'location',
    title: 'Location (Optional)',
    description: 'Add a location to help others find relevant stories in their area',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Choose how you want to share your story with the community',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'review',
    title: 'Review & Share',
    description: 'Review your story and share it with the community',
    icon: <CheckCircle className="w-5 h-5" />
  }
];

const emotionalTags = [
  'anxiety', 'depression', 'grief', 'hope', 'resilience', 
  'healing', 'support', 'growth', 'courage', 'strength',
  'vulnerability', 'transformation', 'community', 'self-care'
];

const StoryCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyData, setStoryData] = useState({
    title: '',
    content: '',
    location: '',
    isAnonymous: false,
    emotionalTags: [] as string[],
    triggerWarning: false,
    triggerWarningText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const currentStepData = storySteps[currentStep];
  const progress = ((currentStep + 1) / storySteps.length) * 100;

  const handleNext = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTagToggle = (tag: string) => {
    setStoryData(prev => ({
      ...prev,
      emotionalTags: prev.emotionalTags.includes(tag)
        ? prev.emotionalTags.filter(t => t !== tag)
        : [...prev.emotionalTags, tag]
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to create a story');
      return;
    }

    if (!storyData.title.trim() || !storyData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual story creation with Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast.success('Story created successfully! Your voice matters.');
      
      // Reset form and go to first step
      setStoryData({
        title: '',
        content: '',
        location: '',
        isAnonymous: false,
        emotionalTags: [],
        triggerWarning: false,
        triggerWarningText: ''
      });
      setCurrentStep(0);
    } catch (error) {
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'title':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="e.g., Finding Strength After Loss"
                value={storyData.title}
                onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg"
              />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Tips for a great title:</p>
                  <ul className="space-y-1">
                    <li>• Be specific and descriptive</li>
                    <li>• Capture the emotional journey</li>
                    <li>• Keep it under 60 characters</li>
                    <li>• Avoid clickbait or sensationalism</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                placeholder="Share your experience, what you learned, and how it shaped you..."
                value={storyData.content}
                onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px] text-base leading-relaxed"
              />
              <div className="text-sm text-muted-foreground">
                {storyData.content.length} characters
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Emotional Themes</Label>
              <div className="flex flex-wrap gap-2">
                {emotionalTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={storyData.emotionalTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="trigger-warning"
                  checked={storyData.triggerWarning}
                  onCheckedChange={(checked) => setStoryData(prev => ({ ...prev, triggerWarning: checked }))}
                />
                <Label htmlFor="trigger-warning">Add content warning</Label>
              </div>
              {storyData.triggerWarning && (
                <Input
                  placeholder="e.g., Contains discussion of depression and self-harm"
                  value={storyData.triggerWarningText}
                  onChange={(e) => setStoryData(prev => ({ ...prev, triggerWarningText: e.target.value }))}
                />
              )}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY or leave blank for privacy"
                value={storyData.location}
                onChange={(e) => setStoryData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Why add a location?</p>
                  <p>Helps others find stories from their area and build local connections. Your exact location is never shared publicly.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={storyData.isAnonymous}
                  onCheckedChange={(checked) => setStoryData(prev => ({ ...prev, isAnonymous: checked }))}
                />
                <Label htmlFor="anonymous">Share anonymously</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Your story will be shared without your name or profile information
              </p>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Your Privacy Matters
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    All stories are moderated for safety and respect. You can edit or delete your story at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{storyData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {storyData.content}
                </p>
                {storyData.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    {storyData.location}
                  </div>
                )}
                {storyData.emotionalTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {storyData.emotionalTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {storyData.triggerWarning && storyData.triggerWarningText && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Content Warning:</strong> {storyData.triggerWarningText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Ready to share your story!</p>
                  <p>Your story will help others who may be going through similar experiences. Thank you for your courage.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {storySteps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === storySteps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !storyData.title.trim() || !storyData.content.trim()}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Share Story
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !storyData.title.trim()) ||
                  (currentStep === 1 && !storyData.content.trim())
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryCreationWizard; 