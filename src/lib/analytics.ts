import { supabase } from '@/integrations/supabase/client';

// Event types matching the backend
export const EventType = {
  STORY_CREATED: 'story_created',
  STORY_VIEWED: 'story_viewed',
  STORY_LIKED: 'story_liked',
  STORY_SHARED: 'story_shared',
  STORY_COMMENTED: 'story_commented',
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULT_CLICKED: 'search_result_clicked',
  USER_REGISTERED: 'user_registered',
  USER_VERIFIED: 'user_verified',
  PAGE_VIEW: 'page_view',
  BUTTON_CLICKED: 'button_clicked'
} as const;

export type EventTypeValues = typeof EventType[keyof typeof EventType];

// Analytics interfaces
export interface AnalyticsEvent {
  event_id?: string;
  user_id: string;
  event_type: EventTypeValues;
  metadata?: Record<string, any>;
  session_id?: string;
}

export interface StoryMetrics {
  total_stories: number;
  total_views: number;
  total_likes: number;
  total_shares: number;
  total_comments: number;
  average_views_per_story: number;
  average_likes_per_story: number;
  engagement_rate: number;
}

export interface SearchMetrics {
  total_searches: number;
  unique_searchers: number;
  average_searches_per_user: number;
  most_common_queries: [string, number][];
  search_success_rate: number;
}

export interface UserActivitySummary {
  user_id: string;
  period_days: number;
  events: Record<string, number>;
  sessions: {
    total: number;
    average_duration_seconds: number;
    total_events: number;
  };
  stories_created: number;
  searches_performed: number;
}

export interface EngagementMetrics {
  total_events: number;
  hourly_activity: Record<string, number>;
  peak_activity_hour: number | null;
  event_types_breakdown: Record<string, number>;
}

class AnalyticsSystem {
  private currentSessionId: string | null = null;
  private userId: string | null = null;

  constructor() {
    // Initialize session management
    this.initializeSession();
  }

