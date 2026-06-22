import { Brain, Heart, Repeat, Sparkles, Target, Wallet } from "lucide-react";

const fragmentedTools = [
  {
    icon: Target,
    label: "Цели отдельно",
    description: "Планы есть, но они не связаны с ежедневными действиями.",
  },
  {
    icon: Repeat,
    label: "Действия отдельно",
    description: "Привычки и задачи выполняются без связи с большой целью.",
  },
  {
    icon: Wallet,
    label: "Финансы отдельно",
    description: "Деньги и желания не показывают, к чему вы реально движетесь.",
  },
  {
    icon: Heart,
    label: "Здоровье отдельно",
    description: "Энергия, сон и стресс редко учитываются в планировании.",
  },
  {
    icon: Sparkles,
    label: "Навыки отдельно",
    description: "Развитие компетенций не связано с привычками и прогрессом.",
  },
  {
    icon: Brain,
    label: "AI отдельно",
    description: "Ассистент не понимает весь контекст жизни пользователя.",
  },
];

export function LandingProblem() {
  return (
    <section className="landing-section relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0404]/60 via-transparent to-[#0a0404]/60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 50%, black 10%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(255 90 31 / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="landing-container relative">
        <h2 className="max-w-[760px] text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.08] tracking-tight text-[var(--landing-text)]">
          Развитие распадается
          <br className="hidden sm:block" /> на десятки инструментов
        </h2>
        <p className="mt-5 max-w-[720px] text-[clamp(1rem,1.8vw,1.125rem)] leading-[1.6] text-[var(--landing-text-secondary)]">
          Цели живут отдельно, действия отдельно, финансы и здоровье — в других сервисах, а AI
          не видит общей картины.
        </p>

        <div className="problem-cards-grid mt-12">
          {fragmentedTools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <div
                className={`problem-card ${i === 1 || i === 4 ? "md:problem-card-offset-down" : ""} ${i === 2 || i === 3 ? "md:problem-card-offset-up" : ""}`}
                key={tool.label}
              >
                <span aria-hidden className="problem-card-glow" />
                <Icon
                  aria-hidden
                  className="relative mb-4 text-[var(--landing-accent)] opacity-70"
                  size={22}
                />
                <p className="relative text-[1.0625rem] font-semibold text-[var(--landing-text)]">
                  {tool.label}
                </p>
                <p className="relative mt-2 text-[0.8125rem] leading-[1.55] text-[var(--landing-text-muted)]">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="problem-bridge mx-auto mt-16 max-w-[680px] text-center">
          <div className="problem-bridge-line mx-auto mb-6 h-px w-12 bg-gradient-to-r from-transparent via-[var(--landing-accent)]/40 to-transparent" />
          <p className="text-[clamp(1rem,1.6vw,1.0625rem)] leading-[1.6] text-[var(--landing-text-secondary)]">
            Проблема не в отсутствии инструментов.
            <br />
            Проблема в том, что они не связаны между собой.
          </p>
          <p className="mt-4 text-[clamp(0.9375rem,1.4vw,1rem)] font-medium text-[var(--landing-accent)]/80">
            Lifera собирает цели, желания, привычки и прогресс в одну систему.
          </p>
        </div>
      </div>
    </section>
  );
}
