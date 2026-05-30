import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  progress?: number;
};

export function StatCard({ detail, label, progress, value }: StatCardProps) {
  return (
    <Card className="grid gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
      {typeof progress === "number" ? <Progress tone="primary" value={progress} /> : null}
    </Card>
  );
}

