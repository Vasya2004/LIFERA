import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AIRecommendationCardProps = {
  content: string;
  title: string;
};

export function AIRecommendationCard({ content, title }: AIRecommendationCardProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <p className="text-sm font-medium text-primary">AI рекомендация</p>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
      <Button className="mt-5" size="sm">
        Получить следующий шаг
      </Button>
    </Card>
  );
}

