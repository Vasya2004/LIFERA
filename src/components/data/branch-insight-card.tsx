import { Card } from "@/components/ui/card";

type BranchInsightCardProps = {
  content: string;
  title: string;
};

export function BranchInsightCard({ content, title }: BranchInsightCardProps) {
  return (
    <Card variant="highlight">
      <p className="text-sm font-medium text-primary">AI-рекомендация</p>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{content}</p>
    </Card>
  );
}
