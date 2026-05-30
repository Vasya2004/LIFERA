import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  helpText?: string;
  label?: string;
};

export function Select({
  children,
  className = "",
  error,
  helpText,
  id,
  label,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;
  const messageId = selectId ? `${selectId}-message` : undefined;

  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label ? <span>{label}</span> : null}
      <select
        aria-describedby={error || helpText ? messageId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "h-[var(--input-height-md)] rounded-[var(--radius-control)] border border-border bg-surface px-4 text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200",
          "focus:border-ring focus:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger focus:border-danger focus:shadow-none" : "",
          className,
        ].join(" ")}
        id={selectId}
        {...props}
      >
        {children}
      </select>
      {error || helpText ? (
        <span
          className={[
            "text-sm font-medium",
            error ? "text-danger" : "text-muted-foreground",
          ].join(" ")}
          id={messageId}
        >
          {error ?? helpText}
        </span>
      ) : null}
    </label>
  );
}
