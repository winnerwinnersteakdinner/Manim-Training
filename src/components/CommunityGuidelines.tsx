import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      category: 'Safety & Respect',
      rules: [
        {
          title: 'No Harassment or Bullying',
          description: 'Treat all members with kindness and respect. No hate speech, threats, or personal attacks.',
          severity: 'critical',
          icon: <XCircle className="w-5 h-5" />
        },
        {
          title: 'Protect Personal Information',
          description: 'Never share real names, addresses, phone numbers, or other identifying information.',
          severity: 'high',
          icon: <Shield className="w-5 h-5" />
        },
        {
          title: 'Respect Privacy',
          description: 'Don\'t share others\' stories without permission. What\'s shared here stays here.',
          severity: 'high',
          icon: <Shield className="w-5 h-5" />
        }
      ]
    },
    {
      category: 'Storytelling Standards',
      rules: [
        {
          title: 'Share Your Own Experiences',
          description: 'Only share stories that are your own or that you have permission to share.',
          severity: 'medium',
          icon: <Heart className="w-5 h-5" />
        },
        {
          title: 'Be Authentic',
          description: 'Share genuine experiences and feelings. This is a space for real human connection.',
          severity: 'medium',
          icon: <Heart className="w-5 h-5" />
        },
        {
          title: 'Use Content Warnings',
          description: 'Add appropriate warnings for sensitive topics like self-harm, abuse, or trauma.',
          severity: 'medium',
          icon: <AlertTriangle className="w-5 h-5" />
        }
      ]
    },
    {
      category: 'Community Support',
      rules: [
        {
          title: 'Offer Support, Not Advice',
          description: 'Share your experiences and support, but avoid giving medical or professional advice.',
          severity: 'medium',
          icon: <Users className="w-5 h-5" />
        },
        {
          title: 'Encourage Professional Help',
          description: 'If someone is in crisis, encourage them to seek professional help and provide crisis resources.',
          severity: 'high',
          icon: <AlertTriangle className="w-5 h-5" />
        },
        {
          title: 'Report Concerning Content',
          description: 'If you see something that violates our guidelines or concerns you, report it immediately.',
          severity: 'high',
          icon: <Shield className="w-5 h-5" />
        }
      ]
    },
    {
      category: 'Content Quality',
      rules: [
        {
          title: 'No Spam or Self-Promotion',
          description: 'This is not a place for advertising, selling products, or promoting services.',
          severity: 'medium',
          icon: <XCircle className="w-5 h-5" />
        },
        {
          title: 'Keep Stories Relevant',
          description: 'Share stories related to mental health, wellness, relationships, and personal growth.',
          severity: 'low',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: 'Use Appropriate Language',
          description: 'Keep language respectful and avoid excessive profanity or graphic content.',
          severity: 'medium',
          icon: <CheckCircle className="w-5 h-5" />
        }
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Guidelines
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our community is built on trust, respect, and mutual support. These guidelines help us maintain a safe and healing space for everyone.
          </p>
        </div>

        <div className="space-y-12">
          {guidelines.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                {category.category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.rules.map((rule, ruleIndex) => (
                  <Card key={ruleIndex} className="border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="text-primary">
                          {rule.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{rule.title}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(rule.severity)}`}
                          >
                            {getSeverityIcon(rule.severity)}
                            <span className="ml-1 capitalize">{rule.severity}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {rule.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enforcement Section */}
        <div className="mt-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                How We Enforce These Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    First-time violations receive a warning with guidance on how to follow our guidelines.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Temporary Suspension</h4>
                  <p className="text-sm text-muted-foreground">
                    Repeated violations may result in temporary suspension from posting and commenting.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Permanent Ban</h4>
                  <p className="text-sm text-muted-foreground">
                    Severe violations or continued disregard for guidelines may result in permanent removal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="border-green-200 bg-green-50 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-foreground">
                  Together We Thrive
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                By following these guidelines, we create a supportive environment where everyone can share, heal, and grow together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => alert('Thank you for agreeing to follow our community guidelines!')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  I Agree to Follow Guidelines
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert('Report violation form would open here')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Report a Violation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CommunityGuidelines;