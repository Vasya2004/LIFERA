import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/doit-dates";
import DailyHabitsView from "@/components/DailyHabitsView";
import type { DailyHabit, DailyHabitLog } from "@/lib/doit/database.types";

export default async function DoitDailyPage() {
  const supabase = await createClient();
  const today = todayISO();

  const { data } = await supabase
    .rpc("doit_daily_page_data", { p_log_date: today })
    .single<{ habits: DailyHabit[]; logs: DailyHabitLog[] }>();

  return (
    <DailyHabitsView
      initialHabits={data?.habits ?? []}
      initialLogs={data?.logs ?? []}
      today={today}
    />
  );
}
