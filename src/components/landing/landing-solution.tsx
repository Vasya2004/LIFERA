const ecosystemNodes = [
  "Цели",
  "Челленджи",
  "Привычки",
  "Навыки",
  "Финансы",
  "Здоровье",
  "Достижения",
  "AI Ассистент",
];

export function LandingSolution() {
  return (
    <section className="landing-section relative" id="how-it-works">
      <div aria-hidden className="landing-section-glow" />
      <div className="landing-container text-center">
        <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--landing-text)]">
          Lifera собирает прогресс в единую систему
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-[1.5] text-[var(--landing-text-secondary)]">
          Вы в центре — вокруг сферы, миссии, ритуалы, аналитика и AI.
        </p>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            aria-hidden
            className="landing-glow-orb absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2"
          />
          <div className="landing-glass relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[rgb(255_106_42/0.28)] text-sm font-semibold text-[var(--landing-text)]">
            Life System
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ecosystemNodes.map((node) => (
              <div
                className="landing-card rounded-xl px-3 py-3 text-xs font-semibold text-[var(--landing-text-secondary)] sm:text-sm"
                key={node}
              >
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
