import { Award, Brain, Repeat, Target, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Цели",
    text: "Стратегические квесты, которые задают направление.",
  },
  {
    icon: Trophy,
    title: "Челленджи",
    text: "Миссии и спринты, которые превращают цель в маршрут.",
  },
  {
    icon: Repeat,
    title: "Привычки",
    text: "Регулярные ритуалы прокачки сфер жизни.",
  },
  {
    icon: Zap,
    title: "Прогресс",
    text: "Аналитика движения, XP и Life Score.",
  },
  {
    icon: Award,
    title: "Достижения",
    text: "Milestones за реальные продвижения.",
  },
  {
    icon: Brain,
    title: "AI Ассистент",
    text: "Следующий шаг на основе твоих данных.",
  },
];

export function LandingFeatures() {
  return (
    <section className="landing-section relative" id="features">
      <div className="landing-container">
        <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--landing-text)]">
          Модули вашей Life RPG-системы
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div className="landing-card rounded-[24px] p-6" key={feature.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(255_106_42/0.25)] bg-[rgb(255_90_31/0.08)]">
                  <Icon className="text-[var(--landing-accent)]" size={20} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[var(--landing-text)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.5] text-[var(--landing-text-secondary)]">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