  private async initializeSession() {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      this.userId = user.id;
      this.currentSessionId = await this.startSession(user.id);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.userId = session.user.id;
        if (!this.currentSessionId) {
          this.startSession(session.user.id).then(sessionId => {
            this.currentSessionId = sessionId;
          });
        }
      } else {
        if (this.currentSessionId) {
          this.endSession(this.currentSessionId);
        }
        this.userId = null;
        this.currentSessionId = null;
      }
    });

    // End session on page unload
    window.addEventListener('beforeunload', () => {
      if (this.currentSessionId) {
        // Use sendBeacon for reliable session ending
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/end-session', JSON.stringify({
            session_id: this.currentSessionId
          }));
        }
      }
    });
  }

  // Call analytics edge function
  private async callAnalyticsFunction(action: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await supabase.functions.invoke('analytics', {
        body: { action, data }
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }

  // Track a general event
  async trackEvent(eventType: EventTypeValues, metadata?: Record<string, any>): Promise<string | null> {
    if (!this.userId) {
      console.warn('Cannot track event: user not authenticated');
      return null;
    }

    try {
      const result = await this.callAnalyticsFunction('track_event', {
        user_id: this.userId,
        event_type: eventType,
        metadata: metadata || {},
        session_id: this.currentSessionId
      });

      return result.data;
    } catch (error) {
      console.error('Failed to track event:', error);
      return null;
    }
  }

  // Track page views
  async trackPageView(page: string, additionalData?: Record<string, any>): Promise<void> {
    await this.trackEvent(EventType.PAGE_VIEW, {
      page,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      ...additionalData
    });
  }

  // Track button clicks
  async trackButtonClick(buttonId: string, buttonText?: string, additionalData?: Record<string, any>): Promise<void> {
    await this.trackEvent(EventType.BUTTON_CLICKED, {
      button_id: buttonId,
      button_text: buttonText,
      timestamp: Date.now(),
      ...additionalData
    });
  }

  // Create a story
  async createStory(title: string, content: string, storyId?: string): Promise<string | null> {
    if (!this.userId) {
      console.warn('Cannot create story: user not authenticated');
      return null;
    }

    try {
      const result = await this.callAnalyticsFunction('create_story', {
        story_id: storyId,
        user_id: this.userId,
        title,
        content,
        session_id: this.currentSessionId
      });

      return result.data;
    } catch (error) {
      console.error('Failed to create story:', error);
      return null;
    }
  }

  // Track story interactions
  async viewStory(storyId: string): Promise<void> {
    await this.trackEvent(EventType.STORY_VIEWED, {
      story_id: storyId,
      timestamp: Date.now()
    });
  }

  async likeStory(storyId: string): Promise<void> {
    await this.trackEvent(EventType.STORY_LIKED, {
      story_id: storyId,
      timestamp: Date.now()
    });
  }

  async shareStory(storyId: string, platform?: string): Promise<void> {
    await this.trackEvent(EventType.STORY_SHARED, {
      story_id: storyId,
      share_platform: platform,
      timestamp: Date.now()
    });
  }

  async commentStory(storyId: string, commentText: string): Promise<void> {
    await this.trackEvent(EventType.STORY_COMMENTED, {
      story_id: storyId,
      comment_length: commentText.length,
      timestamp: Date.now()
    });
  }

  // Track search interactions
  async performSearch(query: string, resultsCount?: number): Promise<string | null> {
    if (!this.userId) {
      console.warn('Cannot track search: user not authenticated');
      return null;
    }

    try {
      const result = await this.callAnalyticsFunction('perform_search', {
        user_id: this.userId,
        query,
        results_count: resultsCount || 0,
        session_id: this.currentSessionId
      });

      return result.data;
    } catch (error) {
      console.error('Failed to track search:', error);
      return null;
    }
  }

  async clickSearchResult(searchId: string, resultId: string): Promise<void> {
    if (!this.userId) return;

    try {
      await this.callAnalyticsFunction('click_search_result', {
        user_id: this.userId,
        search_id: searchId,
        result_id: resultId,
        session_id: this.currentSessionId
      });
    } catch (error) {
      console.error('Failed to track search result click:', error);
    }
  }

  // Session management
  async startSession(userId: string): Promise<string | null> {
    try {
      const result = await this.callAnalyticsFunction('start_session', {
        user_id: userId
      });

      return result.data;
    } catch (error) {
      console.error('Failed to start session:', error);
      return null;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      await this.callAnalyticsFunction('end_session', {
        session_id: sessionId
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  // Get metrics
  async getStoryMetrics(days: number = 30): Promise<StoryMetrics | null> {
    try {
      const result = await this.callAnalyticsFunction('get_metrics', {
        user_id: this.userId,
        days,
        metric_type: 'story'
      });

      return result.data.story_metrics;
    } catch (error) {
      console.error('Failed to get story metrics:', error);
      return null;
    }
  }

  async getSearchMetrics(days: number = 30): Promise<SearchMetrics | null> {
    try {
      const result = await this.callAnalyticsFunction('get_metrics', {
        user_id: this.userId,
        days,
        metric_type: 'search'
      });

      return result.data.search_metrics;
    } catch (error) {
      console.error('Failed to get search metrics:', error);
      return null;
    }
  }

  async getUserActivity(days: number = 30): Promise<UserActivitySummary | null> {
    if (!this.userId) return null;

    try {
      const result = await this.callAnalyticsFunction('get_metrics', {
        user_id: this.userId,
        days,
        metric_type: 'user'
      });

      return result.data.user_activity;
    } catch (error) {
      console.error('Failed to get user activity:', error);
      return null;
    }
  }

  async getEngagementMetrics(days: number = 30): Promise<EngagementMetrics | null> {
    try {
      const result = await this.callAnalyticsFunction('get_metrics', {
        user_id: this.userId,
        days,
        metric_type: 'engagement'
      });

      return result.data.engagement_metrics;
    } catch (error) {
      console.error('Failed to get engagement metrics:', error);
      return null;
    }
  }

  // Global metrics (admin/moderator access)
  async getGlobalMetrics(days: number = 30): Promise<{
    story_metrics: StoryMetrics;
    search_metrics: SearchMetrics;
    engagement_metrics: EngagementMetrics;
  } | null> {
    try {
      const result = await this.callAnalyticsFunction('get_metrics', {
        days
        // No user_id for global metrics
      });

      return result.data;
    } catch (error) {
      console.error('Failed to get global metrics:', error);
      return null;
    }
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.userId;
  }
}

// Create singleton instance
export const analytics = new AnalyticsSystem();

// React hook for analytics
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackButtonClick: analytics.trackButtonClick.bind(analytics),
    createStory: analytics.createStory.bind(analytics),
    viewStory: analytics.viewStory.bind(analytics),
    likeStory: analytics.likeStory.bind(analytics),
    shareStory: analytics.shareStory.bind(analytics),
    commentStory: analytics.commentStory.bind(analytics),
    performSearch: analytics.performSearch.bind(analytics),
    clickSearchResult: analytics.clickSearchResult.bind(analytics),
    getStoryMetrics: analytics.getStoryMetrics.bind(analytics),
    getSearchMetrics: analytics.getSearchMetrics.bind(analytics),
    getUserActivity: analytics.getUserActivity.bind(analytics),
    getEngagementMetrics: analytics.getEngagementMetrics.bind(analytics),
    getGlobalMetrics: analytics.getGlobalMetrics.bind(analytics),
    getCurrentSessionId: analytics.getCurrentSessionId.bind(analytics),
    getCurrentUserId: analytics.getCurrentUserId.bind(analytics)
  };
}