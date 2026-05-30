import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

type PlanTier = {
  badge?: string;
  cta: string;
  description: string;
  features: string[];
  href: string;
  name: string;
  orderClass: string;
  price: string;
  priceNote: string;
  subtitle: string;
  variant: "default" | "featured";
  glow: "left" | "center" | "right";
};

const plans: PlanTier[] = [
  {
    cta: "Начать бесплатно",
    description: "Для знакомства с Life RPG-системой и запуска первой траектории развития.",
    features: [
      "До 3 активных целей",
      "До 2 активных челленджей",
      "До 5 активных привычек",
      "Базовый Dashboard",
      "XP, уровни и базовые достижения",
      "3 AI-рекомендации в неделю",
      "История прогресса за 7 дней",
    ],
    href: "/register",
    name: "Free",
    orderClass: "order-2 lg:order-1",
    price: "0 ₽",
    priceNote: "навсегда",
    subtitle: "Стартовая прокачка",
    variant: "default",
    glow: "left",
  },
  {
    badge: "Рекомендуемый",
    cta: "Выбрать Pro",
    description:
      "Для тех, кто хочет системно прокачивать цели, привычки, навыки, здоровье и финансы.",
    features: [
      "Неограниченные цели",
      "Неограниченные челленджи",
      "Неограниченные привычки",
      "Расширенная аналитика прогресса",
      "AI-декомпозиция целей",
      "AI-генерация челленджей",
      "Premium-шаблоны",
      "История прогресса без ограничений",
    ],
    href: "/register?plan=pro",
    name: "Pro",
    orderClass: "order-1 lg:order-2",
    price: "499 ₽",
    priceNote: "в месяц",
    subtitle: "Полная система развития",
    variant: "featured",
    glow: "center",
  },
  {
    cta: "Выбрать Ultra",
    description:
      "Для пользователей, которым нужны персональные стратегии, глубокий анализ прогресса и максимум AI-возможностей.",
    features: [
      "Всё из Pro",
      "Продвинутый AI Ассистент",
      "Глубокий анализ просадок",
      "Персональные стратегии развития",
      "Недельные и месячные AI-отчёты",
      "Расширенная аналитика Life Score",
      "Ultra-достижения",
      "Ранний доступ к новым функциям",
    ],
    href: "/register?plan=ultra",
    name: "Ultra",
    orderClass: "order-3 lg:order-3",
    price: "999 ₽",
    priceNote: "в месяц",
    subtitle: "AI и глубокая аналитика",
    variant: "default",
    glow: "right",
  },
];

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
        <span className="pricing-btn-icon pricing-btn-icon-dark">
          <ArrowUpRight size={16} strokeWidth={2.25} />
        </span>
      </Link>
    );
  }

  return (
    <Link className="pricing-btn pricing-btn-default group" href={href}>
      <span>{label}</span>
      <span className="pricing-btn-icon">
        <ArrowUpRight className="text-[#F97316]" size={16} strokeWidth={2.25} />
      </span>
    </Link>
  );
}

function PricingCard({ plan }: { plan: PlanTier }) {
  const isFeatured = plan.variant === "featured";

  return (
    <article
      className={[
        "pricing-card relative flex h-full flex-col overflow-hidden rounded-[28px] border p-8 sm:p-9",
        plan.orderClass,
        isFeatured ? "pricing-card-featured z-10" : "pricing-card-default",
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
        {plan.badge ? (
          <span className="pricing-badge mb-3 inline-flex w-fit">{plan.badge}</span>
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

        <p className="mt-3 text-[13px] leading-[1.5] text-[#9CA3AF]">{plan.description}</p>

        <div className="my-6 h-px bg-[rgb(255_255_255/0.08)]" />

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
          Включено
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

        <PlanButton href={plan.href} label={plan.cta} variant={plan.variant} />
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
            {showPageHeader ? "Тарифы Lifera" : "Выбери план прокачки"}
          </h2>
          <p className="mt-4 max-w-[540px] text-[15px] leading-[1.5] text-[var(--landing-text-secondary)] sm:text-base">
            Начни бесплатно, а когда система станет частью твоего развития — открой Pro или
            Ultra.
          </p>
          {showPageHeader ? (
            <p className="mt-3 text-sm leading-[1.5] text-[var(--landing-text-muted)]">
              Оплата на этапе MVP подключается через регистрацию и demo-активацию плана. Payment
              provider будет добавлен позже.
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
            Не знаешь, какой план выбрать?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-[1.5] text-[var(--landing-text-secondary)] sm:text-[15px]">
            Начни бесплатно — обновишь позже, когда поймёшь, что тебе нужно.
          </p>
          <Link className="pricing-bottom-cta-btn group mt-8 inline-flex" href="/register">
            <span>Начать бесплатно</span>
            <span className="pricing-btn-icon pricing-btn-icon-dark">
              <ArrowUpRight size={16} strokeWidth={2.25} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
