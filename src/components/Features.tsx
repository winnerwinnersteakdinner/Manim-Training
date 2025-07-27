import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Bell, MessageSquare, Search, Eye, Coffee, Heart, AlertTriangle, MapPin } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Health & Safety Stories",
      description: "Share experiences about health challenges, safety warnings, and lessons learned from medical situations.",
      color: "text-amber-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safety First",
      description: "Verified male-only community with strict privacy protection and anonymous sharing for sensitive health topics.",
      color: "text-green-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Brotherhood Support",
      description: "Connect with verified men who understand health challenges and offer support through difficult times.",
      color: "text-amber-600"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Health Alerts",
      description: "Get notified when someone mentions health conditions, treatments, or safety concerns you're monitoring.",
      color: "text-orange-600"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Story Discovery",
      description: "Search health stories by condition, location, or topic to find relevant experiences and support.",
      color: "text-amber-600"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Identity Verification",
      description: "Secure verification ensures only real men participate in our health and safety community.",
      color: "text-blue-600"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-brown-50/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Health & Safety Features
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe, verified community where men share health experiences and support each other through physical and mental health challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-amber-200/50 hover:border-amber-300 transition-all duration-300 hover:shadow-soft bg-white/80 backdrop-blur-sm cursor-pointer"
              onClick={() => {
                // TODO: Implement feature-specific actions
                const actions = {
                  0: () => alert('Navigate to story creation'),
                  1: () => alert('Show safety features'),
                  2: () => alert('Navigate to community'),
                  3: () => alert('Navigate to alerts'),
                  4: () => alert('Navigate to search'),
                  5: () => alert('Navigate to verification')
                };
                actions[index as keyof typeof actions]?.();
              }}
            >
              <CardHeader>
                <div className={`${feature.color} mb-2`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust & Safety Section */}
        <div className="mt-16">
          <Card className="border-green-200 bg-green-50/80">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-green-600" />
                <CardTitle className="text-xl">Trust & Safety</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Verified Members Only</h4>
                  <p className="text-sm text-muted-foreground">
                    All members are verified through our secure identity verification system
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Anonymous Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your health experiences anonymously to protect your privacy
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community Moderation</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional moderation ensures a safe and supportive environment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;