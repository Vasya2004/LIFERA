import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCustomField, createItem, deleteCustomField } from "../actions";

type CustomField = {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select" | "checkbox";
  options: string[] | null;
};

const FIELD_TYPE_LABELS: Record<CustomField["type"], string> = {
  text: "текст",
  number: "число",
  date: "дата",
  select: "выбор из списка",
  checkbox: "чекбокс",
};

function renderFieldInput(field: CustomField) {
  const name = `field_${field.id}`;
  switch (field.type) {
    case "number":
      return <input type="number" name={name} className="rounded border px-3 py-2" />;
    case "date":
      return <input type="date" name={name} className="rounded border px-3 py-2" />;
    case "checkbox":
      return <input type="checkbox" name={name} className="h-4 w-4" />;
    case "select":
      return (
        <select name={name} className="rounded border px-3 py-2">
          <option value="">—</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    default:
      return <input type="text" name={name} className="rounded border px-3 py-2" />;
  }
}

function formatFieldValue(type: CustomField["type"], value: unknown) {
  if (value === null || value === undefined) return null;
  if (type === "checkbox") return value ? "да" : "нет";
  return String(value);
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: area } = await supabase
    .from("life_areas")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!area) notFound();

  const { data: fields } = await supabase
    .from("custom_fields")
    .select("id, name, type, options")
    .eq("life_area_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const customFields = (fields ?? []) as CustomField[];

  const { data: items } = await supabase
    .from("items")
    .select("id, title, status, item_field_values(field_id, value)")
    .eq("life_area_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const createItemForArea = createItem.bind(null, id);
  const createCustomFieldForArea = createCustomField.bind(null, id);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/areas" className="text-sm underline">
        ← Все области
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">{area.name}</h1>

      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Кастомные поля</h2>

        {customFields.length > 0 && (
          <ul className="mb-4 flex flex-col gap-2">
            {customFields.map((field) => (
              <li key={field.id} className="flex items-center justify-between text-sm">
                <span>
                  {field.name}{" "}
                  <span className="text-neutral-500">({FIELD_TYPE_LABELS[field.type]})</span>
                </span>
                <form action={deleteCustomField.bind(null, id, field.id)}>
                  <button type="submit" className="text-xs text-red-600 underline">
                    Удалить
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={createCustomFieldForArea} className="flex flex-wrap gap-2">
          <input
            type="text"
            name="name"
            placeholder="Название поля"
            required
            className="rounded border px-3 py-2"
          />
          <select name="type" className="rounded border px-3 py-2">
            <option value="text">Текст</option>
            <option value="number">Число</option>
            <option value="date">Дата</option>
            <option value="select">Выбор из списка</option>
            <option value="checkbox">Чекбокс</option>
          </select>
          <input
            type="text"
            name="options"
            placeholder="Варианты через запятую (для «Выбор из списка»)"
            className="min-w-[240px] flex-1 rounded border px-3 py-2"
          />
          <button type="submit" className="rounded bg-black px-3 py-2 text-white">
            Добавить поле
          </button>
        </form>
      </section>

      <form action={createItemForArea} className="mb-8 flex flex-col gap-2 rounded border p-4">
        <input
          type="text"
          name="title"
          placeholder="Новая запись"
          required
          className="rounded border px-3 py-2"
        />
        {customFields.map((field) => (
          <label key={field.id} className="flex flex-col gap-1 text-sm">
            {field.name}
            {renderFieldInput(field)}
          </label>
        ))}
        <button type="submit" className="self-start rounded bg-black px-3 py-2 text-white">
          Добавить
        </button>
      </form>

      {!items || items.length === 0 ? (
        <p className="text-sm text-neutral-500">Записей пока нет.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="rounded border px-3 py-2">
              <div className="flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-xs text-neutral-500">{item.status}</span>
              </div>
              {customFields.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {customFields.map((field) => {
                    const fieldValue = item.item_field_values?.find(
                      (v: { field_id: string; value: unknown }) => v.field_id === field.id
                    );
                    const formatted = fieldValue ? formatFieldValue(field.type, fieldValue.value) : null;
                    if (formatted === null) return null;
                    return (
                      <span
                        key={field.id}
                        className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                      >
                        {field.name}: {formatted}
                      </span>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
