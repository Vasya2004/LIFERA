"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";
import type { Goal, Wish } from "@/lib/domain/types";
import { handleMutationError, showMutationSuccess } from "@/lib/ui/feedback";

type GoalEditFormProps = {
  goal: Pick<
    Goal,
    "description" | "id" | "life_area" | "status" | "target_date" | "title"
  >;
  isPrimary?: boolean;
  linkedWishId?: string | null;
  onCancel?: () => void;
  onSaved?: () => void;
  showHeading?: boolean;
  wishes?: Wish[];
};

export function GoalEditForm({
  goal,
  isPrimary = false,
  linkedWishId = null,
  onCancel,
  onSaved,
  showHeading = false,
  wishes = [],
}: GoalEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/goals/${goal.id}`, {
      body: JSON.stringify({
        description: String(formData.get("description") ?? "").trim() || null,
        life_area: formData.get("life_area"),
        is_primary: formData.get("is_primary") === "on",
        linked_wish_id: String(formData.get("linked_wish_id") ?? "") || null,
        status: formData.get("status"),
        target_date: String(formData.get("target_date") ?? "") || null,
        title: String(formData.get("title") ?? "").trim(),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось сохранить цель.");
      setError(payload?.error ?? "Не удалось сохранить цель.");
      return;
    }

    showMutationSuccess(toast, "Изменения сохранены");
    router.refresh();
    onSaved?.();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {showHeading ? (
        <p className="text-sm font-semibold text-foreground">Редактирование</p>
      ) : null}
      <Input
        defaultValue={goal.title}
        label="Название"
        minLength={2}
        name="title"
        placeholder="Например: Улучшить физическую форму"
        required
      />
      <Textarea
        defaultValue={goal.description ?? ""}
        label="Описание"
        name="description"
        placeholder="Что должно измениться и зачем эта цель важна?"
      />
      <Select defaultValue={goal.life_area} label="Сфера жизни" name="life_area">
        <option value="projects">Личные проекты</option>
        <option value="career">Карьера</option>
        <option value="education">Образование</option>
        <option value="health">Здоровье</option>
        <option value="finance">Финансы</option>
        <option value="creativity">Творчество</option>
        <option value="relationships">Отношения</option>
      </Select>
      <Input
        defaultValue={goal.target_date ?? ""}
        label="Целевая дата"
        name="target_date"
        type="date"
      />
      <Select defaultValue={goal.status} label="Статус" name="status">
        <option value="active">Активная</option>
        <option value="backlog">В планах</option>
        <option value="completed">Завершена</option>
        <option value="archived">В архиве</option>
      </Select>
      {wishes.length > 0 ? (
        <Select defaultValue={linkedWishId ?? ""} label="Связанное желание" name="linked_wish_id">
          <option value="">Без желания</option>
          {wishes
            .filter((wish) => wish.status !== "archived")
            .map((wish) => (
              <option key={wish.id} value={wish.id}>
                {wish.title}
              </option>
            ))}
        </Select>
      ) : null}
      <label className="flex items-start gap-3 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3 text-sm text-foreground">
        <input
          className="mt-1 accent-[var(--primary)]"
          defaultChecked={isPrimary}
          name="is_primary"
          type="checkbox"
        />
        <span>
          <span className="block font-medium">Главная цель</span>
          <span className="mt-1 block text-muted-foreground">
            Только одна цель может быть главной. При сохранении фокус переключится на неё.
          </span>
        </span>
      </label>
      {error ? <p className="text-sm text-danger-foreground">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button loading={loading} loadingLabel="Сохраняем..." type="submit">
          Сохранить
        </Button>
        {onCancel ? (
          <Button onClick={onCancel} type="button" variant="secondary">
            Отмена
          </Button>
        ) : null}
      </div>
    </form>
  );
}
