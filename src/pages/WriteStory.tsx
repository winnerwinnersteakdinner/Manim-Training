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
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  X,
  Coffee,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const WriteStory = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyData, setStoryData] = useState({
    title: '',
    content: '',
    location: '',
    isAnonymous: false,
    healthTags: [] as string[],
    triggerWarning: false,
    triggerWarningText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const healthTags = [
    'mental health', 'depression', 'anxiety', 'therapy', 'medication', 
    'physical health', 'chronic pain', 'medical diagnosis', 'treatment', 'recovery',
    'safety warning', 'workplace safety', 'substance abuse', 'addiction', 'support groups'
  ];

  const steps = [
    { id: 'title', title: 'Story Title', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'content', title: 'Your Health Story', icon: <Heart className="w-5 h-5" /> },
    { id: 'location', title: 'Location', icon: <MapPin className="w-5 h-5" /> },
    { id: 'privacy', title: 'Privacy', icon: <Shield className="w-5 h-5" /> },
    { id: 'review', title: 'Review', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
      healthTags: prev.healthTags.includes(tag)
        ? prev.healthTags.filter(t => t !== tag)
        : [...prev.healthTags, tag]
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to share your health story');
      navigate('/auth');
      return;
    }

    if (!storyData.title.trim() || !storyData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Health story shared successfully! Your experience helps others.');
      
      setStoryData({
        title: '',
        content: '',
        location: '',
        isAnonymous: false,
        healthTags: [],
        triggerWarning: false,
        triggerWarningText: ''
      });
      setCurrentStep(0);
      navigate('/');
    } catch (error) {
      toast.error('Failed to share story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (storyData.title.trim() || storyData.content.trim()) {
      if (window.confirm('Are you sure you want to discard your health story?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="e.g., Mental health warning signs I ignored"
                value={storyData.title}
                onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg"
              />
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Tips for a great title:</p>
                  <ul className="space-y-1">
                    <li>• Be specific about the health condition or safety concern</li>
                    <li>• Include location if relevant</li>
                    <li>• Keep it under 60 characters</li>
                    <li>• Focus on the key lesson or warning sign</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Your Health Story</Label>
              <Textarea
                id="content"
                placeholder="Share your health experience, warning signs you noticed, treatment journey, or safety concerns that could help others..."
                value={storyData.content}
                onChange={(e) => setStoryData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px] text-base leading-relaxed"
              />
              <div className="text-sm text-muted-foreground">
                {storyData.content.length} characters
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Health Topics</Label>
              <div className="flex flex-wrap gap-2">
                {healthTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={storyData.healthTags.includes(tag) ? "default" : "outline"}
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
                  placeholder="e.g., Contains discussion of depression, self-harm, or sensitive medical topics"
                  value={storyData.triggerWarningText}
                  onChange={(e) => setStoryData(prev => ({ ...prev, triggerWarningText: e.target.value }))}
                />
              )}
            </div>
          </div>
        );

      case 2:
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
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Why add a location?</p>
                  <p>Helps others find health stories from their area and connect with local resources.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
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

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coffee className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Your Privacy Matters
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    All health stories are moderated for safety and respect. You can edit or delete your story at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
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
                {storyData.healthTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {storyData.healthTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200"
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
                  <p className="font-medium mb-1">Ready to share your health story!</p>
                  <p>Your experience will help other men recognize warning signs and seek appropriate care.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-brown-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-amber-200 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6 text-amber-600" />
                <h1 className="text-2xl font-bold text-foreground">Share Health Story</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{steps[currentStep].title}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-amber-200 bg-white/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                {steps[currentStep].icon}
                <div>
                  <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                  <p className="text-muted-foreground">
                    {currentStep === 0 && "Give your health story a clear, descriptive title that captures the key warning sign or experience"}
                    {currentStep === 1 && "Share your health experience, what you learned, and how it could help others"}
                    {currentStep === 2 && "Add a location to help others find relevant health stories in their area"}
                    {currentStep === 3 && "Choose how you want to share your health story with the community"}
                    {currentStep === 4 && "Review your health story and share it with the community"}
                  </p>
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

                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !storyData.title.trim() || !storyData.content.trim()}
                    className="min-w-[120px] bg-amber-600 hover:bg-amber-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Coffee className="w-4 h-4 mr-2" />
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
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WriteStory; 