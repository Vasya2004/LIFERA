type CircularProgressProps = {
  className?: string;
  showLabel?: boolean;
  size?: number;
  strokeWidth?: number;
  value: number;
};

export function CircularProgress({
  className = "",
  showLabel = true,
  size = 80,
  strokeWidth = 6,
  value,
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className={["relative inline-grid place-items-center", className].join(" ")}
      style={{ height: size, width: size }}
    >
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          className="stroke-zinc-200 dark:stroke-zinc-800"
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-[#FF5A1F]"
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {showLabel ? (
        <span className="absolute text-sm font-bold text-foreground">{normalizedValue}%</span>
      ) : null}
    </div>
  );
}
