import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helpText?: string;
  label?: string;
};

export function Textarea({
  className = "",
  error,
  helpText,
  id,
  label,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;
  const messageId = textareaId ? `${textareaId}-message` : undefined;

  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label ? <span>{label}</span> : null}
      <textarea
        aria-describedby={error || helpText ? messageId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "min-h-28 resize-y rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3 text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200",
          "placeholder:text-muted-foreground focus:border-ring focus:shadow-[var(--focus-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-danger focus:border-danger focus:shadow-none" : "",
          className,
        ].join(" ")}
        id={textareaId}
        {...props}
      />
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
