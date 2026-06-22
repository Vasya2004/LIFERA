import type { SupabaseClient } from "@supabase/supabase-js";

import type { Wish } from "@/lib/domain/types";

export type WishInput = {
  category?: string | null;
  current_amount?: number | null;
  description?: string | null;
  image_url?: string | null;
  is_primary?: boolean;
  linked_goal_id?: string | null;
  status?: string;
  target_amount?: number | null;
  title?: string;
};

function normalizeAmount(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeWishInput(input: WishInput) {
  return {
    category: input.category ? String(input.category).trim() || null : null,
    current_amount: normalizeAmount(input.current_amount),
    description: input.description ? String(input.description).trim() || null : null,
    image_url: input.image_url ? String(input.image_url).trim() || null : null,
    is_primary: Boolean(input.is_primary),
    linked_goal_id: input.linked_goal_id ? String(input.linked_goal_id) : null,
    status: ["wanted", "acquired", "archived"].includes(String(input.status))
      ? String(input.status)
      : "wanted",
    target_amount: normalizeAmount(input.target_amount),
    title: input.title ? String(input.title).trim() : "",
  };
}

export async function listWishes(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Wish[];
}

export async function createWish(
  supabase: SupabaseClient,
  userId: string,
  input: WishInput,
) {
  const normalized = normalizeWishInput(input);

  if (!normalized.title) {
    throw new Error("Название желания обязательно.");
  }

  if (normalized.linked_goal_id) {
    const { data: goal } = await supabase
      .from("goals")
      .select("id")
      .eq("id", normalized.linked_goal_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!goal) {
      throw new Error("Связанная цель не найдена.");
    }
  }

  if (normalized.is_primary) {
    await clearPrimaryWish(supabase, userId);
  }

  const { data, error } = await supabase
    .from("wishes")
    .insert({
      ...normalized,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Wish;
}

export async function updateWish(
  supabase: SupabaseClient,
  userId: string,
  wishId: string,
  input: WishInput,
) {
  const normalized = normalizeWishInput(input);

  if (!normalized.title) {
    throw new Error("Название желания обязательно.");
  }

  if (normalized.linked_goal_id) {
    const { data: goal } = await supabase
      .from("goals")
      .select("id")
      .eq("id", normalized.linked_goal_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!goal) {
      throw new Error("Связанная цель не найдена.");
    }
  }

  if (normalized.is_primary) {
    await clearPrimaryWish(supabase, userId);
  }

  const { data, error } = await supabase
    .from("wishes")
    .update(normalized)
    .eq("id", wishId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Wish;
}

export async function archiveWish(supabase: SupabaseClient, userId: string, wishId: string) {
  const { data, error } = await supabase
    .from("wishes")
    .update({ is_primary: false, status: "archived" })
    .eq("id", wishId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Wish;
}

export async function setPrimaryWish(supabase: SupabaseClient, userId: string, wishId: string) {
  await clearPrimaryWish(supabase, userId);

  const { data, error } = await supabase
    .from("wishes")
    .update({ is_primary: true })
    .eq("id", wishId)
    .eq("user_id", userId)
    .neq("status", "archived")
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Wish;
}

async function clearPrimaryWish(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase
    .from("wishes")
    .update({ is_primary: false })
    .eq("user_id", userId)
    .eq("is_primary", true);

  if (error) {
    throw new Error(error.message);
  }
}
