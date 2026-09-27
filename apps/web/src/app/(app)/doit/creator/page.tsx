import { createClient } from "@/lib/supabase/server";
import { currentWeekStartISO } from "@/lib/doit-dates";
import CreatorHabitsView from "@/components/CreatorHabitsView";
import type { CreatorHabit, CreatorHabitLog } from "@/lib/doit/database.types";

export default async function DoitCreatorPage() {
  const supabase = await createClient();
  const weekStart = currentWeekStartISO();

  const { data } = await supabase
    .rpc("doit_creator_page_data", { p_week_start: weekStart })
    .single<{ habits: CreatorHabit[]; logs: CreatorHabitLog[] }>();

  return (
    <CreatorHabitsView
      initialHabits={data?.habits ?? []}
      initialLogs={data?.logs ?? []}
      weekStart={weekStart}
    />
  );
}
