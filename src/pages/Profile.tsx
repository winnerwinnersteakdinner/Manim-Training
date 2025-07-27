import React, { useState } from 'react';
import { User, Settings, BarChart3, Shield, Heart, MessageCircle, Eye, Calendar, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'stories' | 'activity'>('stats');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const mockUserStats = {
    storiesPosted: 15,
    likesReceived: 127,
    commentsReceived: 45,
    storiesViewed: 892,
    daysActive: 45,
    joinDate: '2024-01-01'
  };

  const mockRecentStories = [
    {
      id: '1',
      title: 'My Journey with Anxiety',
      content: 'Sharing my experience with anxiety and how I found ways to cope...',
      likes: 23,
      comments: 8,
      views: 156,
      created_at: '2024-01-15',
      is_anonymous: false
    },
    {
      id: '2',
      title: 'Finding Hope After Loss',
      content: 'This is my story about dealing with grief and finding light again...',
      likes: 45,
      comments: 12,
      views: 234,
      created_at: '2024-01-10',
      is_anonymous: true
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/verification')}>
                <Shield className="w-4 h-4 mr-2" />
                Verify
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('Settings would open here')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {!user ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Welcome to Coffee App
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to view your profile, track your stories, and connect with the community
                </p>
                <Button className="w-full" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Profile Header */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-foreground">
                        {user.email?.split('@')[0] || 'User'}
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        Member
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {user.email}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(mockUserStats.joinDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location not set
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Edit profile would open here')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {mockUserStats.storiesPosted}
                    </div>
                    <div className="text-xs text-muted-foreground">Stories Posted</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {mockUserStats.likesReceived}
                    </div>
                    <div className="text-xs text-muted-foreground">Likes Received</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {mockUserStats.commentsReceived}
                    </div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {mockUserStats.daysActive}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Active</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'stats', label: 'Statistics', icon: BarChart3 },
                { key: 'stories', label: 'My Stories', icon: MessageCircle },
                { key: 'activity', label: 'Activity', icon: Eye }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(tab.key as any)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'stats' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Your Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Stories Views</span>
                      <span className="font-medium">{mockUserStats.storiesViewed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Likes per Story</span>
                      <span className="font-medium">
                        {Math.round(mockUserStats.likesReceived / mockUserStats.storiesPosted)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Engagement Rate</span>
                      <span className="font-medium">
                        {Math.round((mockUserStats.likesReceived + mockUserStats.commentsReceived) / mockUserStats.storiesViewed * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'stories' && (
              <div className="space-y-4">
                {mockRecentStories.map((story) => (
                  <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{story.title}</CardTitle>
                        {story.is_anonymous && (
                          <Badge variant="outline" className="ml-2">Anonymous</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {story.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {story.likes} likes
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {story.comments} comments
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {story.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(story.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your recent activity will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" onClick={() => navigate('/analytics')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
              
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;