import { Lightbulb } from "lucide-react";

import type { HealthSnapshot } from "@/lib/domain/health";

type HealthInsightProps = {
  history: HealthSnapshot[];
  latest: HealthSnapshot | null;
};

function buildInsightText(latest: HealthSnapshot | null, history: HealthSnapshot[]): string {
  if (!latest) {
    return "Записей пока нет. Добавьте несколько check-in, чтобы Lifera могла показать динамику самочувствия.";
  }

  const last3 = history.slice(0, 3);
  const avgSleep = last3.reduce((s, e) => s + e.sleep_hours, 0) / last3.length;
  const avgEnergy = last3.reduce((s, e) => s + e.energy_level, 0) / last3.length;

  if (avgSleep < 6) {
    return "Сон просел несколько дней подряд. Попробуйте лечь раньше или снизить нагрузку вечером.";
  }
  if (avgEnergy > 8) {
    return "Отличный уровень энергии! Поддерживайте текущий ритм и связывайте его с целями.";
  }
  if (latest.energy_level <= 4) {
    return "Энергия ниже обычного. Простая привычка восстановления — прогулка, сон или короткая разминка — поможет выровнять ритм.";
  }
  return "Самочувствие стабильное. Продолжайте текущий ритм.";
}

export function HealthInsight({ history, latest }: HealthInsightProps) {
  const text = buildInsightText(latest, history);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-orange-50 dark:bg-orange-500/10">
          <Lightbulb className="text-orange-500 dark:text-orange-400" size={15} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Вывод Lifera</h3>
          <p className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400">{text}</p>
        </div>
      </div>
    </div>
  );
}
