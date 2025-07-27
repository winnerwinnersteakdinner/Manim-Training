import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/lib/analytics';

// Hook to automatically track page views
export const usePageTracking = () => {
  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    // Track page view when route changes
    analytics.trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash,
      title: document.title
    });
  }, [location, analytics]);

  return analytics;
};