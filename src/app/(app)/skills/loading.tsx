import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsLoading() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <Card><Skeleton className="h-24 w-full" /></Card>
        <Card><Skeleton className="h-24 w-full" /></Card>
        <Card><Skeleton className="h-24 w-full" /></Card>
      </div>
      <Card><Skeleton className="h-40 w-full" /></Card>
    </section>
  );
}
