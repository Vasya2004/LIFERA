import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type MetricCardProps = {
  detail: string;
  label: string;
  progress?: number;
  progressTone?: "primary" | "success" | "warning" | "muted";
  status?: string;
  value: string;
};

export function MetricCard({
  detail,
  label,
  progress,
  progressTone = "muted",
  status,
  value,
}: MetricCardProps) {
  return (
    <Card className="min-h-36" variant="default">
      <CardContent className="mt-0 grid h-full gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          </div>
          {status ? <Badge variant="muted">{status}</Badge> : null}
        </div>
        {progress === undefined ? null : (
          <Progress
            aria-label={label}
            size="compact"
            tone={progressTone}
            value={progress}
          />
        )}
        <p className="text-sm leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
