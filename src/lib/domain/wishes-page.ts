import type { SupabaseClient } from "@supabase/supabase-js";

import type { Goal, Wish } from "@/lib/domain/types";

export type WishGoalOption = Pick<Goal, "id" | "title">;

export type WishesPageData = {
  acquiredCount: number;
  goals: WishGoalOption[];
  primaryWish: Wish | null;
  wantedTotalAmount: number;
  wishes: Wish[];
};

export async function getWishesPageData(
  supabase: SupabaseClient,
  userId: string,
): Promise<WishesPageData> {
  const [{ data: wishes, error: wishesError }, { data: goals, error: goalsError }] =
    await Promise.all([
      supabase
        .from("wishes")
        .select("*")
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("goals")
        .select("id,title")
        .eq("user_id", userId)
        .neq("status", "archived")
        .order("created_at", { ascending: false }),
    ]);

  if (wishesError) {
    throw new Error(wishesError.message);
  }

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  const wishesList = (wishes ?? []) as Wish[];
  const activeWishes = wishesList.filter((wish) => wish.status !== "archived");
  const wantedWishes = activeWishes.filter((wish) => wish.status === "wanted");

  return {
    acquiredCount: activeWishes.filter((wish) => wish.status === "acquired").length,
    goals: (goals ?? []) as WishGoalOption[],
    primaryWish: activeWishes.find((wish) => wish.is_primary) ?? null,
    wantedTotalAmount: wantedWishes.reduce(
      (sum, wish) => sum + Number(wish.target_amount ?? 0),
      0,
    ),
    wishes: wishesList,
  };
}
