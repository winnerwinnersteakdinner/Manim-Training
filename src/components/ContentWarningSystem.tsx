import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';

interface ContentWarningSystemProps {
  children: React.ReactNode;
  warningType?: 'sensitive' | 'mature' | 'potentially_harmful';
  warningReason?: string;
  moderatedContent?: boolean;
}

const ContentWarningSystem = ({ 
  children, 
  warningType = 'sensitive',
  warningReason,
  moderatedContent = false 
}: ContentWarningSystemProps) => {
  const [showContent, setShowContent] = useState(false);

  const getWarningConfig = () => {
    switch (warningType) {
      case 'potentially_harmful':
        return {
          icon: AlertTriangle,
          title: 'Potentially Sensitive Content',
          description: 'This content may contain information that some users find disturbing or triggering.',
          color: 'bg-destructive/10 border-destructive/20',
          iconColor: 'text-destructive'
        };
      case 'mature':
        return {
          icon: Shield,
          title: 'Mature Content',
          description: 'This content discusses adult themes and relationships.',
          color: 'bg-orange-100/50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
          iconColor: 'text-orange-600'
        };
      default:
        return {
          icon: Eye,
          title: 'Sensitive Content',
          description: 'This content may contain sensitive relationship information.',
          color: 'bg-muted/50 border-border',
          iconColor: 'text-muted-foreground'
        };
    }
  };

  const config = getWarningConfig();
  const IconComponent = config.icon;

  if (showContent) {
    return (
      <div className="space-y-3">
        {moderatedContent && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Moderated Content
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContent(false)}
              className="text-xs h-auto py-1"
            >
              <EyeOff className="w-3 h-3 mr-1" />
              Hide
            </Button>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <Card className={`${config.color} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <IconComponent className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h4 className="font-medium text-foreground">{config.title}</h4>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
              {warningReason && (
                <p className="text-xs text-muted-foreground italic">
                  Reason: {warningReason}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContent(true)}
                className="text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                Show Content
              </Button>
              
              {moderatedContent && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Reviewed by moderators
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentWarningSystem;