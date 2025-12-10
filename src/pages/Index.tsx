import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhyPurelyticsSection } from "@/components/WhyPurelyticsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { BetaSignupSection } from "@/components/BetaSignupSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhyPurelyticsSection />
        <FeaturesSection />
        <SocialProofSection />
        <BetaSignupSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
