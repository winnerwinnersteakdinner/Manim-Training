import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Twitter, Instagram } from "lucide-react";
import coffeeIcon from "@/assets/coffee-icon.png";

const Footer = () => {
  return (
    <footer id="about" className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={coffeeIcon} alt="Coffee" className="w-8 h-8 rounded-lg" />
              <h3 className="text-lg font-bold text-foreground">Coffee</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where men connect over coffee to share authentic dating experiences and insights.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Join Forum</a></li>
              <li><a href="/guidelines" className="hover:text-foreground transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Report User</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Name Search</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Set Alerts</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Anonymous Posts</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Verification</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Coffee. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Verified & Secure
            </div>
            <span>•</span>
            <span>Trusted by 50,000+ men</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;