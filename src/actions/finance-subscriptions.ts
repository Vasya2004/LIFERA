"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";

export type FinanceSubscriptionInput = {
  title: string;
  amount: number;
  category: string;
  billing_day: number;
  period: string;
  status: string;
};

export async function createFinanceSubscription(input: FinanceSubscriptionInput) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from("finance_subscriptions").insert({
    user_id: user.id,
    ...input,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard");
}

export async function updateFinanceSubscription(id: string, input: FinanceSubscriptionInput) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("finance_subscriptions")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard");
}

export async function deleteFinanceSubscription(id: string) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("finance_subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard");
}
