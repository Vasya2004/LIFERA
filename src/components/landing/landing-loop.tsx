"use client";

import {
  Bot,
  Repeat,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

interface LoopStep {
  number: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const loopSteps: LoopStep[] = [
  {
    number: "01",
    label: "Цель",
    description: "Вектор развития",
    icon: Target,
  },
  {
    number: "02",
    label: "Привычка",
    description: "Действие в фокусе",
    icon: Repeat,
  },
  {
    number: "03",
    label: "Прогресс",
    description: "Накопление шагов",
    icon: TrendingUp,
  },
  {
    number: "04",
    label: "XP",
    description: "Опыт за труды",
    icon: Sparkles,
  },
  {
    number: "05",
    label: "Уровень",
    description: "Повышение статуса",
    icon: Zap,
  },
  {
    number: "06",
    label: "Достижение",
    description: "Фиксация победы",
    icon: Trophy,
  },
  {
    number: "07",
    label: "AI-рекомендация",
    description: "Точная коррекция",
    icon: Bot,
  },
];

export function LandingLoop() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgb(255 90 31 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-center text-[clamp(2rem,4.5vw,2.75rem)] font-bold tracking-tight text-white leading-[1.15]">
          Один цикл, который двигает тебя вперёд
        </h2>
        <p className="mt-4 mx-auto max-w-[620px] text-center text-sm sm:text-base text-zinc-400 leading-relaxed">
          Система объединяет планирование и действия в единый непрерывный поток развития.
        </p>

        {/* Desktop: horizontal premium pipeline */}
        <div className="relative mt-16 hidden lg:block">
          {/* Connecting gradient line */}
          <div
            aria-hidden
            className="absolute left-[7%] right-[7%] top-[56px] h-[1px] bg-gradient-to-r from-[#FF5A1F]/5 via-[#FF5A1F]/30 to-[#FF5A1F]/5 pointer-events-none z-0"
          />

          <ol className="relative grid grid-cols-7 gap-4 z-10">
            {loopSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} className="group text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#FF5A1F] tracking-wider uppercase mb-3 select-none opacity-80 group-hover:opacity-100 transition-opacity">
                      {step.number}
                    </span>

                    {/* Glowing circle container */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-950/80 text-zinc-400 group-hover:text-[#FF5A1F] group-hover:border-[#FF5A1F]/40 group-hover:shadow-[0_0_20px_rgba(255,90,31,0.2)] transition-all duration-300 z-10 backdrop-blur-md">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {step.label}
                    </h3>
                    <p className="mt-1 text-[11px] text-zinc-500 leading-normal max-w-[110px] mx-auto truncate group-hover:text-zinc-400 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile/tablet: vertical quest-like timeline */}
        <div className="relative mt-12 lg:hidden max-w-md mx-auto">
          {/* Vertical timeline path line */}
          <div
            aria-hidden
            className="absolute left-[18px] top-6 bottom-6 w-px bg-gradient-to-b from-[#FF5A1F]/30 via-white/10 to-transparent pointer-events-none z-0"
          />

          <ol className="flex flex-col gap-5 relative z-10 pl-10">
            {loopSteps.map((step) => {
              const Icon = step.icon;
              return (
                <li className="group relative" key={step.number}>
                  {/* Step bullet indicator */}
                  <div className="absolute left-[-32px] top-3.5 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-zinc-950 text-[9px] font-bold text-[#FF5A1F] group-hover:border-[#FF5A1F]/30 transition-colors duration-300 z-10 select-none">
                    {step.number}
                  </div>

                  {/* Step Card */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm hover:border-[#FF5A1F]/20 hover:bg-zinc-800/40 transition-all duration-300 shadow-md">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.02] border border-white/10 text-zinc-400 group-hover:text-[#FF5A1F] group-hover:border-[#FF5A1F]/20 transition-all duration-300">
                      <Icon size={18} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-xs font-semibold text-white group-hover:text-[#FF5A1F] transition-colors">
                        {step.label}
                      </h3>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[200px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
