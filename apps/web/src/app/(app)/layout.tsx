import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: lifeAreas } = await supabase
    .from("life_areas")
    .select("id, name")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="flex h-screen gap-1.5 overflow-hidden bg-neutral-100 p-1.5 dark:bg-black">
      <Sidebar lifeAreas={lifeAreas ?? []} />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden rounded-2xl bg-white">{children}</main>
    </div>
  );
}
