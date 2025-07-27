import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, Star, Users, Clock } from 'lucide-react';

interface TrustScoreIndicatorProps {
  score: number;
  verified: boolean;
  memberSince: string;
  storiesCount: number;
  positiveInteractions: number;
  showDetails?: boolean;
}

const TrustScoreIndicator = ({ 
  score, 
  verified, 
  memberSince, 
  storiesCount, 
  positiveInteractions,
  showDetails = false 
}: TrustScoreIndicatorProps) => {
  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' };
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' };
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' };
    if (score >= 40) return { level: 'Poor', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' };
    return { level: 'Very Poor', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
  };

  const getSizeClasses = () => {
    return showDetails ? 'text-lg px-4 py-2' : 'text-sm px-2 py-1';
  };

  const trust = getTrustLevel(score);
  const monthsActive = Math.floor((Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="space-y-4">
      {/* Main Trust Score Display */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Trust Score</span>
        </div>
        <Badge 
          className={`${trust.color} ${trust.bgColor} ${trust.borderColor} ${getSizeClasses()} flex items-center gap-1`}
        >
          {score}/100
          <span className="text-xs">• {trust.level}</span>
        </Badge>
        {verified && (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Trust Level</span>
          <span>{score}%</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Trust Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{storiesCount}</div>
                <div className="text-sm text-muted-foreground">Stories Shared</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{positiveInteractions}</div>
                <div className="text-sm text-muted-foreground">Positive Interactions</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Member Since</span>
                </div>
                <span className="text-sm font-medium">{monthsActive} months</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Community Standing</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${trust.bgColor} ${trust.color} ${trust.borderColor}`}
                >
                  {trust.level}
                </Badge>
              </div>
            </div>

            {/* Trust Score Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">How Trust Score is Calculated</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Verification</span>
                  <span className="font-medium">{verified ? '+20 points' : '+0 points'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time as Member</span>
                  <span className="font-medium">+{Math.min(monthsActive * 2, 30)} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stories Shared</span>
                  <span className="font-medium">+{Math.min(storiesCount * 3, 25)} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Positive Interactions</span>
                  <span className="font-medium">+{Math.min(positiveInteractions, 25)} points</span>
                </div>
              </div>
            </div>

            {/* Trust Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Building Trust</p>
                  <ul className="space-y-1">
                    <li>• Share authentic stories and experiences</li>
                    <li>• Engage positively with other members</li>
                    <li>• Complete your profile verification</li>
                    <li>• Follow community guidelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrustScoreIndicator;