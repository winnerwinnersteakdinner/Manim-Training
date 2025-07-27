import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Heart, 
  Shield, 
  Users, 
  Star, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Gift
} from 'lucide-react';

const UpgradePrompt = () => {
  const premiumFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Advanced Privacy Controls',
      description: 'Enhanced anonymity and privacy protection for your stories',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Unlimited Name Alerts',
      description: 'Set unlimited alerts for names you want to monitor',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Priority Story Visibility',
      description: 'Your stories appear higher in search results',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Exclusive Wellness Tools',
      description: 'Access to premium mental health and wellness resources',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const communityImpact = [
    { metric: '25K+', label: 'Stories Shared' },
    { metric: '15K+', label: 'Verified Members' },
    { metric: '90%', label: 'Report Healing' },
    { metric: '$50K+', label: 'Donated to Mental Health' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Support Our Mission
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upgrade to Premium and help us continue building a safe, supportive community for men's mental health and wellness.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Premium Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Premium Features
              </h3>
              <p className="text-muted-foreground mb-6">
                Unlock powerful tools to enhance your experience and support our community.
              </p>
            </div>

            <div className="grid gap-4">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className={`border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${feature.color} mt-0.5`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing & Impact */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">Premium Membership</CardTitle>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 w-fit mx-auto">
                  <Gift className="w-3 h-3 mr-1" />
                  Cancel anytime
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Your subscription directly supports our mission to provide mental health resources and build a supportive community.
                  </p>
                  <Button size="lg" className="w-full text-lg">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Premium
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="bg-background/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 text-center">
                    Community Impact
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {communityImpact.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary">{item.metric}</div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground italic mb-2">
                      "This platform has been a lifeline for me. The premium features help me feel safer sharing my story while supporting others."
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-foreground">- Premium Member</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-foreground">
                  More Than Just Features
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Your premium subscription helps us provide free mental health resources, crisis support, and maintain a safe, moderated environment for everyone in our community.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community Safety</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional moderation and safety tools
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Mental Health Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Crisis resources and wellness tools
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community Growth</h4>
                  <p className="text-sm text-muted-foreground">
                    Platform development and new features
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

export default UpgradePrompt;