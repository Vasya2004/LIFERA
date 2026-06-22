import { Brain, Target, Trophy, Zap } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full origin-top scale-[0.92] sm:scale-100">
      <div
        aria-hidden
        className="landing-glow-orb landing-pulse pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-[40%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-[18%] h-px bg-gradient-to-r from-transparent via-[rgb(255_106_42/0.5)] to-transparent"
      />

      <div className="landing-glass relative overflow-hidden rounded-[24px] p-3 shadow-[0_40px_100px_rgb(0_0_0/0.55)] sm:rounded-[28px] sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--landing-border)] px-2 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--landing-accent)]" />
            <span className="text-xs font-semibold tracking-wide text-[var(--landing-text)]">
              Lifera Command Center
            </span>
          </div>
          <span className="rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] px-2.5 py-1 text-[10px] font-medium text-[var(--landing-text-secondary)]">
            Live
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden rounded-[16px] border border-[var(--landing-border)] bg-[var(--landing-surface)]/80 p-3 lg:block">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--landing-text-muted)]">
              Навигация
            </p>
            <ul className="space-y-2 text-xs text-[var(--landing-text-secondary)]">
              {["Главная", "Цели", "Привычки", "Навыки", "AI Ассистент"].map((item, index) => (
                <li
                  className={[
                    "rounded-lg px-2.5 py-2",
                    index === 0
                      ? "bg-[rgb(255_90_31/0.12)] font-semibold text-[var(--landing-accent-2)]"
                      : "",
                  ].join(" ")}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                accent
                label="Life Score"
                sub="Состояние экосистемы"
                value="74"
              />
              <MetricCard icon={Zap} label="XP" sub="Всего опыта" value="1 820" />
              <MetricCard icon={Trophy} label="Уровень" sub="До L5: 180 XP" value="4" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[16px] border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-accent-2)]">
                      Активная привычка
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--landing-text)]">
                      7 дней системного старта
                    </p>
                  </div>
                  <Target className="text-[var(--landing-accent)]" size={18} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--landing-surface)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--landing-accent)] to-[var(--landing-accent-2)]"
                    style={{ width: "42%" }}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--landing-text-secondary)]">
                  Следующий шаг: первый измеримый шаг
                </p>
              </div>

              <div className="rounded-[16px] border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-text-muted)]">
                  Сферы жизни
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "Проекты", value: 68 },
                    { label: "Здоровье", value: 52 },
                    { label: "Финансы", value: 41 },
                  ].map((area) => (
                    <div key={area.label}>
                      <div className="mb-1 flex justify-between text-[11px] text-[var(--landing-text-secondary)]">
                        <span>{area.label}</span>
                        <span>{area.value}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--landing-surface)]">
                        <div
                          className="h-full rounded-full bg-[var(--landing-accent-2)]/80"
                          style={{ width: `${area.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--landing-border)] bg-[var(--landing-surface-elevated)] p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--landing-ai-accent)] bg-[rgb(139_92_246/0.1)]">
                  <Brain className="text-violet-300" size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-300/90">
                    AI Ассистент
                  </p>
                  <p className="mt-1 text-sm font-medium leading-[1.45] text-[var(--landing-text)]">
                    Завершите текущую привычку — это даст XP и укрепит недельный прогресс.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  accent = false,
  icon: Icon,
  label,
  sub,
  value,
}: {
  accent?: boolean;
  icon?: typeof Zap;
  label: string;
  sub: string;
  value: string;
}) {
  return (
    <div
      className={[
        "rounded-[16px] border p-4",
        accent
          ? "border-[rgb(255_106_42/0.3)] bg-gradient-to-br from-[rgb(255_90_31/0.15)] to-[var(--landing-surface-elevated)]"
          : "border-[var(--landing-border)] bg-[var(--landing-surface-elevated)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-text-muted)]">
          {label}
        </p>
        {Icon ? <Icon className="text-[var(--landing-accent)]" size={14} /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--landing-text)]">{value}</p>
      <p className="mt-1 text-[11px] text-[var(--landing-text-secondary)]">{sub}</p>
    </div>
  );
}
