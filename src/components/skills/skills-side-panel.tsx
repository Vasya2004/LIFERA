"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Code2, Crosshair, Target } from "lucide-react";

import { SkillCreateModal } from "@/components/skills/skill-create-modal";
import { useToast } from "@/components/ui/toast-provider";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

const templates = [
  { category: "language", icon: <BookOpen size={16} />, title: "Английский" },
  { category: "tech", icon: <Code2 size={16} />, title: "Программирование" },
  { category: "general", icon: <Target size={16} />, title: "Дисциплина" },
  { category: "general", icon: <Crosshair size={16} />, title: "Фокус" },
];

export function SkillsSidePanel() {
  const router = useRouter();
  const { toast } = useToast();
  const [creating, setCreating] = useState<string | null>(null);

  async function createTemplate(template: (typeof templates)[number]) {
    if (creating) return;

    setCreating(template.title);
    const response = await fetch("/api/skills", {
      body: JSON.stringify({ category: template.category, title: template.title }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const payload = await response.json().catch(() => ({ error: "Не удалось создать навык." }));
    setCreating(null);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось создать навык.");
      return;
    }

    showMutationSuccess(toast, "Навык добавлен");
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:sticky lg:top-[calc(var(--topbar-height)+1rem)]">
      <aside
        className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70"
        id="create-skill"
      >
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Новый навык</h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Зафиксируйте компетенцию для регулярной практики.
        </p>
        <SkillCreateModal className="mt-4 w-full" label="Новый навык" />
      </aside>

      <aside className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
        <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Быстрые шаблоны</h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Создать навык с готовым названием и категорией.
        </p>
        <div className="mt-4 grid gap-2">
          {templates.map((template) => (
            <button
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-left text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-white/5 dark:bg-zinc-800/50 dark:text-zinc-50 dark:hover:bg-zinc-700/50"
              disabled={creating !== null}
              key={template.title}
              onClick={() => createTemplate(template)}
              type="button"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300">
                {template.icon}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {creating === template.title ? "Добавляем..." : template.title}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
