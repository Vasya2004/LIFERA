"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import {
  createFinanceAsset as createFinanceAssetDomain,
  createFinanceDebt as createFinanceDebtDomain,
  deleteFinanceAsset as deleteFinanceAssetDomain,
  deleteFinanceDebt as deleteFinanceDebtDomain,
  updateFinanceAsset as updateFinanceAssetDomain,
  updateFinanceDebt as updateFinanceDebtDomain,
  type FinanceAssetInput,
  type FinanceDebtInput,
} from "@/lib/domain/finance";

function revalidateFinancePaths() {
  revalidatePath("/finance");
  revalidatePath("/dashboard");
}

async function requireFinanceSession() {
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function createFinanceAsset(input: FinanceAssetInput) {
  const { supabase, user } = await requireFinanceSession();
  await createFinanceAssetDomain(supabase, user.id, input);
  revalidateFinancePaths();
}

export async function updateFinanceAsset(id: string, input: FinanceAssetInput) {
  const { supabase, user } = await requireFinanceSession();
  await updateFinanceAssetDomain(supabase, user.id, id, input);
  revalidateFinancePaths();
}

export async function deleteFinanceAsset(id: string) {
  const { supabase, user } = await requireFinanceSession();
  await deleteFinanceAssetDomain(supabase, user.id, id);
  revalidateFinancePaths();
}

export async function createFinanceDebt(input: FinanceDebtInput) {
  const { supabase, user } = await requireFinanceSession();
  await createFinanceDebtDomain(supabase, user.id, input);
  revalidateFinancePaths();
}

export async function updateFinanceDebt(id: string, input: FinanceDebtInput) {
  const { supabase, user } = await requireFinanceSession();
  await updateFinanceDebtDomain(supabase, user.id, id, input);
  revalidateFinancePaths();
}

export async function deleteFinanceDebt(id: string) {
  const { supabase, user } = await requireFinanceSession();
  await deleteFinanceDebtDomain(supabase, user.id, id);
  revalidateFinancePaths();
}
