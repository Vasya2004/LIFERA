import { createClient } from "@/lib/supabase/server";
import { currentWeekStartISO } from "@/lib/doit-dates";
import CreatorHabitsView from "@/components/CreatorHabitsView";

export default async function DoitCreatorPage() {
  const supabase = await createClient();
  const weekStart = currentWeekStartISO();

  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase
      .from("creator_habits")
      .select("*")
      .eq("is_archived", false)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("creator_habit_logs")
      .select("*")
      .eq("week_start", weekStart),
  ]);

  return (
    <CreatorHabitsView
      initialHabits={habits ?? []}
      initialLogs={logs ?? []}
      weekStart={weekStart}
    />
  );
}
