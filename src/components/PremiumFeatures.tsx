import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

const PremiumFeatures = () => {
  const { subscribed, subscriptionTier, createCheckout, manageSubscription } = useSubscription();
  const { user } = useAuth();

  const features = [
    { name: 'Unlimited Name Alerts', free: '3 per day', premium: 'Unlimited' },
    { name: 'Priority Support', free: 'Standard', premium: '24h response' },
    { name: 'Advanced Search Filters', free: 'Basic', premium: 'All filters' },
    { name: 'Verified Badge', free: false, premium: true },
    { name: 'Early Access to Features', free: false, premium: true },
    { name: 'Enhanced Privacy Controls', free: false, premium: true },
  ];

  if (!user) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign in to access premium features and unlock the full Coffee experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Premium Features
          {subscribed && (
            <Badge variant="secondary" className="ml-auto">
              {subscriptionTier} Plan
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{feature.name}</span>
              <div className="flex items-center gap-2 text-sm">
                {subscribed ? (
                  <div className="flex items-center gap-1 text-primary">
                    <Check className="h-4 w-4" />
                    <span>{typeof feature.premium === 'boolean' ? 'Included' : feature.premium}</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {typeof feature.free === 'boolean' 
                      ? (feature.free ? 'Included' : 'Not available')
                      : feature.free
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          {subscribed ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You have access to all premium features!
              </p>
              <Button 
                variant="outline" 
                onClick={manageSubscription}
                className="w-full"
              >
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-primary">$7.99</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock all premium features and support Coffee development
                </p>
              </div>
              <Button 
                onClick={createCheckout}
                className="w-full"
                size="lg"
              >
                Upgrade to Premium
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumFeatures;