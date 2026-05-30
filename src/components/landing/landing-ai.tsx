import { Brain } from "lucide-react";

const aiCards = [
  "Анализ цели и прогресса по сферам",
  "Рекомендация челленджа под стратегию",
  "Выявление просадки в динамике",
  "Один конкретный следующий шаг",
];

export function LandingAi() {
  return (
    <section className="landing-section relative">
      <div className="landing-container">
        <div className="landing-card relative overflow-hidden rounded-[28px] p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[var(--landing-ai-accent)] blur-3xl opacity-40"
          />
          <div
            aria-hidden
            className="landing-glow-orb pointer-events-none absolute -left-12 bottom-0 h-40 w-40 opacity-70"
          />
          <h2 className="relative text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--landing-text)]">
            AI помогает выбрать следующий шаг
          </h2>
          <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
            {aiCards.map((item) => (
              <div
                className="rounded-[20px] border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)]/60 p-4"
                key={item}
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--landing-ai-accent)] bg-[rgb(139_92_246/0.1)]">
                  <Brain className="text-violet-300" size={16} />
                </span>
                <p className="text-sm leading-[1.5] text-[var(--landing-text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
