import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, MapPin, Plus, LogIn, LogOut, Coffee, Heart, Shield, ArrowUp, RefreshCw, TrendingUp, Clock, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import PremiumFeatures from '@/components/PremiumFeatures';
import { useNavigate } from 'react-router-dom';

const INITIAL_STORIES = [
  {
    id: 1,
    title: "Mental health warning signs I ignored",
    preview: "Looking back, there were clear signs of depression that I should have addressed sooner...",
    location: "New York, NY",
    timeAgo: "2h ago",
    anonymous: true,
    likes: 24,
    comments: 8,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    title: "Positive experience with therapy in Boston",
    preview: "Wanted to share how therapy helped me through a difficult period...",
    location: "Boston, MA",
    timeAgo: "4h ago",
    anonymous: true,
    likes: 18,
    comments: 5,
    isLiked: true,
    isBookmarked: false
  },
  {
    id: 3,
    title: "Physical health red flags I wish I'd noticed",
    preview: "There were symptoms I dismissed that turned out to be serious...",
    location: "Los Angeles, CA",
    timeAgo: "1d ago",
    anonymous: true,
    likes: 42,
    comments: 12,
    isLiked: false,
    isBookmarked: true
  }
];

function generateMoreStories(startId: number, count: number) {
  const locations = ["Chicago, IL", "Austin, TX", "Seattle, WA", "Miami, FL", "Denver, CO"];
  const titles = [
    "Overcoming anxiety at work",
    "How I found support in my community",
    "Dealing with chronic pain",
    "My journey with therapy",
    "Learning to ask for help"
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: titles[(startId + i) % titles.length],
    preview: "This is a sample story preview to keep the feed going and addictive...",
    location: locations[(startId + i) % locations.length],
    timeAgo: `${(startId + i) % 24}h ago`,
    anonymous: Math.random() > 0.5,
    likes: Math.floor(Math.random() * 50) + 5,
    comments: Math.floor(Math.random() * 20) + 1,
    isLiked: Math.random() > 0.7,
    isBookmarked: Math.random() > 0.8
  }));
}

const DAILY_TIPS = [
  "💡 Today's Tip: Regular exercise can reduce anxiety by 20%. Even a 10-minute walk helps!",
  "💡 Today's Tip: Sleep quality directly impacts mental health. Aim for 7-9 hours tonight.",
  "💡 Today's Tip: Talking to someone you trust can reduce stress levels significantly.",
  "💡 Today's Tip: Deep breathing exercises can calm your nervous system in just 2 minutes.",
  "💡 Today's Tip: Setting boundaries is a form of self-care, not selfishness."
];

const MobileApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [alertName, setAlertName] = useState("");
  const { user, signOut } = useAuth();
  const { subscribed } = useSubscription();
  const navigate = useNavigate();
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'new'>('trending');
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const currentTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const feed = feedRef.current;
      if (!feed) return;
      const { scrollTop, scrollHeight, clientHeight } = feed;
      
      // Show/hide scroll to top button
      setShowScrollTop(scrollTop > 300);
      
      // Load more stories
      if (scrollHeight - scrollTop - clientHeight < 200 && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setStories((prev) => [
            ...prev,
            ...generateMoreStories(prev.length + 1, 6)
          ]);
          setLoadingMore(false);
        }, 800);
      }
    };
    
    const feed = feedRef.current;
    if (feed) {
      feed.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (feed) feed.removeEventListener("scroll", handleScroll);
    };
  }, [loadingMore]);

  // Pull to refresh handlers
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (feed.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (feed.scrollTop === 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;
        
        if (diff > 0) {
          e.preventDefault();
          setIsPulling(true);
          setPullDistance(Math.min(diff * 0.5, 100));
        }
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 50) {
        setRefreshing(true);
        setTimeout(() => {
          setStories(INITIAL_STORIES);
          setRefreshing(false);
          setIsPulling(false);
          setPullDistance(0);
        }, 1000);
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }
    };

    feed.addEventListener('touchstart', handleTouchStart, { passive: false });
    feed.addEventListener('touchmove', handleTouchMove, { passive: false });
    feed.addEventListener('touchend', handleTouchEnd);

    return () => {
      feed.removeEventListener('touchstart', handleTouchStart);
      feed.removeEventListener('touchmove', handleTouchMove);
      feed.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance]);

  const handleStoryAction = (storyId: number, action: 'like' | 'bookmark' | 'share') => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        switch (action) {
          case 'like':
            return {
              ...story,
              isLiked: !story.isLiked,
              likes: story.isLiked ? story.likes - 1 : story.likes + 1
            };
          case 'bookmark':
            return { ...story, isBookmarked: !story.isBookmarked };
          default:
            return story;
        }
      }
      return story;
    }));
  };

  const scrollToTop = () => {
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredStories = activeTab === 'trending' 
    ? [...stories].sort((a, b) => b.likes - a.likes)
    : [...stories].sort((a, b) => new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-brown-50 relative">
      {/* Mobile Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6 text-amber-600" />
              <h1 className="text-2xl font-bold text-foreground">Coffee</h1>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => navigate('/write-story')}>
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={signOut}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => navigate('/auth')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search health stories nationwide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-amber-200 focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Daily Wellness Tip Banner */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 border-b border-green-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <span className="text-lg">💡</span>
          <span className="flex-1">{currentTip}</span>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      {isPulling && (
        <div 
          className="flex items-center justify-center py-4 bg-amber-50 border-b border-amber-200"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <RefreshCw className={`w-5 h-5 text-amber-600 mr-2 ${pullDistance > 50 ? 'animate-spin' : ''}`} />
          <span className="text-sm text-amber-700">
            {pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      <div ref={feedRef} className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pb-32">
        {/* Quick Actions with Scroll Snap */}
        <div className="grid grid-cols-2 gap-3 snap-x snap-mandatory overflow-x-auto">
          <Card className="border-amber-200 bg-white/80 cursor-pointer hover:shadow-md transition-all duration-300 snap-start flex-shrink-0" onClick={() => navigate('/alerts')}>
            <CardContent className="p-4 text-center">
              <Bell className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Set Health Alert</h3>
              <p className="text-xs text-muted-foreground">Get notified about conditions</p>
            </CardContent>
          </Card>
          
          <Card className="border-amber-200 bg-white/80 cursor-pointer hover:shadow-md transition-all duration-300 snap-start flex-shrink-0" onClick={() => navigate('/map')}>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Browse by Location</h3>
              <p className="text-xs text-muted-foreground">Find local health resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Setup */}
        <Card className="border-amber-200 bg-white/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              Health Alerts
              {user && !subscribed && (
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                  3/day limit
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter a health condition to monitor"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                className="flex-1 border-amber-200 focus:border-amber-400"
                disabled={!user}
              />
              <Button 
                size="sm" 
                disabled={!user || !alertName.trim()} 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  if (alertName.trim()) {
                    alert(`Alert created for: ${alertName}`);
                    setAlertName('');
                  }
                }}
              >
                Add Alert
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {user ? (
                <>You'll be notified when new health stories mention this condition anywhere in the country.</>
              ) : (
                <>
                  <Button variant="link" className="h-auto p-0 text-xs text-amber-600" onClick={() => navigate('/auth')}>
                    Sign in
                  </Button> to create health alerts
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <PremiumFeatures />

        {/* Story Tabs */}
        <div className="flex gap-2 bg-white/80 rounded-lg p-1 border border-amber-200">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'trending' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Trending
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'new' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('new')}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            New
          </button>
        </div>

        {/* Recent Posts with Reactions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Health Stories</h2>
          <div className="space-y-3">
            {filteredStories.map((post, index) => (
              <Card 
                key={post.id} 
                className="border-amber-200/50 bg-white/80 transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-foreground text-sm leading-tight">
                        {post.title}
                      </h3>
                      {post.anonymous && (
                        <Badge variant="outline" className="text-xs ml-2 border-amber-300 text-amber-700">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.preview}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {post.location}
                        </div>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>

                    {/* Story Reactions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleStoryAction(post.id, 'like')}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStoryAction(post.id, 'bookmark')}
                          className={`p-1 rounded transition-colors ${
                            post.isBookmarked ? 'text-amber-600' : 'text-muted-foreground hover:text-amber-600'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleStoryAction(post.id, 'share')}
                          className="p-1 rounded text-muted-foreground hover:text-green-600 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Community Stats */}
        <Card className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 border-amber-200">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-foreground mb-2">Community Impact</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-amber-600">50K+</div>
                <div className="text-muted-foreground">Members</div>
              </div>
              <div>
                <div className="font-bold text-amber-600">100K+</div>
                <div className="text-muted-foreground">Health Stories</div>
              </div>
              <div>
                <div className="font-bold text-amber-600">95%</div>
                <div className="text-muted-foreground">Safety Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <Card className="border-green-200 bg-green-50/80">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Verified Community</span>
            </div>
            <p className="text-sm text-green-700">
              All members are verified through our secure identity verification system
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-32 right-6 z-40 bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-600 rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Write Story Button (FAB) */}
      <button
        className="fixed bottom-20 right-6 z-50 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 hover:scale-110"
        onClick={() => navigate('/write-story')}
        aria-label="Write a story"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-amber-200">
        <div className="grid grid-cols-4 p-2">
          <Button variant="ghost" className="flex flex-col items-center py-3" onClick={() => navigate('/search')}>
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3" onClick={() => navigate('/alerts')}>
            <Bell className="w-5 h-5 mb-1" />
            <span className="text-xs">Alerts</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3" onClick={() => navigate('/write-story')}>
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">Post</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3" onClick={() => navigate('/map')}>
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-xs">Map</span>
          </Button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MobileApp;
