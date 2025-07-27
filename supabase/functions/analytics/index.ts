import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Event types enum
const EventType = {
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

interface AnalyticsEvent {
  event_id?: string;
  user_id: string;
  event_type: string;
  metadata?: Record<string, any>;
  session_id?: string;
}

interface StoryData {
  story_id: string;
  user_id: string;
  title: string;
  content: string;
  session_id?: string;
}

interface SearchData {
  search_id?: string;
  user_id: string;
  query: string;
  results_count?: number;
  session_id?: string;
}

interface AnalyticsRequest {
  action: 'track_event' | 'create_story' | 'perform_search' | 'click_search_result' | 'start_session' | 'end_session' | 'get_metrics';
  data: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data }: AnalyticsRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing analytics action: ${action}`);

    let result;

    switch (action) {
      case 'track_event':
        result = await trackEvent(supabase, data);
        break;
      
      case 'create_story':
        result = await createStory(supabase, data);
        break;
      
      case 'perform_search':
        result = await performSearch(supabase, data);
        break;
      
      case 'click_search_result':
        result = await clickSearchResult(supabase, data);
        break;
      
      case 'start_session':
        result = await startSession(supabase, data);
        break;
      
      case 'end_session':
        result = await endSession(supabase, data);
        break;
      
      case 'get_metrics':
        result = await getMetrics(supabase, data);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Track a general analytics event
async function trackEvent(supabase: any, eventData: AnalyticsEvent): Promise<string> {
  try {
    const eventId = eventData.event_id || `evt_${crypto.randomUUID().slice(0, 12)}`;
    const timestamp = new Date().toISOString();
    const sessionId = eventData.session_id || `sess_${crypto.randomUUID().slice(0, 8)}`;

    // Insert event into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_id: eventId,
        user_id: eventData.user_id,
        event_type: eventData.event_type,
        timestamp: timestamp,
        metadata: eventData.metadata || {},
        session_id: sessionId
      });

    if (error) throw error;

    // Update session events count
    await supabase
      .from('user_sessions')
      .update({ events_count: supabase.raw('events_count + 1') })
      .eq('session_id', sessionId);

    console.log(`Tracked event: ${eventData.event_type} for user ${eventData.user_id}`);
    return eventId;

  } catch (error) {
    console.error('Failed to track event:', error);
    throw error;
  }
}

// Create a story and track the event
async function createStory(supabase: any, storyData: StoryData): Promise<string> {
  try {
    const storyId = storyData.story_id || `story_${crypto.randomUUID().slice(0, 12)}`;
    const timestamp = new Date().toISOString();

    // Insert story into story_analytics table
    const { error: storyError } = await supabase
      .from('story_analytics')
      .insert({
        story_id: storyId,
        user_id: storyData.user_id,
        title: storyData.title,
        content: storyData.content,
        created_at: timestamp,
        updated_at: timestamp
      });

    if (storyError) throw storyError;

    // Track the story creation event
    await trackEvent(supabase, {
      user_id: storyData.user_id,
      event_type: EventType.STORY_CREATED,
      metadata: {
        story_id: storyId,
        title: storyData.title,
        content_length: storyData.content.length,
        word_count: storyData.content.split(' ').length
      },
      session_id: storyData.session_id
    });

    console.log(`Created story: ${storyId} by user ${storyData.user_id}`);
    return storyId;

  } catch (error) {
    console.error('Failed to create story:', error);
    throw error;
  }
}

// Track a search event
async function performSearch(supabase: any, searchData: SearchData): Promise<string> {
  try {
    const searchId = searchData.search_id || `search_${crypto.randomUUID().slice(0, 12)}`;
    const timestamp = new Date().toISOString();

    // Insert search into search_analytics table
    const { error: searchError } = await supabase
      .from('search_analytics')
      .insert({
        search_id: searchId,
        user_id: searchData.user_id,
        query: searchData.query,
        results_count: searchData.results_count || 0,
        timestamp: timestamp,
        session_id: searchData.session_id
      });

    if (searchError) throw searchError;

    // Track the search event
    await trackEvent(supabase, {
      user_id: searchData.user_id,
      event_type: EventType.SEARCH_PERFORMED,
      metadata: {
        search_id: searchId,
        query: searchData.query,
        results_count: searchData.results_count || 0
      },
      session_id: searchData.session_id
    });

    console.log(`Tracked search: ${searchData.query} by user ${searchData.user_id}`);
    return searchId;

  } catch (error) {
    console.error('Failed to track search:', error);
    throw error;
  }
}

// Track search result click
async function clickSearchResult(supabase: any, data: { user_id: string; search_id: string; result_id: string; session_id?: string }): Promise<boolean> {
  try {
    // Update search record with clicked result
    const { error: updateError } = await supabase
      .from('search_analytics')
      .update({ clicked_result_id: data.result_id })
      .eq('search_id', data.search_id);

    if (updateError) throw updateError;

    // Track the click event
    await trackEvent(supabase, {
      user_id: data.user_id,
      event_type: EventType.SEARCH_RESULT_CLICKED,
      metadata: {
        search_id: data.search_id,
        result_id: data.result_id
      },
      session_id: data.session_id
    });

    return true;

  } catch (error) {
    console.error('Failed to track search result click:', error);
    throw error;
  }
}

// Start a new user session
async function startSession(supabase: any, data: { user_id: string }): Promise<string> {
  try {
    const sessionId = `sess_${crypto.randomUUID().slice(0, 8)}`;
    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from('user_sessions')
      .insert({
        session_id: sessionId,
        user_id: data.user_id,
        started_at: timestamp
      });

    if (error) throw error;

    console.log(`Started session: ${sessionId} for user ${data.user_id}`);
    return sessionId;

  } catch (error) {
    console.error('Failed to start session:', error);
    throw error;
  }
}

// End a user session
async function endSession(supabase: any, data: { session_id: string }): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();

    // Get session start time
    const { data: session, error: fetchError } = await supabase
      .from('user_sessions')
      .select('started_at')
      .eq('session_id', data.session_id)
      .single();

    if (fetchError) throw fetchError;

    if (session) {
      const startTime = new Date(session.started_at);
      const endTime = new Date(timestamp);
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({
          ended_at: timestamp,
          duration_seconds: duration
        })
        .eq('session_id', data.session_id);

      if (updateError) throw updateError;

      console.log(`Ended session: ${data.session_id} (duration: ${duration}s)`);
      return true;
    }

    return false;

  } catch (error) {
    console.error('Failed to end session:', error);
    throw error;
  }
}

// Get comprehensive metrics
async function getMetrics(supabase: any, data: { user_id?: string; days?: number; metric_type?: string }): Promise<any> {
  try {
    const days = data.days || 30;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const userFilter = data.user_id ? data.user_id : null;

    let metrics: any = {};

    if (!data.metric_type || data.metric_type === 'story') {
      metrics.story_metrics = await getStoryMetrics(supabase, userFilter, cutoffDate);
    }

    if (!data.metric_type || data.metric_type === 'search') {
      metrics.search_metrics = await getSearchMetrics(supabase, userFilter, cutoffDate);
    }

    if (!data.metric_type || data.metric_type === 'user') {
      if (userFilter) {
        metrics.user_activity = await getUserActivitySummary(supabase, userFilter, cutoffDate);
      }
    }

    if (!data.metric_type || data.metric_type === 'engagement') {
      metrics.engagement_metrics = await getEngagementMetrics(supabase, userFilter, cutoffDate);
    }

    return metrics;

  } catch (error) {
    console.error('Failed to get metrics:', error);
    throw error;
  }
}

// Get story metrics
async function getStoryMetrics(supabase: any, userId: string | null, cutoffDate: string): Promise<any> {
  try {
    // Get total stories
    let storiesQuery = supabase
      .from('story_analytics')
      .select('id', { count: 'exact' })
      .gte('created_at', cutoffDate);
    
    if (userId) {
      storiesQuery = storiesQuery.eq('user_id', userId);
    }

    const { count: totalStories } = await storiesQuery;

    // Get story engagement metrics
    let eventsQuery = supabase
      .from('analytics_events')
      .select('event_type')
      .gte('timestamp', cutoffDate)
      .in('event_type', [
        EventType.STORY_VIEWED,
        EventType.STORY_LIKED,
        EventType.STORY_SHARED,
        EventType.STORY_COMMENTED
      ]);

    if (userId) {
      eventsQuery = eventsQuery.eq('user_id', userId);
    }

    const { data: events } = await eventsQuery;

    const totalViews = events?.filter(e => e.event_type === EventType.STORY_VIEWED).length || 0;
    const totalLikes = events?.filter(e => e.event_type === EventType.STORY_LIKED).length || 0;
    const totalShares = events?.filter(e => e.event_type === EventType.STORY_SHARED).length || 0;
    const totalComments = events?.filter(e => e.event_type === EventType.STORY_COMMENTED).length || 0;

    const averageViewsPerStory = totalStories ? totalViews / totalStories : 0;
    const averageLikesPerStory = totalStories ? totalLikes / totalStories : 0;

    const totalEngagement = totalLikes + totalComments + totalShares;
    const engagementRate = totalViews ? (totalEngagement / totalViews) * 100 : 0;

    return {
      total_stories: totalStories || 0,
      total_views: totalViews,
      total_likes: totalLikes,
      total_shares: totalShares,
      total_comments: totalComments,
      average_views_per_story: averageViewsPerStory,
      average_likes_per_story: averageLikesPerStory,
      engagement_rate: engagementRate
    };

  } catch (error) {
    console.error('Failed to get story metrics:', error);
    return {
      total_stories: 0,
      total_views: 0,
      total_likes: 0,
      total_shares: 0,
      total_comments: 0,
      average_views_per_story: 0,
      average_likes_per_story: 0,
      engagement_rate: 0
    };
  }
}

// Get search metrics
async function getSearchMetrics(supabase: any, userId: string | null, cutoffDate: string): Promise<any> {
  try {
    // Get total searches
    let searchQuery = supabase
      .from('search_analytics')
      .select('user_id, clicked_result_id', { count: 'exact' })
      .gte('timestamp', cutoffDate);

    if (userId) {
      searchQuery = searchQuery.eq('user_id', userId);
    }

    const { data: searches, count: totalSearches } = await searchQuery;

    // Get unique searchers
    const uniqueSearchers = userId ? 1 : new Set(searches?.map(s => s.user_id)).size;

    // Calculate average searches per user
    const averageSearchesPerUser = uniqueSearchers ? (totalSearches || 0) / uniqueSearchers : 0;

    // Get most common queries
    const { data: queryData } = await supabase
      .from('search_analytics')
      .select('query')
      .gte('timestamp', cutoffDate)
      .eq(userId ? 'user_id' : 'user_id', userId || supabase.raw('user_id'));

    const queryFrequency: { [key: string]: number } = {};
    queryData?.forEach((item: any) => {
      queryFrequency[item.query] = (queryFrequency[item.query] || 0) + 1;
    });

    const mostCommonQueries = Object.entries(queryFrequency)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10);

    // Calculate search success rate
    const successfulSearches = searches?.filter(s => s.clicked_result_id).length || 0;
    const searchSuccessRate = totalSearches ? (successfulSearches / totalSearches) * 100 : 0;

    return {
      total_searches: totalSearches || 0,
      unique_searchers: uniqueSearchers,
      average_searches_per_user: averageSearchesPerUser,
      most_common_queries: mostCommonQueries,
      search_success_rate: searchSuccessRate
    };

  } catch (error) {
    console.error('Failed to get search metrics:', error);
    return {
      total_searches: 0,
      unique_searchers: 0,
      average_searches_per_user: 0,
      most_common_queries: [],
      search_success_rate: 0
    };
  }
}

// Get user activity summary
async function getUserActivitySummary(supabase: any, userId: string, cutoffDate: string): Promise<any> {
  try {
    // Get event counts by type
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('user_id', userId)
      .gte('timestamp', cutoffDate);

    const eventCounts: { [key: string]: number } = {};
    events?.forEach((event: any) => {
      eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
    });

    // Get session data
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('duration_seconds, events_count')
      .eq('user_id', userId)
      .gte('started_at', cutoffDate);

    const totalSessions = sessions?.length || 0;
    const avgDuration = sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / totalSessions || 0;
    const totalEvents = sessions?.reduce((acc, s) => acc + (s.events_count || 0), 0) || 0;

    return {
      user_id: userId,
      period_days: Math.ceil((Date.now() - new Date(cutoffDate).getTime()) / (24 * 60 * 60 * 1000)),
      events: eventCounts,
      sessions: {
        total: totalSessions,
        average_duration_seconds: avgDuration,
        total_events: totalEvents
      },
      stories_created: eventCounts[EventType.STORY_CREATED] || 0,
      searches_performed: eventCounts[EventType.SEARCH_PERFORMED] || 0
    };

  } catch (error) {
    console.error('Failed to get user activity summary:', error);
    return {};
  }
}

// Get engagement metrics
async function getEngagementMetrics(supabase: any, userId: string | null, cutoffDate: string): Promise<any> {
  try {
    let eventsQuery = supabase
      .from('analytics_events')
      .select('event_type, timestamp')
      .gte('timestamp', cutoffDate);

    if (userId) {
      eventsQuery = eventsQuery.eq('user_id', userId);
    }

    const { data: events } = await eventsQuery;

    // Group events by hour for trend analysis
    const hourlyActivity: { [key: string]: number } = {};
    events?.forEach((event: any) => {
      const hour = new Date(event.timestamp).getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    // Calculate peak activity hours
    const peakHour = Object.entries(hourlyActivity)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];

    return {
      total_events: events?.length || 0,
      hourly_activity: hourlyActivity,
      peak_activity_hour: peakHour ? parseInt(peakHour) : null,
      event_types_breakdown: events?.reduce((acc: any, event: any) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {}) || {}
    };

  } catch (error) {
    console.error('Failed to get engagement metrics:', error);
    return {
      total_events: 0,
      hourly_activity: {},
      peak_activity_hour: null,
      event_types_breakdown: {}
    };
  }
}