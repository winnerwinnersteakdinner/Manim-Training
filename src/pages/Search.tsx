import React, { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const mockSearchResults = [
    {
      id: '1',
      type: 'story',
      title: 'My Journey with Anxiety',
      content: 'Sharing my experience with anxiety and how I found ways to cope...',
      location: 'New York, NY',
      created_at: '2024-01-15',
      relevance_score: 0.95
    },
    {
      id: '2',
      type: 'story',
      title: 'Finding Hope After Loss',
      content: 'This is my story about dealing with grief and finding light again...',
      location: 'Los Angeles, CA',
      created_at: '2024-01-14',
      relevance_score: 0.87
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // TODO: Implement actual search functionality
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Search Stories</h1>
          
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stories nationwide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <SearchIcon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => alert('Location filter would open here')}
            >
              <Filter className="w-3 h-3" />
              All Locations
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => alert('Time filter would open here')}
            >
              <Calendar className="w-3 h-3" />
              Any Time
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap"
              onClick={() => alert('Mental Health filter applied')}
            >
              Mental Health
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="whitespace-nowrap"
              onClick={() => alert('Recovery filter applied')}
            >
              Recovery
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {!user && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Sign in to search and interact with stories from your community
              </p>
              <Button className="w-full mt-4" onClick={() => window.location.href = '/auth'}>
                Sign In to Search
              </Button>
            </CardContent>
          </Card>
        )}

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {mockSearchResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {Math.round(result.relevance_score * 100)}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {result.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {result.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(result.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && mockSearchResults.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No stories found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search terms or filters to find more stories.
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Search;