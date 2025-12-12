import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadgesSection } from "@/components/TrustBadgesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhyPurelyticsSection } from "@/components/WhyPurelyticsSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BetaSignupSection } from "@/components/BetaSignupSection";
import { FAQSection } from "@/components/FAQSection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBadgesSection />
        <HowItWorksSection />
        <WhyPurelyticsSection />
        <UseCasesSection />
        <FeaturesSection />
        <SocialProofSection />
        <TestimonialsSection />
        <BetaSignupSection />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
