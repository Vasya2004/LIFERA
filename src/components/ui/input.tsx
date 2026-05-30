import type { InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  error?: string;
  helpText?: string;
  label?: string;
  size?: "md" | "lg";
};

export function Input({
  className = "",
  disabled,
  error,
  helpText,
  id,
  label,
  size = "md",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const messageId = inputId ? `${inputId}-message` : undefined;

  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label ? <span>{label}</span> : null}
      <input
        aria-describedby={error || helpText ? messageId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "rounded-[var(--radius-control)] border bg-surface px-4 text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200",
          "border-border placeholder:text-muted-foreground focus:border-ring focus:shadow-[var(--focus-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          size === "lg" ? "h-[var(--input-height-lg)]" : "h-[var(--input-height-md)]",
          error ? "border-danger focus:border-danger focus:shadow-none" : "",
          className,
        ].join(" ")}
        disabled={disabled}
        id={inputId}
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
