import React, { useState } from 'react';
import { Bell, CheckCircle, MessageCircle, Heart, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { cn } from '@/lib/utils';

const Alerts = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'important'>('all');
  const { user } = useAuth();

  const mockAlerts = [
    {
      id: '1',
      type: 'new_post',
      title: 'New story in your area',
      message: 'Someone shared a new story about anxiety recovery in New York, NY',
      is_read: false,
      created_at: '2024-01-15T10:30:00Z',
      metadata: { location: 'New York, NY', story_id: 'story_123' }
    },
    {
      id: '2',
      type: 'like',
      title: 'Your story received a like',
      message: 'Your story "Finding Hope" received a new like',
      is_read: false,
      created_at: '2024-01-15T09:15:00Z',
      metadata: { story_id: 'story_456', story_title: 'Finding Hope' }
    },
    {
      id: '3',
      type: 'comment',
      title: 'New comment on your story',
      message: 'Someone commented on your story "My Journey"',
      is_read: true,
      created_at: '2024-01-14T16:45:00Z',
      metadata: { story_id: 'story_789', story_title: 'My Journey' }
    },
    {
      id: '4',
      type: 'system',
      title: 'Weekly community update',
      message: 'Check out this week\'s featured stories and community highlights',
      is_read: true,
      created_at: '2024-01-14T08:00:00Z',
      metadata: { category: 'weekly_update' }
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return <Bell className="w-4 h-4" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    if (activeFilter === 'new') return !alert.is_read;
    if (activeFilter === 'important') return alert.type === 'system' || alert.type === 'comment';
    return true;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => alert('All alerts marked as read')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'new', label: 'New' },
              { key: 'important', label: 'Important' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.key as any)}
                className={cn(
                  "flex items-center gap-2",
                  activeFilter === filter.key && "bg-primary text-primary-foreground"
                )}
              >
                {filter.key === 'new' && (
                  <Badge variant="destructive" className="w-2 h-2 p-0 rounded-full" />
                )}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {!user && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Sign in to receive alerts and notifications from your community
              </p>
              <Button className="w-full mt-4" onClick={() => window.location.href = '/auth'}>
                Sign In for Alerts
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                !alert.is_read && "border-primary/30 bg-primary/5"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-full",
                    !alert.is_read ? "bg-primary/10" : "bg-muted"
                  )}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn(
                        "font-medium text-sm",
                        !alert.is_read ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {alert.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(alert.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    
                    {/* Metadata */}
                    {alert.metadata && (
                      <div className="flex items-center gap-2 mt-2">
                        {alert.metadata.location && (
                          <Badge variant="outline" className="text-xs">
                            {alert.metadata.location}
                          </Badge>
                        )}
                        {alert.type !== 'system' && (
                          <Badge variant="secondary" className="text-xs">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {!alert.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Alerts */}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {activeFilter === 'new' ? 'No new alerts' : 'No alerts yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {activeFilter === 'new' 
                ? 'You\'re all caught up! Check back later for new notifications.'
                : 'When you start interacting with the community, your alerts will appear here.'
              }
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Alerts;