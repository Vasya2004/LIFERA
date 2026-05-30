"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const lifeAreas = [
  { label: "Карьера", value: "career" },
  { label: "Здоровье", value: "health" },
  { label: "Финансы", value: "finance" },
  { label: "Образование", value: "education" },
  { label: "Отношения", value: "relationships" },
  { label: "Творчество", value: "creativity" },
  { label: "Личные проекты", value: "projects" },
];

const challengeTemplates = [
  "7 дней системного старта",
  "30 дней профессионального роста",
  "Спринт личного проекта",
];

export function OnboardingForm() {
  const router = useRouter();
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["projects"]);
  const [challengeTitle, setChallengeTitle] = useState(challengeTemplates[0]);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const areaLabels = useMemo(
    () =>
      lifeAreas
        .filter((area) => selectedAreas.includes(area.value))
        .map((area) => area.label)
        .join(", "),
    [selectedAreas],
  );

  function toggleArea(value: string) {
    setSelectedAreas((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!confirmed) {
      setError("Подтвердите настройку системы перед завершением.");
      return;
    }

    const trimmedGoal = goalTitle.trim();
    if (!trimmedGoal) {
      setError("Укажите название первой цели.");
      return;
    }

    if (selectedAreas.length === 0) {
      setError("Выберите хотя бы одну сферу жизни.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/onboarding/complete", {
        body: JSON.stringify({
          challenge_title: challengeTitle,
          goal_description: goalDescription.trim() || null,
          goal_title: trimmedGoal,
          selected_life_areas: selectedAreas,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = await response.json().catch(() => ({ error: "Не удалось завершить onboarding." }));

      if (!response.ok) {
        setError(payload.error ?? "Не удалось завершить onboarding.");
        return;
      }

      const intendedPlan = payload.intended_plan;
      if (intendedPlan === "pro" || intendedPlan === "ultra") {
        router.push(`/plan?selected=${intendedPlan}`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Сетевая ошибка. Проверьте подключение и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      <form className="grid gap-8" onSubmit={handleSubmit}>
        <section>
          <p className="text-sm font-semibold text-foreground">1. Сферы жизни</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Выберите сферы, которые хотите прокачивать в Lifera.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lifeAreas.map((area) => {
              const active = selectedAreas.includes(area.value);

              return (
                <button
                  className={[
                    "rounded-[var(--radius-control)] border px-4 py-3 text-left text-sm font-medium transition-colors",
                    active
                      ? "border-[color:var(--border-primary-strong)] bg-primary-subtle text-foreground"
                      : "border-border bg-surface-muted text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                  key={area.value}
                  onClick={() => toggleArea(area.value)}
                  type="button"
                >
                  {area.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4">
          <p className="text-sm font-semibold text-foreground">2. Первая цель</p>
          <Input
            label="Название цели"
            name="goal_title"
            onChange={(event) => setGoalTitle(event.target.value)}
            placeholder="Например: запустить рабочую версию Lifera"
            required
            value={goalTitle}
          />
          <Input
            label="Контекст"
            name="goal_description"
            onChange={(event) => setGoalDescription(event.target.value)}
            placeholder="Почему это важно и какой результат нужен"
            value={goalDescription}
          />
        </section>

        <section>
          <p className="text-sm font-semibold text-foreground">3. Стартовый челлендж</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Челлендж превратит цель в спринт с этапами и XP.
          </p>
          <div className="mt-4 grid gap-3">
            {challengeTemplates.map((template) => (
              <button
                className={[
                  "rounded-[var(--radius-control)] border px-4 py-3 text-left text-sm font-medium transition-colors",
                  challengeTitle === template
                    ? "border-[color:var(--border-primary-strong)] bg-primary-subtle text-foreground"
                    : "border-border bg-surface-muted text-muted-foreground hover:text-foreground",
                ].join(" ")}
                key={template}
                onClick={() => setChallengeTitle(template)}
                type="button"
              >
                {template}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-border bg-surface-muted p-5">
          <p className="text-sm font-semibold text-foreground">4. Подтверждение</p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Сферы:</span> {areaLabels || "—"}
            </li>
            <li>
              <span className="font-medium text-foreground">Цель:</span>{" "}
              {goalTitle.trim() || "—"}
            </li>
            <li>
              <span className="font-medium text-foreground">Челлендж:</span> {challengeTitle}
            </li>
          </ul>
          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-foreground">
            <input
              checked={confirmed}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              onChange={(event) => setConfirmed(event.target.checked)}
              type="checkbox"
            />
            <span>
              Создать стартовую цель, челлендж с этапами и открыть Dashboard с моими данными.
            </span>
          </label>
        </section>

        {error ? (
          <p className="rounded-[var(--radius-control)] border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-foreground">
            {error}
          </p>
        ) : null}

        <Button disabled={!confirmed} loading={loading} type="submit">
          Запустить Life RPG-систему
        </Button>
      </form>
    </Card>
  );
}
