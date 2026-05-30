import Link from "next/link";

type PlanLimitAlertProps = {
  message: string;
};

export function PlanLimitAlert({ message }: PlanLimitAlertProps) {
  return (
    <div className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
      <p>{message}</p>
      <Link className="mt-2 inline-flex font-semibold text-primary hover:underline" href="/plan">
        Открыть план и снять лимит →
      </Link>
    </div>
  );
}
