import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadgesSection } from "@/components/TrustBadgesSection";
import { F6SRecognitionSection } from "@/components/F6SRecognitionSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhyPurelyticsSection } from "@/components/WhyPurelyticsSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { IngredientFactsMarquee } from "@/components/IngredientFactsMarquee";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BetaSignupSection } from "@/components/BetaSignupSection";
import { FAQSection } from "@/components/FAQSection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { FloatingBetaButton } from "@/components/FloatingBetaButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBadgesSection />
        <F6SRecognitionSection />
        <HowItWorksSection />
        <WhyPurelyticsSection />
        <UseCasesSection />
        <IngredientFactsMarquee />
        <FeaturesSection />
        <SocialProofSection />
        <TestimonialsSection />
        <BetaSignupSection />
        <FAQSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingBetaButton />
    </div>
  );
};

export default Index;
