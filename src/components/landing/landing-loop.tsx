const loopSteps = [
  "Цель",
  "Челлендж / Привычка",
  "Прогресс",
  "XP",
  "Уровень",
  "Достижение",
  "AI-рекомендация",
];

export function LandingLoop() {
  return (
    <section className="landing-section relative">
      <div className="landing-container">
        <h2 className="text-center text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-[var(--landing-text)]">
          Один цикл, который двигает тебя вперёд
        </h2>

        {/* Desktop: horizontal pipeline */}
        <div className="relative mt-12 hidden lg:block">
          <ol className="relative grid grid-cols-7 gap-3">
            {loopSteps.map((step) => (
              <li className="landing-card rounded-2xl px-3 py-5 text-center" key={step}>
                <p className="text-xs font-semibold leading-5 text-[var(--landing-text)] sm:text-sm">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile/tablet: vertical timeline */}
        <div className="relative mt-10 lg:hidden">
          <div aria-hidden className="landing-loop-timeline" />
          <ol className="flex flex-col gap-4 pl-10">
            {loopSteps.map((step) => (
              <li className="landing-card rounded-2xl px-4 py-4" key={step}>
                <p className="text-sm font-semibold text-[var(--landing-text)]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
