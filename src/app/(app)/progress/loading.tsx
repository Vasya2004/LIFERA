import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <div className="grid gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-20" />
          </Card>
        ))}
      </div>
      <Card>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-5 h-24 w-full" />
      </Card>
    </section>
  );
}
