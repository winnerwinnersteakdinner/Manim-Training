import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Crown, Shield, Eye, Phone, Gavel } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

import { useToast } from '@/hooks/use-toast';

export const SearchInterface: React.FC = () => {
  const { user } = useAuth();
  const { 
    subscribed, 
    searchCount, 
    maxFreeSearches, 
    canSearch,
    incrementSearchCount 
  } = useSubscription();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start searching.",
        variant: "destructive"
      });
      return;
    }

    if (!searchQuery.trim()) {
      toast({
        title: "Enter search term",
        description: "Please enter something to search for.",
        variant: "destructive"
      });
      return;
    }

    // Check if user can search
    const canPerformSearch = await incrementSearchCount();
    
    if (!canPerformSearch) {
      setUpgradePromptOpen(true);
      return;
    }

    setSearching(true);
    
    // Simulate search
    setTimeout(() => {
      setSearching(false);
      toast({
        title: "Search completed",
        description: `Found results for "${searchQuery}". This is a demo search.`,
      });
      setSearchQuery('');
    }, 2000);
  };

  const handleFeatureAction = (featureType: string) => {
    if (!subscribed) {
      setUpgradePromptOpen(true);
      return;
    }

    switch (featureType) {
      case 'search':
        toast({
          title: "Trauma Recovery Search",
          description: "Searching through 50,000+ men's stories of abuse, infidelity, and manipulation recovery...",
        });
        break;
      case 'archive':
        toast({
          title: "Recovery Journal",
          description: "Opening your private trauma recovery and healing story collection...",
        });
        break;
      case 'insights':
        toast({
          title: "Men's Support Network",
          description: "Connecting with men who've survived similar relationship trauma and abuse...",
        });
        break;
    }
  };

  const premiumFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Trauma Recovery Database",
      description: "Deep search through 50,000+ men's stories of abuse recovery, infidelity healing, and manipulation survival",
      premium: true,
      action: () => handleFeatureAction('search'),
      stats: "50,000+ trauma stories"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Private Recovery Journal",
      description: "Save and organize stories about emotional abuse, relationship trauma, and healing from betrayal",
      premium: true,
      action: () => handleFeatureAction('archive'),
      stats: "Unlimited saves"
    },
    {
      icon: <Gavel className="w-5 h-5" />,
      title: "Men's Support Network",
      description: "Connect with men who've survived similar abuse, manipulation, and relationship trauma experiences",
      premium: true,
      action: () => handleFeatureAction('insights'),
      stats: "Expert moderated"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Story Search
            {!subscribed && (
              <Badge variant="outline" className="ml-auto">
                {searchCount}/{maxFreeSearches} free searches used
              </Badge>
            )}
            {subscribed && (
              <Badge className="ml-auto bg-green-500">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search recovery stories from abuse, infidelity, manipulation, and relationship trauma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={searching}
            />
            <Button 
              onClick={handleSearch}
              disabled={searching || !canSearch}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {!canSearch && !subscribed && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                You've used all {maxFreeSearches} free searches this month. Upgrade to Premium for unlimited searches.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {premiumFeatures.map((feature, index) => (
          <Card key={index} className={`${!subscribed ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <span className="font-medium">{feature.title}</span>
                </div>
                {!subscribed && feature.premium && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {feature.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-xs">
                  {feature.stats}
                </Badge>
                {subscribed && (
                  <Badge variant="default" className="text-xs bg-success">
                    Active
                  </Badge>
                )}
              </div>
              <Button 
                size="sm" 
                variant={subscribed || !feature.premium ? "default" : "outline"}
                disabled={feature.premium && !subscribed}
                onClick={() => (subscribed || !feature.premium) ? feature.action() : setUpgradePromptOpen(true)}
                className="w-full"
              >
                {(subscribed || !feature.premium) ? 'Access Now' : 'Upgrade Required'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {upgradePromptOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
            <p className="text-muted-foreground mb-4">
              You've reached your free search limit. Upgrade to Premium for unlimited searches and advanced features.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setUpgradePromptOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setUpgradePromptOpen(false);
                  // TODO: Implement upgrade flow
                  alert('Upgrade flow would open here');
                }}
                className="flex-1"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};