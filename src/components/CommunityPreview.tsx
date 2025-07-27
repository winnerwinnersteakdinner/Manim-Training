import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Flag, Clock } from "lucide-react";
import ReportModal from "@/components/ReportModal";
import ContentWarningSystem from "@/components/ContentWarningSystem";
import TrustScoreIndicator from "@/components/TrustScoreIndicator";

const CommunityPreview = () => {
  const posts = [
    {
      id: 1,
      title: "My Journey Through Mental Health Recovery",
      content: "After struggling with anxiety and depression for years, I found healing through community support and therapy. This is my story of recovery and how I learned to be vulnerable with other men...",
      tags: ["Mental Health", "Recovery", "Healing Journey"],
      timeAgo: "3 hours ago",
      reactions: 42,
      comments: 18,
      verified: true,
      trustScore: 95,
      userVerified: true,
      contentWarning: false
    },
    {
      id: 2,
      title: "Lessons from a Toxic Relationship",
      content: "Sharing my experience with emotional manipulation and how I rebuilt my self-worth. Brothers, it's okay to ask for help and set boundaries...",
      tags: ["Relationships", "Boundaries", "Self-Worth"],
      timeAgo: "6 hours ago",
      reactions: 38,
      comments: 22,
      verified: true,
      trustScore: 91,
      userVerified: true,
      contentWarning: false
    },
    {
      id: 3,
      title: "Overcoming Addiction: My Story of Hope",
      content: "This narrative discusses substance addiction recovery and may be triggering for some. It's a story of hope, community support, and finding strength in vulnerability.",
      tags: ["Addiction Recovery", "Support", "Hope"],
      timeAgo: "1 day ago",
      reactions: 67,
      comments: 31,
      verified: true,
      trustScore: 88,
      userVerified: true,
      contentWarning: true,
      warningType: 'sensitive' as const,
      warningReason: 'Contains discussions of addiction and recovery'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Healing Stories
          </h2>
          <p className="text-xl text-muted-foreground">
            Personal narratives of resilience, wellness, and growth from our brotherhood
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {posts.map((post) => (
            <Card key={post.id} className="border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-foreground text-lg leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <TrustScoreIndicator 
                        score={post.trustScore} 
                        verified={post.userVerified}
                        showDetails
                      />
                      {post.verified && (
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          Verified Post
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.contentWarning ? (
                  <ContentWarningSystem 
                    warningType={post.warningType}
                    warningReason={post.warningReason}
                    moderatedContent={post.verified}
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </ContentWarningSystem>
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {post.content}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.timeAgo}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.reactions}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                  </div>
                  
                  <ReportModal 
                    contentType="post" 
                    contentId={post.id.toString()}
                  >
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                      Report
                    </Button>
                  </ReportModal>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" className="px-8">
            <MessageCircle className="w-5 h-5" />
            Share Your Story
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;