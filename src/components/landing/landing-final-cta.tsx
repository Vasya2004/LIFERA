import { PrimaryButton, SecondaryButton } from "@/components/landing/landing-buttons";

export function LandingFinalCta() {
  return (
    <section className="landing-section relative pb-8 sm:pb-12">
      <div className="landing-container">
        <div className="landing-card relative overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="landing-glow-orb pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2"
          />
          <h2 className="relative text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-[var(--landing-text)]">
            Собери свою систему прогресса
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl leading-[1.5] text-[var(--landing-text-secondary)]">
            Начни с одной цели, запусти первую привычку и преврати развитие в понятный маршрут.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryButton href="/register">
              Начать бесплатно
            </PrimaryButton>
            <SecondaryButton href="/login">Войти</SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
