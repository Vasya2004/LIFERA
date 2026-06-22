import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingHero() {
  const heroImageSrc = "/brand/hero-bg.webp?v=20260616";

  return (
    <section className="landing-hero relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImageSrc}
          alt=""
          fill
          sizes="100vw"
          className="scale-[1.04] object-cover object-[58%_center] lg:scale-[1.05] lg:object-[68%_center] min-[1400px]:object-[66%_center] xl:scale-[1.06]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(5_5_6/0.65)] via-[rgb(5_5_6/0.28)] to-[rgb(5_5_6/0.04)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(5_5_6/0.58)] via-transparent to-[rgb(5_5_6/0.14)]" />
        <div className="landing-hero-grid-lines" aria-hidden="true" />

        {/* ── Data HUD Layer ── */}
        <div className="hero-data-hud" aria-hidden="true">
          {/* Vertical grid lines */}
          <div className="hud-vline hud-vline-1" />
          <div className="hud-vline hud-vline-2" />
          <div className="hud-vline hud-vline-3" />

          {/* Mini bar chart — top right */}
          <div className="hud-chart">
            <div className="hud-bars">
              <span className="hud-bar" style={{ height: "38%" }} />
              <span className="hud-bar" style={{ height: "56%" }} />
              <span className="hud-bar" style={{ height: "44%" }} />
              <span className="hud-bar" style={{ height: "72%" }} />
              <span className="hud-bar" style={{ height: "60%" }} />
              <span className="hud-bar" style={{ height: "85%" }} />
            </div>
            <div className="hud-chart-label">
              <span className="hud-chart-value">+42%</span>
              <span className="hud-chart-desc">динамика прогресса</span>
            </div>
          </div>

          {/* Progress arc — bottom right */}
          <div className="hud-arc-wrap">
            <svg viewBox="0 0 80 80" fill="none" className="hud-arc-svg">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255,90,31,0.3)"
                strokeWidth="3"
                strokeDasharray="82 132"
                strokeLinecap="round"
                className="hud-arc-progress"
              />
            </svg>
            <div className="hud-arc-label">
              <span className="hud-arc-value">+38%</span>
              <span className="hud-arc-desc">фокус недели</span>
            </div>
          </div>

          {/* Center-right label */}
          <div className="hud-text-block">
            <span className="hud-text-line-1">связь целей</span>
            <span className="hud-text-line-2">с ежедневными действиями</span>
          </div>

          {/* Near-glasses label */}
          <div className="hud-near-glasses">следующий шаг</div>

          {/* Tiny dots */}
          <div className="hud-dot hud-dot-1" />
          <div className="hud-dot hud-dot-2" />
          <div className="hud-dot hud-dot-3" />
          <div className="hud-dot hud-dot-4" />

          {/* Connecting lines between dots */}
          <svg className="hud-dot-lines" viewBox="0 0 200 200" fill="none">
            <line x1="40" y1="60" x2="120" y2="90" stroke="rgba(255,90,31,0.16)" strokeWidth="0.6" />
            <line x1="120" y1="90" x2="160" y2="150" stroke="rgba(255,90,31,0.12)" strokeWidth="0.6" />
            <line x1="60" y1="140" x2="120" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          </svg>

          {/* Subtle scan line */}
          <div className="hud-scanline" />
        </div>

        <div className="landing-hero-progress-arc" aria-hidden="true" />
        <div className="landing-hero-glasses-glow" aria-hidden="true" />
      </div>

      <div className="landing-container relative z-10 grid min-h-[100svh] items-center gap-12 pb-20 pt-32 sm:pt-36 lg:min-h-[860px] lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-10 lg:pb-24 lg:pt-32">
        <div className="flex w-full flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--landing-accent)]" aria-hidden="true" />
            Персональная Life OS с AI-помощником
          </p>

          <h1 className="max-w-[680px] text-[clamp(2.55rem,4.4vw,4rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-white">
            Собери свою жизнь
            <br />
            в единую систему
            <br />
            <span className="landing-hero-title-accent">роста</span>
          </h1>

          <p className="max-w-[610px] text-base leading-7 text-[rgb(255_255_255/0.7)] sm:text-xl sm:leading-8">
            Lifera объединяет цели, желания, привычки, здоровье, финансы, достижения и
            AI-рекомендации в персональную систему прогресса.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/register" className="landing-hero-cta">
              Начать бесплатно
            </Link>
            <Link href="#how-it-works" className="landing-hero-secondary-cta">
              Посмотреть демо
            </Link>
          </div>
        </div>

        <div className="landing-hero-visual" aria-hidden="true" />
      </div>

      <div className="landing-hero-brand pointer-events-none select-none" aria-hidden="true">
        LIFERA
      </div>
    </section>
  );
}
