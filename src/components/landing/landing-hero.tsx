import { ArrowRight } from "lucide-react";

import { PrimaryButton, SecondaryButton } from "@/components/landing/landing-buttons";
import { HeroMockup } from "@/components/landing/hero-mockup";

export function LandingHero() {
  return (
    <section className="landing-section landing-section-hero relative">
      <div aria-hidden className="landing-section-glow" />
      <div className="landing-container relative text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)]/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--landing-text-secondary)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--landing-accent)]" />
          Life RPG command center
        </span>
        <h1 className="mx-auto mt-8 max-w-4xl text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-[var(--landing-text)]">
          Прокачивай жизнь как систему
        </h1>
        <p className="mx-auto mt-6 max-w-[540px] text-base leading-[1.5] text-[var(--landing-text-secondary)] sm:text-lg">
          Lifera объединяет цели, челленджи, привычки, XP, достижения и AI-рекомендации в
          единую систему личного прогресса.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PrimaryButton href="/register">
            Начать бесплатно <ArrowRight size={16} />
          </PrimaryButton>
          <SecondaryButton href="#features">Посмотреть возможности</SecondaryButton>
        </div>
        <p className="mt-6 text-xs text-[var(--landing-text-muted)]">
          Не task-manager · не habit tracker · не календарь
        </p>

        <div className="landing-hero-mockup-wrap mx-auto mt-12 max-w-[920px] sm:mt-16">
          <HeroMockup />
          <div aria-hidden className="landing-hero-mockup-fade" />
        </div>
      </div>
    </section>
  );
}
