import Link from "next/link";
import { Check } from "lucide-react";

import {
  PLAN_AUDIENCE,
  PLAN_COMING_SOON,
  PLAN_CTAS,
  PLAN_INCLUDED_NOW,
  PLAN_LABELS,
  PLAN_PRICES,
  PLAN_RECOMMENDED,
  PLAN_ROLES,
  PLAN_VALUE_PROMISES,
} from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";

type PricingPlan = {
  comingSoon: string[];
  cta: { href: string; label: string };
  description: string;
  features: string[];
  glow: "center" | "left" | "right";
  name: string;
  orderClass: string;
  price: string;
  priceNote: string;
  recommended?: boolean;
  subtitle: string;
  tier: PlanTier;
  variant: "default" | "featured";
};

const plans: PricingPlan[] = (["free", "pro", "ultra"] as const).map((tier) => ({
  comingSoon: PLAN_COMING_SOON[tier],
  cta: PLAN_CTAS[tier],
  description: PLAN_AUDIENCE[tier],
  features: PLAN_INCLUDED_NOW[tier].map((item) => item.label),
  glow: tier === "free" ? "left" : tier === "pro" ? "center" : "right",
  name: PLAN_LABELS[tier],
  orderClass:
    tier === "pro" ? "order-1 lg:order-2" : tier === "free" ? "order-2 lg:order-1" : "order-3 lg:order-3",
  price: PLAN_PRICES[tier].amount,
  priceNote: PLAN_PRICES[tier].note,
  recommended: tier === PLAN_RECOMMENDED,
  subtitle: PLAN_ROLES[tier],
  tier,
  variant: tier === PLAN_RECOMMENDED ? "featured" : "default",
}));

type PricingSectionProps = {
  id?: string;
  showPageHeader?: boolean;
};

function PlanButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "default" | "featured";
}) {
  if (variant === "featured") {
    return (
      <Link className="pricing-btn pricing-btn-featured group" href={href}>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link className="pricing-btn pricing-btn-default group" href={href}>
      <span>{label}</span>
    </Link>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const isFeatured = plan.variant === "featured";

  return (
    <article
      className={[
        "pricing-card relative flex h-full flex-col overflow-hidden rounded-[28px] border p-8 sm:p-9",
        plan.orderClass,
        isFeatured ? "pricing-card-featured z-10" : "pricing-card-default",
        plan.tier === "ultra" ? "border-[rgb(129_140_248/0.18)]" : "",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "pricing-card-glow pointer-events-none",
          plan.glow === "left" ? "pricing-card-glow-left" : "",
          plan.glow === "right" ? "pricing-card-glow-right" : "",
          plan.glow === "center" ? "pricing-card-glow-center" : "",
        ].join(" ")}
      />

      <div className="relative flex flex-1 flex-col">
        {plan.recommended ? (
          <span className="pricing-badge mb-3 inline-flex w-fit">Рекомендуем</span>
        ) : (
          <span aria-hidden className="mb-3 block h-[22px]" />
        )}

        <p className="text-[1.75rem] font-semibold tracking-tight text-[#F5F5F2] sm:text-[2rem]">
          {plan.name}
        </p>
        <p className="mt-1.5 text-[13px] text-[#8C8C8C]">{plan.subtitle}</p>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[2.5rem] font-semibold leading-none tracking-tight text-[#F5F5F2] sm:text-[3.25rem]">
            {plan.price}
          </span>
          <span className="text-[13px] text-[#8C8C8C]">/ {plan.priceNote}</span>
        </div>

        <p className="mt-3 text-[13px] leading-[1.5] text-[#B8B8B8]">{PLAN_VALUE_PROMISES[plan.tier]}</p>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#9CA3AF]">{plan.description}</p>

        <div className="my-6 h-px bg-[rgb(255_255_255/0.08)]" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
          Доступно сейчас
        </p>
        <ul className="mt-3 flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li
              className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[#B8B8B8]"
              key={feature}
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[rgb(255_106_42/0.22)] bg-[rgb(255_90_31/0.07)]">
                <Check className="text-[#F97316]" size={9} strokeWidth={2.75} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {plan.comingSoon.length > 0 ? (
          <>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              Скоро
            </p>
            <ul className="mt-3 space-y-2">
              {plan.comingSoon.map((item) => (
                <li className="text-[13px] leading-[1.5] text-[#8C8C8C]" key={item}>
                  {item} · <span className="text-[#6B7280]">Скоро</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <PlanButton href={plan.cta.href} label={plan.cta.label} variant={plan.variant} />
      </div>
    </article>
  );
}

export function PricingSection({ id = "pricing", showPageHeader = false }: PricingSectionProps) {
  return (
    <section className="pricing-section landing-section relative overflow-hidden" id={id}>
      <div aria-hidden className="pricing-section-glow pointer-events-none" />

      <div className="landing-container relative">
        {showPageHeader ? (
          <Link
            className="mb-8 inline-flex text-sm font-semibold text-[var(--landing-text-secondary)] transition-colors hover:text-[var(--landing-text)]"
            href="/"
          >
            На главную
          </Link>
        ) : null}

        <header className="max-w-[640px]">
          <h2 className="text-[clamp(1.875rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight text-[var(--landing-text)]">
            {showPageHeader ? "Тарифы Lifera" : "Выберите уровень системы"}
          </h2>
          <p className="mt-4 max-w-[540px] text-[15px] leading-[1.5] text-[var(--landing-text-secondary)] sm:text-base">
            Free — стартовая система. Pro — полная Life OS. Ultra — AI-стратег с глубокими отчётами,
            когда они будут готовы.
          </p>
          {showPageHeader ? (
            <p className="mt-3 text-sm leading-[1.5] text-[var(--landing-text-muted)]">
              Оплата пока не подключена. Выбор Pro или Ultra сохраняется как намерение при регистрации.
            </p>
          ) : null}
        </header>

        <div className="pricing-cards-grid mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-7">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <div className="pricing-bottom-cta mt-14 text-center lg:mt-20">
          <p className="text-lg font-medium text-[var(--landing-text)] sm:text-xl">
            Не уверены, какой уровень нужен?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-[1.5] text-[var(--landing-text-secondary)] sm:text-[15px]">
            Начните бесплатно — обновите позже, когда система станет частью вашего ритма.
          </p>
          <Link className="pricing-bottom-cta-btn group mt-8 inline-flex" href="/register">
            <span>Начать бесплатно</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
