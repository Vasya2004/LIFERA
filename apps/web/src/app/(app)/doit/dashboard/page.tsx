import { createClient } from "@/lib/supabase/server";
import { daysAgoISO, todayISO, currentWeekStartISO, weeksAgoISO } from "@/lib/doit-dates";
import DashboardView from "@/components/DashboardView";
import type {
  CreatorHabit,
  CreatorHabitLog,
  DailyHabit,
  DailyHabitLog,
} from "@/lib/doit/database.types";

export default async function DoitDashboardPage() {
  const supabase = await createClient();
  const today = todayISO();
  const sevenDaysAgo = daysAgoISO(6);
  const weekStart = currentWeekStartISO();
  const eightWeeksAgo = weeksAgoISO(8);

  const { data } = await supabase
    .rpc("doit_dashboard_data", {
      p_today: today,
      p_seven_days_ago: sevenDaysAgo,
      p_week_start: weekStart,
      p_eight_weeks_ago: eightWeeksAgo,
    })
    .single<{
      daily_habits: DailyHabit[];
      daily_logs: DailyHabitLog[];
      creator_habits: CreatorHabit[];
      creator_logs: CreatorHabitLog[];
    }>();

  return (
    <DashboardView
      dailyHabits={data?.daily_habits ?? []}
      dailyLogs={data?.daily_logs ?? []}
      creatorHabits={data?.creator_habits ?? []}
      creatorLogs={data?.creator_logs ?? []}
      today={today}
      weekStart={weekStart}
    />
  );
}
