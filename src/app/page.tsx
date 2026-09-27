import { LandingPage } from "@/components/landing/landing-page";
import { PWAStandaloneRedirect } from "@/components/pwa-standalone-redirect";

export default function Home() {
  return (
    <>
      <PWAStandaloneRedirect />
      <LandingPage />
    </>
  );
}
