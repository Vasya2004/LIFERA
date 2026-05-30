import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HealthLoading() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <Skeleton className="h-10 w-48" />
      <Card><Skeleton className="h-16 w-full" /></Card>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card><Skeleton className="h-24 w-full" /></Card>
        <Card><Skeleton className="h-24 w-full" /></Card>
        <Card><Skeleton className="h-24 w-full" /></Card>
        <Card><Skeleton className="h-24 w-full" /></Card>
      </div>
    </section>
  );
}
