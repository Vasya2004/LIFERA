import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProgressCardProps = {
  description?: string;
  label: string;
  value: number;
};

export function ProgressCard({ description, label, value }: ProgressCardProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Progress label="Прогресс" tone="success" value={value} />
    </Card>
  );
}

