import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Users, MapPin, Search, Bell, Heart } from "lucide-react";

const MobileFeatures = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "everything is anonymous",
      description: "Share experiences without revealing your identity"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "screenshots are impossible",
      description: "Content protection ensures privacy and safety"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "all men are verified",
      description: "Community members go through verification process"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "you can access all posts across the entire nation",
      description: "Connect with experiences from coast to coast"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "you can search all posts in the country by a person's name",
      description: "Find relevant experiences and insights"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "you can set alerts for a person's name",
      description: "Get notified when new posts are shared"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "we donate 10% to the 988 Suicide & Crisis Lifeline",
      description: "Supporting mental health resources for everyone in need"
    }
  ];

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            How Coffee Works
          </h2>
          <p className="text-muted-foreground">
            Your safe space for authentic conversations
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-primary border-primary/20 text-primary-foreground shadow-soft"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-secondary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileFeatures;