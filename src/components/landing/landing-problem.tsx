import { Brain, Heart, Repeat, Sparkles, Target, Wallet } from "lucide-react";

const fragmentedTools = [
  { icon: Target, label: "Цели отдельно" },
  { icon: Repeat, label: "Привычки отдельно" },
  { icon: Wallet, label: "Финансы отдельно" },
  { icon: Heart, label: "Здоровье отдельно" },
  { icon: Sparkles, label: "Навыки отдельно" },
  { icon: Brain, label: "AI отдельно" },
];

export function LandingProblem() {
  return (
    <section className="landing-section relative">
      <div className="landing-container">
        <h2 className="max-w-3xl text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--landing-text)]">
          Развитие распадается на десятки инструментов
        </h2>
        <p className="mt-4 max-w-2xl leading-[1.5] text-[var(--landing-text-secondary)]">
          Цели живут отдельно, привычки отдельно, финансы и здоровье — в других сервисах, а AI
          не видит общей картины.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fragmentedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div className="landing-card rounded-[24px] p-5" key={tool.label}>
                <span aria-hidden className="landing-card-glow" />
                <Icon className="relative text-[var(--landing-text-muted)]" size={20} />
                <p className="relative mt-4 text-sm font-medium text-[var(--landing-text-secondary)]">
                  {tool.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
