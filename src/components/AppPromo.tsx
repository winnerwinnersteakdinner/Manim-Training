import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Star } from "lucide-react";

const AppPromo = () => {
  return (
    <section id="alerts" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-primary/20 shadow-elevated">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Get the Coffee App
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Take our coffee community with you everywhere. Share experiences, get insights, 
                  and connect with others navigating the dating world.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Mobile First</h3>
                  <p className="text-sm text-muted-foreground">
                    Designed for on-the-go dating safety
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold">Free Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Core features available for free
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="default" size="lg" className="px-8">
                  <Download className="w-5 h-5" />
                  Download for iOS
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Compatible with Tinder, Bumble, Hinge, Match, and all major dating apps
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AppPromo;