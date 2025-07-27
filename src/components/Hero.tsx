import { Button } from "@/components/ui/button";
import { Shield, Users, AlertTriangle, Search, Coffee, Heart } from "lucide-react";
import coffeeHero from "@/assets/coffee-hero.png";

const Hero = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-brown-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-8 h-8 text-amber-600" />
                <span className="text-lg font-semibold text-amber-700">Coffee Health & Safety</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Health & Safety Stories,
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {" "}Brotherhood Support
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                A safe space for men to share health experiences, safety warnings, and support each other through physical and mental health challenges.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 bg-amber-600 hover:bg-amber-700" onClick={() => window.location.href = '/write-story'}>
                <Coffee className="w-5 h-5" />
                Share Your Story
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => window.location.href = '/search'}>
                <Search className="w-5 h-5" />
                Read Stories
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">50K+</div>
                <div className="text-sm text-muted-foreground">Health Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">25K+</div>
                <div className="text-sm text-muted-foreground">Verified Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">95%</div>
                <div className="text-sm text-muted-foreground">Safety Rating</div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verified Members Only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-red-600" />
                <span>Anonymous Sharing</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-orange-200/30 rounded-3xl blur-3xl"></div>
            <img 
              src={coffeeHero} 
              alt="People sharing coffee and health experiences" 
              className="relative rounded-2xl shadow-2xl w-full h-auto"
            />
            {/* Floating trust badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-sm">
                  <div className="font-semibold text-foreground">Verified</div>
                  <div className="text-muted-foreground">Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;