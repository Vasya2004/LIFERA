import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <PageContent aria-label="Загрузка раздела">
      <div className="grid gap-3">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>

      <Card>
        <Skeleton className="h-48 w-full" />
      </Card>
    </PageContent>
  );
}
