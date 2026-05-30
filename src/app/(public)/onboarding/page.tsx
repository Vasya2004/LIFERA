import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <section className="mx-auto max-w-4xl py-4">
      <p className="text-sm font-medium text-primary">Шаг 2 · Life RPG setup</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Соберём стартовую систему
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Сферы жизни, первая цель и челлендж с этапами. После подтверждения вы попадёте на
        Dashboard с реальными данными — без дублей при повторной отправке.
      </p>
      <OnboardingForm />
    </section>
  );
}

