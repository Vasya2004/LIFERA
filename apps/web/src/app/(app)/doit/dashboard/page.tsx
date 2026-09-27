import { createClient } from "@/lib/supabase/server";
import { daysAgoISO, todayISO, currentWeekStartISO, weeksAgoISO } from "@/lib/doit-dates";
import DashboardView from "@/components/DashboardView";

export default async function DoitDashboardPage() {
  const supabase = await createClient();
  const today = todayISO();
  const sevenDaysAgo = daysAgoISO(6);
  const weekStart = currentWeekStartISO();
  const eightWeeksAgo = weeksAgoISO(8);

  const [
    { data: dailyHabits },
    { data: dailyLogs },
    { data: creatorHabits },
    { data: creatorLogs },
  ] = await Promise.all([
    supabase
      .from("daily_habits")
      .select("*")
      .eq("is_archived", false)
      .order("sort_order", { ascending: true }),
    supabase
      .from("daily_habit_logs")
      .select("*")
      .gte("log_date", sevenDaysAgo)
      .lte("log_date", today),
    supabase
      .from("creator_habits")
      .select("*")
      .eq("is_archived", false)
      .order("sort_order", { ascending: true }),
    supabase
      .from("creator_habit_logs")
      .select("*")
      .gte("week_start", eightWeeksAgo),
  ]);

  return (
    <DashboardView
      dailyHabits={dailyHabits ?? []}
      dailyLogs={dailyLogs ?? []}
      creatorHabits={creatorHabits ?? []}
      creatorLogs={creatorLogs ?? []}
      today={today}
      weekStart={weekStart}
    />
  );
}
