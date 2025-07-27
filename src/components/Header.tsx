import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, User, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import coffeeIcon from "@/assets/coffee-icon.png";

const Header = () => {
  const [isVerified, setIsVerified] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      setIsVerified(data?.is_verified || false);
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={coffeeIcon} alt="Wellness Community" className="w-8 h-8 rounded-lg" />
            <h1 className="text-xl font-bold text-foreground">
              Coffee
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#stories" className="text-muted-foreground hover:text-foreground transition-colors">
              Stories
            </a>
            <a href="#wellness" className="text-muted-foreground hover:text-foreground transition-colors">
              Wellness
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/verification">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {isVerified ? (
                      <Badge className="bg-green-500 text-white">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Not Verified</Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Analytics
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate("/auth")}
                size="sm"
                className="hidden md:flex"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate('/write-story')}
            >
              <MessageCircle className="w-4 h-4" />
              Join Community
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => {
                // TODO: Implement mobile menu
                alert('Mobile menu would open here');
              }}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;