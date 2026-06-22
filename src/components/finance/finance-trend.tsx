import { FinanceEntryModal } from "@/components/finance/finance-entry-modal";
import type { FinanceTrendPoint } from "@/lib/domain/finance";

type FinanceTrendProps = {
  trend: FinanceTrendPoint[];
};

function amountLabel(value: number) {
  if (value <= 0) return "0";
  return `${Math.round(value / 1000)} тыс.`;
}

export function FinanceTrend({ trend }: FinanceTrendProps) {
  const points = trend.slice(-6);
  const max = Math.max(1, ...points.map((point) => point.savings));
  const min = Math.min(0, ...points.map((point) => point.savings));
  const range = Math.max(1, max - min);
  const chartWidth = 640;
  const chartHeight = 170;
  const paddingX = 42;
  const paddingY = 20;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const coords = points.map((point, index) => {
    const x = paddingX + (points.length <= 1 ? 0 : (index / (points.length - 1)) * innerWidth);
    const y = paddingY + innerHeight - ((point.savings - min) / range) * innerHeight;
    return { ...point, x, y };
  });
  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const yTicks = [max, Math.round((max + min) / 2), min];

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
      <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Динамика капитала</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Как меняется капитал по финансовым снимкам.
      </p>

      {points.length < 2 ? (
        <div className="mt-4 grid min-h-[180px] place-items-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-center dark:border-white/10 dark:bg-zinc-950/40">
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              График появится после нескольких снимков
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Добавьте 2–3 финансовых снимка, чтобы увидеть движение капитала.
            </p>
            <FinanceEntryModal className="mt-4" />
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <svg className="min-w-[640px]" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
            {yTicks.map((tick, index) => {
              const y = paddingY + index * (innerHeight / 2);
              return (
                <g key={tick}>
                  <line className="stroke-zinc-200 dark:stroke-white/10" x1={paddingX} x2={chartWidth - paddingX} y1={y} y2={y} />
                  <text className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" x={0} y={y + 4}>
                    {amountLabel(tick)}
                  </text>
                </g>
              );
            })}
            {coords.map((point) => (
              <text className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" key={point.date} textAnchor="middle" x={point.x} y={chartHeight - 4}>
                {point.label}
              </text>
            ))}
            <path d={path} fill="none" stroke="#059669" strokeWidth={2.5} />
            {coords.map((point) => (
              <circle cx={point.x} cy={point.y} fill="#059669" key={`${point.date}-dot`} r={4} />
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
