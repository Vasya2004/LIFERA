import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/doit-dates";
import DailyHabitsView from "@/components/DailyHabitsView";

export default async function DoitDailyPage() {
  const supabase = await createClient();
  const today = todayISO();

  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase
      .from("daily_habits")
      .select("*")
      .eq("is_archived", false)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("daily_habit_logs").select("*").eq("log_date", today),
  ]);

  return (
    <DailyHabitsView
      initialHabits={habits ?? []}
      initialLogs={logs ?? []}
      today={today}
    />
  );
}
