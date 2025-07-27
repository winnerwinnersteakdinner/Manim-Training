import React, { useState } from 'react';
import { MapPin, Filter, RefreshCw, Layers, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';

const Map = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'popular'>('all');
  const { user } = useAuth();

  const mockMapData = [
    {
      id: '1',
      location: 'New York, NY',
      storyCount: 15,
      recentActivity: '2 hours ago',
      type: 'recent'
    },
    {
      id: '2',
      location: 'Los Angeles, CA',
      storyCount: 23,
      recentActivity: '5 hours ago',
      type: 'popular'
    },
    {
      id: '3',
      location: 'Chicago, IL',
      storyCount: 8,
      recentActivity: '1 day ago',
      type: 'recent'
    },
    {
      id: '4',
      location: 'Austin, TX',
      storyCount: 12,
      recentActivity: '3 hours ago',
      type: 'popular'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredData = mockMapData.filter(item => {
    if (activeFilter === 'recent') return item.type === 'recent';
    if (activeFilter === 'popular') return item.type === 'popular';
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Story Map</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Map filters would open here')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Areas' },
              { key: 'recent', label: 'Recent' },
              { key: 'popular', label: 'Popular' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.key as any)}
              >
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
                Sign in to see stories from your area and explore the community map
              </p>
              <Button className="w-full mt-4" onClick={() => window.location.href = '/auth'}>
                Sign In to Explore
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Map Placeholder */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Map placeholder with some visual elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-12 right-8 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <div className="absolute bottom-8 left-8 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-4 right-4 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="text-center z-10">
                <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Interactive Map Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  Explore stories from across the country and see what's happening in your community
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Controls */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => alert('Centering map on your location...')}
          >
            <Navigation className="w-3 h-3" />
            My Location
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => alert('Zooming in...')}
          >
            Zoom In
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => alert('Zooming out...')}
          >
            Zoom Out
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
            onClick={() => alert('Resetting map view...')}
          >
            Reset View
          </Button>
        </div>

        {/* Location List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Story Locations</h2>
          
          {filteredData.map((location) => (
            <Card key={location.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{location.location}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last activity: {location.recentActivity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {location.storyCount} stories
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {location.type === 'popular' ? '🔥 Popular' : '🆕 Recent'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Recent Posts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Popular Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>High Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Map;