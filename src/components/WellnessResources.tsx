import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Phone, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Shield, 
  Activity,
  ExternalLink,
  Brain,
  Leaf,
  Zap,
  Target
} from 'lucide-react';

const WellnessResources = () => {
  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support and suicide prevention',
      icon: <Phone className="w-5 h-5" />,
      urgent: true
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis counseling via text',
      icon: <MessageCircle className="w-5 h-5" />,
      urgent: true
    },
    {
      name: 'Veterans Crisis Line',
      number: '988, then press 1',
      description: 'Specialized support for veterans',
      icon: <Shield className="w-5 h-5" />,
      urgent: true
    }
  ];

  const mentalHealthTools = [
    {
      title: 'Mood Tracker',
      description: 'Track your daily mood and identify patterns',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Breathing Exercises',
      description: 'Guided breathing techniques for stress relief',
      icon: <Leaf className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Gratitude Journal',
      description: 'Practice gratitude and positive reflection',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      title: 'Goal Setting',
      description: 'Set and track personal wellness goals',
      icon: <Target className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const educationalResources = [
    {
      title: 'Understanding Depression',
      description: 'Learn about symptoms, causes, and treatment options',
      category: 'Mental Health',
      readTime: '5 min read'
    },
    {
      title: 'Building Resilience',
      description: 'Strategies for developing emotional strength',
      category: 'Wellness',
      readTime: '7 min read'
    },
    {
      title: 'Healthy Communication',
      description: 'Improve relationships through better communication',
      category: 'Relationships',
      readTime: '6 min read'
    },
    {
      title: 'Stress Management',
      description: 'Practical techniques for managing daily stress',
      category: 'Wellness',
      readTime: '4 min read'
    }
  ];

  const communitySupport = [
    {
      title: 'Peer Support Groups',
      description: 'Connect with others who understand your journey',
      members: '2,500+ members',
      active: true
    },
    {
      title: 'Wellness Challenges',
      description: 'Join community challenges for motivation',
      members: '1,200+ participants',
      active: true
    },
    {
      title: 'Expert Q&A Sessions',
      description: 'Get answers from mental health professionals',
      members: 'Monthly sessions',
      active: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wellness Resources & Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tools, resources, and support to help you on your healing journey. You're not alone.
          </p>
        </div>

        {/* Crisis Resources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Crisis Support
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {crisisResources.map((resource, index) => (
              <Card key={index} className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-red-600">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {resource.name}
                      </h4>
                      <p className="text-2xl font-bold text-red-600 mb-2">
                        {resource.number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      {resource.urgent && (
                        <Badge variant="destructive" className="mt-2">
                          Available 24/7
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mental Health Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Wellness Tools
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentalHealthTools.map((tool, index) => (
              <Card key={index} className={`border-2 ${tool.borderColor} ${tool.bgColor} hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6 text-center">
                  <div className={`${tool.color} mb-4`}>
                    {tool.icon}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {tool.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement tool functionality
                      alert(`${tool.title} would open here`);
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Educational Resources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Educational Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {educationalResources.map((resource, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {resource.readTime}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => {
                      // TODO: Implement article reading
                      alert(`"${resource.title}" article would open here`);
                    }}
                  >
                    Read More
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Support */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Community Support
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {communitySupport.map((group, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <Badge variant={group.active ? "default" : "secondary"} className="text-xs">
                      {group.active ? 'Active' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {group.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {group.members}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={!group.active}
                      onClick={() => {
                        if (group.active) {
                          // TODO: Implement join functionality
                          alert(`Joining "${group.title}"`);
                        } else {
                          // TODO: Implement notification signup
                          alert(`You'll be notified when "${group.title}" becomes available`);
                        }
                      }}
                    >
                      {group.active ? 'Join' : 'Notify Me'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Your Mental Health Matters
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Remember, seeking help is a sign of strength, not weakness. These resources are here to support you on your journey to better mental health and wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  // TODO: Implement journey starter
                  alert('Starting your wellness journey...');
                }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  // TODO: Implement chat/support
                  alert('Connecting you with support...');
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to Someone
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WellnessResources; 