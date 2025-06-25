import Navigation from "@/components/navigation";
import { HeroSection, FeaturesSection, PricingSection, Footer } from "@/components/landing-sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
