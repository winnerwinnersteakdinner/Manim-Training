import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileFeatures from "@/components/MobileFeatures";
import Features from "@/components/Features";
import CommunityPreview from "@/components/CommunityPreview";
import AppPromo from "@/components/AppPromo";
import PremiumFeatures from "@/components/PremiumFeatures";
import WellnessResources from "@/components/WellnessResources";
import CommunityGuidelines from "@/components/CommunityGuidelines";
import UpgradePrompt from "@/components/UpgradePrompt";
import { SearchLimitBanner } from "@/components/SearchLimitBanner";
import { SearchInterface } from "@/components/SearchInterface";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <SearchLimitBanner />
          <SearchInterface />
        </div>
        <Features />
        <CommunityPreview />
        <WellnessResources />
        <CommunityGuidelines />
        <MobileFeatures />
        <AppPromo />
        <PremiumFeatures />
        <UpgradePrompt />
      </main>
      <Footer />
    </div>
  );
};

export default Index;