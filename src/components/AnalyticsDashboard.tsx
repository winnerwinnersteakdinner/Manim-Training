import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Search, 
  BookOpen, 
  Heart, 
  Share2, 
  MessageCircle,
  Eye,
  Activity,
  Clock
} from 'lucide-react';
import { useAnalytics, StoryMetrics, SearchMetrics, UserActivitySummary, EngagementMetrics } from '@/lib/analytics';

interface DashboardProps {
  isGlobal?: boolean;
  days?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsDashboard: React.FC<DashboardProps> = ({ 
  isGlobal = false, 
  days = 30 
}) => {
  const analytics = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [storyMetrics, setStoryMetrics] = useState<StoryMetrics | null>(null);
  const [searchMetrics, setSearchMetrics] = useState<SearchMetrics | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivitySummary | null>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(days);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, isGlobal]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      if (isGlobal) {
        const globalData = await analytics.getGlobalMetrics(selectedPeriod);
        if (globalData) {
          setStoryMetrics(globalData.story_metrics);
          setSearchMetrics(globalData.search_metrics);
          setEngagementMetrics(globalData.engagement_metrics);
        }
      } else {
        const [storyData, searchData, userData, engagementData] = await Promise.all([
          analytics.getStoryMetrics(selectedPeriod),
          analytics.getSearchMetrics(selectedPeriod),
          analytics.getUserActivity(selectedPeriod),
          analytics.getEngagementMetrics(selectedPeriod)
        ]);

        setStoryMetrics(storyData);
        setSearchMetrics(searchData);
        setUserActivity(userData);
        setEngagementMetrics(engagementData);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatHourlyData = (hourlyActivity: Record<string, number>) => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: hourlyActivity[i] || 0,
      time: `${i.toString().padStart(2, '0')}:00`
    }));
  };

  const formatTopQueries = (queries: [string, number][]) => {
    return queries.slice(0, 8).map(([query, count]) => ({
      query: query.length > 20 ? query.substring(0, 20) + '...' : query,
      count
    }));
  };

  const engagementBreakdownData = engagementMetrics ? [
    { name: 'Views', value: engagementMetrics.event_types_breakdown?.story_viewed || 0 },
    { name: 'Likes', value: engagementMetrics.event_types_breakdown?.story_liked || 0 },
    { name: 'Shares', value: engagementMetrics.event_types_breakdown?.story_shared || 0 },
    { name: 'Comments', value: engagementMetrics.event_types_breakdown?.story_commented || 0 },
    { name: 'Searches', value: engagementMetrics.event_types_breakdown?.search_performed || 0 }
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isGlobal ? 'Global Analytics' : 'My Analytics'}
          </h1>
          <p className="text-muted-foreground">
            Insights and metrics for the last {selectedPeriod} days
          </p>
        </div>
        
        <div className="flex gap-2">
          {[7, 30, 90].map((period) => (
            <Badge
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedPeriod(period)}
            >
              {period} days
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storyMetrics?.total_stories || 0}</div>
            <p className="text-xs text-muted-foreground">
              {storyMetrics?.average_views_per_story?.toFixed(1) || 0} avg views per story
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storyMetrics?.total_views || 0}</div>
            <p className="text-xs text-muted-foreground">
              {storyMetrics?.total_likes || 0} likes • {storyMetrics?.total_shares || 0} shares
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchMetrics?.total_searches || 0}</div>
            <p className="text-xs text-muted-foreground">
              {searchMetrics?.search_success_rate?.toFixed(1) || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storyMetrics?.engagement_rate?.toFixed(1) || 0}%
            </div>
            <Progress 
              value={storyMetrics?.engagement_rate || 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Activity Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
                <CardDescription>24-hour activity pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={formatHourlyData(engagementMetrics?.hourly_activity || {})}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                {engagementMetrics?.peak_activity_hour !== null && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Peak activity: {engagementMetrics.peak_activity_hour}:00
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Engagement Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>Distribution of user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Summary (for personal dashboard) */}
          {!isGlobal && userActivity && (
            <Card>
              <CardHeader>
                <CardTitle>Your Activity Summary</CardTitle>
                <CardDescription>Your engagement over the last {selectedPeriod} days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userActivity.sessions.total}
                    </div>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(userActivity.sessions.average_duration_seconds / 60)}m
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Session</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userActivity.stories_created}
                    </div>
                    <p className="text-sm text-muted-foreground">Stories Created</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {userActivity.searches_performed}
                    </div>
                    <p className="text-sm text-muted-foreground">Searches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Story Performance</CardTitle>
                <CardDescription>Key story metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>Total Views</span>
                    </div>
                    <span className="font-semibold">{storyMetrics?.total_views || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Total Likes</span>
                    </div>
                    <span className="font-semibold">{storyMetrics?.total_likes || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span>Total Shares</span>
                    </div>
                    <span className="font-semibold">{storyMetrics?.total_shares || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-purple-500" />
                      <span>Total Comments</span>
                    </div>
                    <span className="font-semibold">{storyMetrics?.total_comments || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Story Engagement</CardTitle>
                <CardDescription>Engagement metrics visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Views', value: storyMetrics?.total_views || 0, color: '#0088FE' },
                    { name: 'Likes', value: storyMetrics?.total_likes || 0, color: '#00C49F' },
                    { name: 'Shares', value: storyMetrics?.total_shares || 0, color: '#FFBB28' },
                    { name: 'Comments', value: storyMetrics?.total_comments || 0, color: '#FF8042' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Metrics</CardTitle>
                <CardDescription>Search performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Searches</span>
                    <span className="font-semibold">{searchMetrics?.total_searches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unique Searchers</span>
                    <span className="font-semibold">{searchMetrics?.unique_searchers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg Searches/User</span>
                    <span className="font-semibold">
                      {searchMetrics?.average_searches_per_user?.toFixed(1) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <Badge variant="outline">
                      {searchMetrics?.search_success_rate?.toFixed(1) || 0}%
                    </Badge>
                  </div>
                  <Progress 
                    value={searchMetrics?.search_success_rate || 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Search Queries</CardTitle>
                <CardDescription>Most popular search terms</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart 
                    data={formatTopQueries(searchMetrics?.most_common_queries || [])}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="query" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Pattern</CardTitle>
              <CardDescription>User activity throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={formatHourlyData(engagementMetrics?.hourly_activity || {})}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Time: ${value}`}
                    formatter={(value) => [value, 'Activity']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activity" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Summary</CardTitle>
                <CardDescription>Total interactions and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Events</span>
                    <Badge variant="secondary">
                      {engagementMetrics?.total_events || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Peak Activity Hour</span>
                    <Badge variant="outline">
                      {engagementMetrics?.peak_activity_hour !== null 
                        ? `${engagementMetrics.peak_activity_hour}:00` 
                        : 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
                <CardDescription>Breakdown by interaction type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(engagementMetrics?.event_types_breakdown || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};