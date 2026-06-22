"use client";

import { ONBOARDING_STEPS } from "@/components/onboarding/onboarding-data";

type OnboardingStepperProps = {
  currentStep: number;
};

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/45 sm:hidden">
          Шаг {currentStep} из {ONBOARDING_STEPS.length}
        </p>
        <p className="hidden text-xs font-medium uppercase tracking-[0.12em] text-white/45 sm:block">
          Настройка системы прогресса
        </p>
        <p className="text-xs font-medium text-white/55">{Math.round(progress)}%</p>
      </div>

      <div
        aria-hidden
        className="mt-3 h-1 overflow-hidden rounded-full bg-white/8"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-4 hidden gap-2 sm:grid sm:grid-cols-5">
        {ONBOARDING_STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <li
              className={[
                "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors",
                active
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : completed
                    ? "border-white/10 bg-white/5 text-white/70"
                    : "border-white/6 bg-transparent text-white/35",
              ].join(" ")}
              key={label}
            >
              <span className="block text-[0.6875rem] uppercase tracking-wide text-white/40">
                {completed ? "✓" : stepNumber}
              </span>
              <span className="mt-1 block leading-tight">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
