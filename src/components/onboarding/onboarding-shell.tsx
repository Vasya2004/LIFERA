"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthLavaBackground } from "@/components/auth/auth-lava-background";
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

import "./onboarding.css";

type OnboardingShellProps = {
  children: ReactNode;
  currentStep: number;
};

export function OnboardingShell({ children, currentStep }: OnboardingShellProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="onboarding-page">
      <AuthLavaBackground />

      <div className="onboarding-page-frame">
        <header className="onboarding-header">
          <Link className="onboarding-brand" href="/">
            <Image
              alt=""
              className="h-5 w-auto invert"
              height={157}
              src="/brand/lifera-mark.svg"
              width={105}
            />
            Lifera
          </Link>
          <button className="onboarding-sign-out" onClick={handleSignOut} type="button">
            Выйти
          </button>
        </header>

        <main className="onboarding-main">
          <OnboardingStepper currentStep={currentStep} />
          <div className="onboarding-card">
            <div className="onboarding-card-inner">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
