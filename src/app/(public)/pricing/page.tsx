import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { PricingSection } from "@/components/landing/pricing-section";
import "@/components/landing/landing.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Free, Pro и Ultra — тарифы Lifera для целей, челленджей, привычек и AI-рекомендаций.",
};

export default function PricingPage() {
  return (
    <div className="landing-page min-h-screen overflow-x-hidden">
      <div className="landing-grid-bg pointer-events-none fixed inset-0 z-0 opacity-60" />
      <LandingHeader />
      <main className="relative z-10 pt-20">
        <PricingSection showPageHeader />
      </main>
      <LandingFooter />
    </div>
  );
}
