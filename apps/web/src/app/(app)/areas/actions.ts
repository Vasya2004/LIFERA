"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLifeArea(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("life_areas").insert({ name, user_id: user.id });
  revalidatePath("/areas");
}

export async function createItem(lifeAreaId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const supabase = await createClient();
  const { data: item } = await supabase
    .from("items")
    .insert({ title, life_area_id: lifeAreaId })
    .select("id")
    .single();

  if (item) {
    // значения кастомных полей приходят из формы с именами вида field_<id>
    const { data: fields } = await supabase
      .from("custom_fields")
      .select("id, type")
      .eq("life_area_id", lifeAreaId);

    const values: { item_id: string; field_id: string; value: string | number | boolean }[] = [];

    for (const field of fields ?? []) {
      const raw = formData.get(`field_${field.id}`);
      if (raw === null) continue;

      if (field.type === "checkbox") {
        values.push({ item_id: item.id, field_id: field.id, value: raw === "on" });
        continue;
      }

      const str = String(raw).trim();
      if (!str) continue;

      values.push({
        item_id: item.id,
        field_id: field.id,
        value: field.type === "number" ? Number(str) : str,
      });
    }

    if (values.length > 0) {
      await supabase.from("item_field_values").insert(values);
    }
  }

  revalidatePath(`/areas/${lifeAreaId}`);
}

export async function createCustomField(lifeAreaId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "text");
  if (!name) return;

  const rawOptions = String(formData.get("options") ?? "").trim();
  const options =
    type === "select" && rawOptions
      ? rawOptions.split(",").map((option) => option.trim()).filter(Boolean)
      : null;

  const supabase = await createClient();
  await supabase.from("custom_fields").insert({ life_area_id: lifeAreaId, name, type, options });
  revalidatePath(`/areas/${lifeAreaId}`);
}

export async function deleteCustomField(lifeAreaId: string, fieldId: string) {
  const supabase = await createClient();
  await supabase.from("custom_fields").delete().eq("id", fieldId);
  revalidatePath(`/areas/${lifeAreaId}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
