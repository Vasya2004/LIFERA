import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StatusBlockProps = {
  className?: string;
  description?: string;
  items?: string[];
  title: string;
};

export function StatusBlock({
  className = "",
  description,
  items = [],
  title,
}: StatusBlockProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <Badge variant="muted">{title}</Badge>
        {description ? <CardTitle className="text-base">{description}</CardTitle> : null}
      </CardHeader>
      {items.length > 0 ? (
        <CardContent>
          <ul className="grid gap-3 text-muted">
            {items.map((item) => (
              <li
                className="rounded-[var(--radius-control)] border border-border bg-background px-4 py-3"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  );
}
