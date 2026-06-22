"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

const GOAL_TEMPLATES = [
  { lifeArea: "health", title: "Улучшить физическую форму" },
  { lifeArea: "education", title: "Прокачать английский язык" },
  { lifeArea: "finance", title: "Создать финансовую подушку" },
  { lifeArea: "projects", title: "Запустить личный проект" },
  { lifeArea: "projects", title: "Навести порядок в жизни" },
] as const;


const HABIT_TEMPLATES = [
  "15 минут английского",
  "20 минут тренировки",
  "Планирование дня",
  "Выпивать 2 л воды",
  "Чтение 10 страниц",
  "Медитация 5 минут",
] as const;

const BODY_ZONES = [
  { label: "Шея", value: "neck" },
  { label: "Спина", value: "back" },
  { label: "Плечи", value: "shoulders" },
  { label: "Руки", value: "arms" },
  { label: "Колени", value: "knees" },
  { label: "Стопы", value: "feet" },
  { label: "Голова", value: "head" },
  { label: "Поясница", value: "lower_back" },
] as const;

const DISCOMFORT_LEVELS = [
  { label: "Лёгкий", value: "light" },
  { label: "Средний", value: "medium" },
  { label: "Сильный", value: "strong" },
] as const;

const ACHIEVEMENT_TEMPLATES = [
  "Сформулировал первую цель",
  "Начал работать над собой",
  "Прошёл настройку Lifera",
  "Вернулся к тренировкам",
  "Начал вести привычки",
] as const;

type WizardPhase = "form" | "creating" | "success";

export function OnboardingWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<WizardPhase>("form");
  const [error, setError] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalLifeArea, setGoalLifeArea] = useState("health");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const goalDescription = "";
  const [habitTitle, setHabitTitle] = useState("");
  const habitFrequency = "daily";
  const [habitXpReward, setHabitXpReward] = useState(10);
  const [healthZone, setHealthZone] = useState("");
  const [healthDiscomfortLevel, setHealthDiscomfortLevel] = useState("medium");
  const [healthComment, setHealthComment] = useState("");
  const [achievementTitle, setAchievementTitle] = useState("Сформулировал первую цель");
  const [achievementDescription, setAchievementDescription] = useState(
    "Создал первую систему развития в Lifera.",
  );
  const [achievementCategory, setAchievementCategory] = useState("Личное");

  function selectGoalTemplate(template: (typeof GOAL_TEMPLATES)[number]) {
    setGoalTitle(template.title);
    setGoalLifeArea(template.lifeArea);
  }

  function validateStep(currentStep: number) {
    if (currentStep === 2 && goalTitle.trim().length < 3) {
      setError("Название цели должно быть не короче 3 символов.");
      return false;
    }

    if (currentStep === 3) {
      if (habitTitle.trim().length < 3) {
        setError("Название привычки должно быть не короче 3 символов.");
        return false;
      }

      if (habitXpReward < 5 || habitXpReward > 50) {
        setError("XP за выполнение должен быть от 5 до 50.");
        return false;
      }
    }

    if (currentStep === 4 && (!healthZone || !healthDiscomfortLevel)) {
      setError("Выберите зону тела и уровень дискомфорта.");
      return false;
    }

    if (currentStep === 5 && achievementTitle.trim().length < 3) {
      setError("Название достижения должно быть не короче 3 символов.");
      return false;
    }

    setError(null);
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, 5));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit() {
    if (phase !== "form" || !validateStep(5)) {
      return;
    }

    setPhase("creating");
    setError(null);

    try {
      const response = await fetch("/api/onboarding/complete", {
        body: JSON.stringify({
          achievement_category: achievementCategory,
          achievement_description: achievementDescription,
          achievement_title: achievementTitle,
          goal_description: goalDescription,
          goal_life_area: goalLifeArea,
          goal_target_date: goalTargetDate || null,
          goal_title: goalTitle,
          habit_frequency: habitFrequency,
          habit_title: habitTitle,
          habit_xp_reward: habitXpReward,
          health_comment: healthComment,
          health_discomfort_level: healthDiscomfortLevel,
          health_zone: healthZone,
          selected_life_areas: [goalLifeArea],
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = await response.json().catch(() => ({
        error: "Не удалось завершить настройку.",
      }));

      if (!response.ok) {
        setPhase("form");
        handleMutationError(toast, payload, "Не удалось завершить настройку.");
        setError(payload.error ?? "Не удалось завершить настройку.");
        return;
      }

      showMutationSuccess(
        toast,
        "Настройка завершена",
        payload?.xpAwarded ? `+${payload.xpAwarded} опыта` : "Dashboard готов",
        "progress",
      );
      setPhase("success");

      window.setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch {
      setPhase("form");
      setError("Сетевая ошибка. Проверьте подключение и попробуйте снова.");
      toast({
        description: "Проверьте подключение и попробуйте ещё раз.",
        title: "Не удалось завершить настройку",
        variant: "error",
      });
    }
  }

  return (
    <OnboardingShell currentStep={step}>
      {phase === "creating" ? (
        <div className="onboarding-success">
          <p className="onboarding-success-title">Создаём стартовые данные…</p>
          <p className="onboarding-success-subtitle">
            Цель, привычка, здоровье и достижение сохраняются в Lifera.
          </p>
        </div>
      ) : null}

      {phase === "success" ? (
        <div className="onboarding-success">
          <p className="onboarding-success-title">Система создана</p>
          <p className="onboarding-success-subtitle">Переходим на dashboard</p>
        </div>
      ) : null}

      {phase === "form" ? (
        <>
          {step === 1 ? (
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                1 из 5
              </p>
              <h2 className="onboarding-step-title mt-3">Соберите первую систему развития</h2>
              <p className="onboarding-step-subtitle">
                Lifera создаст реальные стартовые записи, чтобы dashboard не был пустым
                после первого входа.
              </p>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  2 из 5
                </p>
                <h2 className="onboarding-step-title mt-3">Создайте первую цель</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Название цели"
                  minLength={3}
                  onChange={(event) => setGoalTitle(event.target.value)}
                  placeholder="Например: улучшить физическую форму"
                  required
                  value={goalTitle}
                />
                <Input
                  label="Срок (необязательно)"
                  onChange={(event) => setGoalTargetDate(event.target.value)}
                  type="date"
                  value={goalTargetDate}
                />
              </div>
              <TemplateGrid>
                {GOAL_TEMPLATES.slice(0, 4).map((template) => (
                  <TemplateButton
                    active={goalTitle === template.title}
                    key={template.title}
                    onClick={() => selectGoalTemplate(template)}
                  >
                    {template.title}
                  </TemplateButton>
                ))}
              </TemplateGrid>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  3 из 5
                </p>
                <h2 className="onboarding-step-title mt-3">Добавьте привычку</h2>
              </div>
              <Input
                label="Название привычки"
                minLength={3}
                onChange={(event) => setHabitTitle(event.target.value)}
                placeholder="Например: 20 минут тренировки"
                required
                value={habitTitle}
              />
              <div>
                <p className="mb-2 text-sm font-medium text-white">XP за выполнение</p>
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 40, 50].map((xp) => (
                    <button
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        habitXpReward === xp
                          ? "border-primary/60 bg-primary/15 text-orange-100"
                          : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80",
                      ].join(" ")}
                      key={xp}
                      onClick={() => setHabitXpReward(xp)}
                      type="button"
                    >
                      {xp} XP
                    </button>
                  ))}
                </div>
              </div>
              <TemplateGrid>
                {HABIT_TEMPLATES.map((template) => (
                  <TemplateButton
                    active={habitTitle === template}
                    key={template}
                    onClick={() => setHabitTitle(template)}
                  >
                    {template}
                  </TemplateButton>
                ))}
              </TemplateGrid>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  4 из 5
                </p>
                <h2 className="onboarding-step-title mt-3">Отметьте проблемную зону</h2>
                <p className="onboarding-step-subtitle">
                  Это поможет Lifera учитывать ваше самочувствие. Сервис не ставит диагнозы,
                  а только помогает фиксировать состояние.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BODY_ZONES.map((zone) => (
                  <button
                    className={[
                      "rounded-xl border px-3 py-3 text-sm font-semibold transition",
                      healthZone === zone.value
                        ? "border-rose-400 bg-rose-500/15 text-rose-100 shadow-[0_0_0_1px_rgb(251_113_133/0.22)]"
                        : "border-white/10 bg-white/[0.04] text-white/70 hover:border-rose-400/50 hover:bg-rose-500/10",
                    ].join(" ")}
                    key={zone.value}
                    onClick={() => setHealthZone(zone.value)}
                    type="button"
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-white">Уровень дискомфорта</p>
                <div className="grid grid-cols-3 gap-2">
                  {DISCOMFORT_LEVELS.map((level) => (
                    <button
                      className={[
                        "h-10 rounded-xl border text-sm font-semibold transition",
                        healthDiscomfortLevel === level.value
                          ? "border-rose-400 bg-rose-500/15 text-rose-100"
                          : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/[0.07]",
                      ].join(" ")}
                      key={level.value}
                      onClick={() => setHealthDiscomfortLevel(level.value)}
                      type="button"
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                label="Комментарий"
                onChange={(event) => setHealthComment(event.target.value)}
                placeholder="Например: тянет после долгой работы за ноутбуком"
                value={healthComment}
              />
            </section>
          ) : null}

          {step === 5 ? (
            <section className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  5 из 5
                </p>
                <h2 className="onboarding-step-title mt-3">
                  Зафиксируйте первое достижение
                </h2>
                <p className="onboarding-step-subtitle">
                  Добавьте точку старта — то, что уже можно считать первым шагом.
                </p>
              </div>
              <Input
                label="Название достижения"
                minLength={3}
                onChange={(event) => setAchievementTitle(event.target.value)}
                required
                value={achievementTitle}
              />
              <Textarea
                label="Описание"
                onChange={(event) => setAchievementDescription(event.target.value)}
                value={achievementDescription}
              />
              <Input
                label="Категория"
                onChange={(event) => setAchievementCategory(event.target.value)}
                value={achievementCategory}
              />
              <TemplateGrid>
                {ACHIEVEMENT_TEMPLATES.map((template) => (
                  <TemplateButton
                    active={achievementTitle === template}
                    key={template}
                    onClick={() => setAchievementTitle(template)}
                  >
                    {template}
                  </TemplateButton>
                ))}
              </TemplateGrid>
            </section>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
              {error}
            </p>
          ) : null}

          <div className="onboarding-actions-sticky">
            <div className="onboarding-actions">
              {step > 1 ? (
                <Button onClick={goBack} type="button" variant="secondary">
                  Назад
                </Button>
              ) : null}

              {step < 5 ? (
                <Button data-testid="onboarding-continue" onClick={goNext} type="button">
                  {step === 1 ? "Начать настройку" : "Продолжить"}
                </Button>
              ) : (
                <Button data-testid="onboarding-submit" onClick={handleSubmit} type="button">
                  Завершить настройку
                </Button>
              )}
            </div>
          </div>
        </>
      ) : null}
    </OnboardingShell>
  );
}

function TemplateGrid({ children }: { children: ReactNode }) {
  return <div className="mt-1 flex flex-wrap gap-2">{children}</div>;
}

function TemplateButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-primary/60 bg-primary/15 text-orange-100"
          : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/80",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
