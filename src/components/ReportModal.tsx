import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  X, 
  Send, 
  CheckCircle,
  Flag,
  User,
  MessageSquare,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'story' | 'comment' | 'user';
  contentId: string;
  contentTitle?: string;
}

const ReportModal = ({ isOpen, onClose, contentType, contentId, contentTitle }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportReasons = [
    {
      id: 'harassment',
      title: 'Harassment or Bullying',
      description: 'Threatening, abusive, or intimidating behavior',
      icon: <AlertTriangle className="w-4 h-4" />,
      severity: 'high'
    },
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Sharing private information without consent',
      icon: <Shield className="w-4 h-4" />,
      severity: 'high'
    },
    {
      id: 'inappropriate',
      title: 'Inappropriate Content',
      description: 'Content that violates community guidelines',
      icon: <Flag className="w-4 h-4" />,
      severity: 'medium'
    },
    {
      id: 'spam',
      title: 'Spam or Self-Promotion',
      description: 'Unwanted advertising or promotional content',
      icon: <X className="w-4 h-4" />,
      severity: 'medium'
    },
    {
      id: 'misinformation',
      title: 'Misinformation',
      description: 'False or misleading information',
      icon: <AlertTriangle className="w-4 h-4" />,
      severity: 'medium'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Other concerns not listed above',
      icon: <MessageSquare className="w-4 h-4" />,
      severity: 'low'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual report submission to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setIsSubmitted(true);
      toast.success('Report submitted successfully. Thank you for helping keep our community safe.');
      
      // Reset form after a delay
      setTimeout(() => {
        setSelectedReason('');
        setDescription('');
        setIsSubmitted(false);
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (selectedReason || description) {
      if (window.confirm('Are you sure you want to close? Your report will be lost.')) {
        setSelectedReason('');
        setDescription('');
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Report Submitted
            </h3>
            <p className="text-muted-foreground mb-6">
              Thank you for helping keep our community safe. Our moderation team will review your report.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flag className="w-6 h-6 text-red-600" />
              <CardTitle className="text-xl">Report Content</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Help us maintain a safe community by reporting content that violates our guidelines.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Content Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {contentType === 'story' && <MessageSquare className="w-4 h-4 text-primary" />}
              {contentType === 'comment' && <MessageSquare className="w-4 h-4 text-primary" />}
              {contentType === 'user' && <User className="w-4 h-4 text-primary" />}
              <span className="text-sm font-medium text-foreground">
                {contentType === 'story' && 'Story'}
                {contentType === 'comment' && 'Comment'}
                {contentType === 'user' && 'User'}
              </span>
            </div>
            {contentTitle && (
              <p className="text-sm text-muted-foreground">
                "{contentTitle}"
              </p>
            )}
          </div>

          {/* Report Reasons */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Why are you reporting this?</h4>
            <div className="grid gap-3">
              {reportReasons.map((reason) => (
                <div
                  key={reason.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedReason === reason.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedReason(reason.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-primary mt-0.5">
                      {reason.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-foreground">{reason.title}</h5>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(reason.severity)}`}
                        >
                          {reason.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Additional Details (Optional)</h4>
            <Textarea
              placeholder="Please provide any additional context that will help us understand the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Your report will be reviewed by our moderation team. We take all reports seriously and will investigate thoroughly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>

          {/* Safety Notice */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your Safety Matters</p>
                <p>If you're in immediate danger, please contact emergency services (911) or call the National Suicide Prevention Lifeline at 988.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportModal;