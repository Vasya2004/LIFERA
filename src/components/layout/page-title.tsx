import type { ReactNode } from "react";

type PageTitleProps = {
  subtitle?: string;
  title: string;
  action?: ReactNode;
};

export function PageTitle({ action, subtitle, title }: PageTitleProps) {
  return (
    <div className="grid gap-4 sm:flex sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <div className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}
