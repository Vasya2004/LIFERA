import type { HTMLAttributes } from "react";

type TabItem = {
  active?: boolean;
  label: string;
};

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  items: TabItem[];
};

export function Tabs({ className = "", items, ...props }: TabsProps) {
  return (
    <div
      className={[
        "flex w-fit max-w-full gap-1 overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface-muted p-1",
        className,
      ].join(" ")}
      role="tablist"
      {...props}
    >
      {items.map((item) => (
        <button
          aria-selected={item.active ? true : undefined}
          className={[
            "h-9 whitespace-nowrap rounded-[calc(var(--radius-control)-4px)] px-3 text-sm font-semibold transition-colors",
            item.active
              ? "bg-surface text-primary shadow-[var(--shadow-sm)]"
              : "text-muted-foreground hover:bg-surface hover:text-foreground",
          ].join(" ")}
          key={item.label}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
