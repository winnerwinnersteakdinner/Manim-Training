import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  searchCount: number;
  maxFreeSearches: number;
  canSearch: boolean;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  manageSubscription: () => Promise<void>;
  incrementSearchCount: () => Promise<boolean>;
  refreshSearchCount: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscribed: false,
  subscriptionTier: null,
  subscriptionEnd: null,
  searchCount: 0,
  maxFreeSearches: 5,
  canSearch: true,
  loading: false,
  checkSubscription: async () => {},
  createCheckout: async () => {},
  manageSubscription: async () => {},
  incrementSearchCount: async () => false,
  refreshSearchCount: async () => {},
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxFreeSearches = 5;

  const canSearch = subscribed || searchCount < maxFreeSearches;

  const checkSubscription = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      
      setSubscribed(data.subscribed || false);
      setSubscriptionTier(data.subscription_tier || null);
      setSubscriptionEnd(data.subscription_end || null);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSearchCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('check_and_reset_search_count', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error refreshing search count:', error);
        return;
      }

      setSearchCount(data || 0);
    } catch (error) {
      console.error('Error refreshing search count:', error);
    }
  };

  const incrementSearchCount = async (): Promise<boolean> => {
    if (!user) return false;

    // If user is subscribed, they can search unlimited
    if (subscribed) return true;

    // Check if user has reached free limit
    if (searchCount >= maxFreeSearches) {
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('increment_search_count', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error incrementing search count:', error);
        return false;
      }

      setSearchCount(data || 0);
      return true;
    } catch (error) {
      console.error('Error incrementing search count:', error);
      return false;
    }
  };

  const createCheckout = async () => {
    if (!user || !session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const manageSubscription = async () => {
    if (!user || !session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
      refreshSearchCount();
    } else {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setSearchCount(0);
    }
  }, [user, session]);

  const value = {
    subscribed,
    subscriptionTier,
    subscriptionEnd,
    searchCount,
    maxFreeSearches,
    canSearch,
    loading,
    checkSubscription,
    createCheckout,
    manageSubscription,
    incrementSearchCount,
    refreshSearchCount,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};