import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ModulePreviewProps = {
  description: string;
  items: string[];
  metric: string;
  progress: number;
  title: string;
};

export function ModulePreview({
  description,
  items,
  metric,
  progress,
  title,
}: ModulePreviewProps) {
  return (
    <section className="app-page grid gap-5 pt-6 pb-8 lg:grid-cols-[1.2fr_0.8fr] xl:gap-6 xl:pb-10">
      <Card variant="elevated">
        <CardHeader>
          <Badge variant="muted">Запланировано</Badge>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                className="rounded-[var(--radius-control)] border border-border bg-surface-muted p-4 text-sm leading-6 text-muted-foreground"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge variant="muted">Каркас v0.2</Badge>
          <CardTitle>{metric}</CardTitle>
          <CardDescription>
            Сейчас это статичный UI-паттерн. Реальные данные подключаются
            отдельно после auth и backend foundation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <Progress label="Готовность UX-каркаса" value={progress} />
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[var(--radius-control)] bg-surface-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">Источник данных</span>
              <span className="font-medium text-foreground">Запланирован</span>
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius-control)] bg-surface-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">Backend</span>
              <span className="font-medium text-foreground">Не подключен</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
