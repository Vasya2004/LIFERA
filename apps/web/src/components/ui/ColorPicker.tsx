"use client";

export const HABIT_COLORS = [
  "#6d5ef8",
  "#f04438",
  "#f79009",
  "#17b26a",
  "#0ea5e9",
  "#ec4899",
  "#a855f7",
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {HABIT_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="h-6 w-6 rounded-full transition-transform"
          style={{
            backgroundColor: color,
            outline: value === color ? `2px solid ${color}` : "none",
            outlineOffset: 2,
            transform: value === color ? "scale(1.1)" : "scale(1)",
          }}
          aria-label={color}
        />
      ))}
    </div>
  );
}
