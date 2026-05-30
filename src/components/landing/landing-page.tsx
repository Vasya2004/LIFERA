import { LandingAi } from "@/components/landing/landing-ai";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingLoop } from "@/components/landing/landing-loop";
import { LandingProblem } from "@/components/landing/landing-problem";
import { LandingSolution } from "@/components/landing/landing-solution";
import { PricingSection } from "@/components/landing/pricing-section";
import "./landing.css";

export function LandingPage() {
  return (
    <div className="landing-page overflow-x-hidden">
      <div className="landing-grid-bg pointer-events-none fixed inset-0 z-0 opacity-60" />
      <div
        aria-hidden
        className="landing-glow-orb pointer-events-none fixed left-1/2 top-[-120px] z-0 h-[520px] w-[720px] -translate-x-1/2"
      />

      <LandingHeader />

      <main className="relative z-10">
        <LandingHero />
        <LandingProblem />
        <LandingSolution />
        <LandingLoop />
        <LandingFeatures />
        <LandingAi />
        <PricingSection />
        <LandingFaq />
        <LandingFinalCta />
      </main>

      <LandingFooter />
    </div>
  );
}
