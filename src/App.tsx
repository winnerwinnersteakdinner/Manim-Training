import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Guidelines from "./pages/Guidelines";
import Verification from "./pages/Verification";
import Analytics from "./pages/Analytics";
import Wireframes from "./pages/Wireframes";
import Search from "./pages/Search";
import Alerts from "./pages/Alerts";
import Post from "./pages/Post";
import WriteStory from "./pages/WriteStory";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import MobileApp from "@/components/MobileApp";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsProvider>
                <Routes>
                  <Route 
                    path="/" 
                    element={isMobile ? <MobileApp /> : <Index />} 
                  />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/guidelines" element={<Guidelines />} />
                  <Route path="/verification" element={<Verification />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/wireframes" element={<Wireframes />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/post" element={<Post />} />
                  <Route path="/write-story" element={<WriteStory />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;