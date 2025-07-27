import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Crown, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

export const SearchLimitBanner: React.FC = () => {
  const { user } = useAuth();
  const { 
    subscribed, 
    searchCount, 
    maxFreeSearches, 
    createCheckout,
    loading 
  } = useSubscription();

  if (!user || subscribed || loading) return null;

  const remainingSearches = Math.max(0, maxFreeSearches - searchCount);
  const isAtLimit = searchCount >= maxFreeSearches;

  return (
    <Card className={`mb-6 ${isAtLimit ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAtLimit ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <Search className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {isAtLimit ? 'Search Limit Reached' : 'Free Searches'}
                </span>
                <Badge variant={isAtLimit ? 'destructive' : 'secondary'}>
                  {searchCount}/{maxFreeSearches} used
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAtLimit 
                  ? 'Upgrade to Premium for unlimited searches and premium features'
                  : `You have ${remainingSearches} free searches remaining this month`
                }
              </p>
            </div>
          </div>
          
          <Button 
            onClick={createCheckout}
            size="sm"
            className="flex items-center gap-2"
            variant={isAtLimit ? 'default' : 'outline'}
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium
            <span className="text-xs">$10.99/mo</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};