"use client";

import { useState } from "react";
import {
  Bot,
  Brain,
  Compass,
  Heart,
  Repeat,
  Target,
  Trophy,
  Wallet,
} from "lucide-react";

interface EcosystemModule {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  x: number;
  y: number;
}

const ecosystemModules: EcosystemModule[] = [
  {
    title: "Цели",
    subtitle: "направление",
    icon: Target,
    x: 22,
    y: 24,
  },
  {
    title: "Желания",
    subtitle: "мотивация",
    icon: Compass,
    x: 50,
    y: 12,
  },
  {
    title: "Привычки",
    subtitle: "действия",
    icon: Repeat,
    x: 78,
    y: 24,
  },
  {
    title: "AI-помощник",
    subtitle: "следующий шаг",
    icon: Bot,
    x: 86,
    y: 50,
  },
  {
    title: "Достижения",
    subtitle: "результаты",
    icon: Trophy,
    x: 78,
    y: 76,
  },
  {
    title: "Финансы",
    subtitle: "ресурсы",
    icon: Wallet,
    x: 50,
    y: 88,
  },
  {
    title: "Здоровье",
    subtitle: "энергия",
    icon: Heart,
    x: 22,
    y: 76,
  },
  {
    title: "Навыки",
    subtitle: "рост",
    icon: Brain,
    x: 14,
    y: 50,
  },
];

export function LandingSolution() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-black py-28 sm:py-32" id="how-it-works">
      {/* Background Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* Huge faint background brand text */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(6rem,16vw,14rem)] font-extrabold tracking-[0.18em] text-white/[0.02] uppercase font-sans z-0"
      >
        LIFERA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Text Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Lifera собирает прогресс в единую систему
          </h2>
          <p className="mt-4 mx-auto max-w-[760px] text-lg sm:text-xl text-zinc-400 leading-relaxed">
            Цели, желания, привычки, здоровье, финансы, навыки и AI работают не отдельно, а как единая система развития.
          </p>
        </div>

        {/* Desktop Layout (md and up) */}
        <div className="hidden md:block relative w-full h-[600px] max-w-[850px] mx-auto mt-12">
          {/* Background orange glow behind center */}
          <div
            aria-hidden
            className="landing-glow-orb absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none z-0"
          />

          {/* Central Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center p-8 rounded-full border border-[#FF5A1F]/30 bg-zinc-950/80 shadow-[0_0_80px_rgba(255,90,31,0.22)] w-52 h-52 text-center backdrop-blur-lg transition-transform duration-500 hover:scale-105 select-none">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5A1F]/15 to-transparent pointer-events-none" />
            <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-semibold mb-1">Ядро</span>
            <h3 className="text-xl font-bold text-white tracking-tight">Ядро Lifera</h3>
            <span className="text-xs text-zinc-400 mt-2 max-w-[145px] leading-tight">единый контекст прогресса</span>
            {/* Subtle internal pulse light */}
            <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none animate-pulse" />
          </div>

          {/* Orbit Rings */}
          <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03] w-[320px] h-[320px] pointer-events-none rotate-360-slow z-0" />
          <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.04] w-[460px] h-[460px] pointer-events-none rotate-360-slow-reverse z-0" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {ecosystemModules.map((module, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <line
                  key={module.title}
                  x1="50"
                  y1="50"
                  x2={module.x}
                  y2={module.y}
                  className="transition-all duration-300 ease-out"
                  stroke={isHovered ? "#FF5A1F" : "rgba(255, 255, 255, 0.08)"}
                  strokeWidth={isHovered ? "1.5" : "1"}
                  opacity={isHovered ? "0.9" : "0.5"}
                  strokeDasharray={isHovered ? "none" : "3, 3"}
                />
              );
            })}
          </svg>

          {/* Module Cards */}
          {ecosystemModules.map((module, index) => {
            const Icon = module.icon;
            const isHovered = hoveredIndex === index;
            const floatClass = `float-delay-${index + 1}`;

            return (
              <div
                key={module.title}
                className="absolute z-20"
                style={{
                  left: `${module.x}%`,
                  top: `${module.y}%`,
                  transform: `translate(-50%, -50%)`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`solution-card-inner ${floatClass} flex items-center gap-3 px-4 py-2.5 rounded-2xl border bg-zinc-900/60 backdrop-blur-md w-[180px] shadow-lg cursor-default select-none transition-all duration-300
                    ${isHovered
                      ? "border-[#FF5A1F]/40 bg-zinc-800/60 shadow-[0_0_20px_rgba(255,90,31,0.15)]"
                      : "border-white/10"
                    }
                  `}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300
                    ${isHovered
                      ? "bg-[#FF5A1F]/20 text-[#FF5A1F] shadow-[0_0_12px_rgba(255,90,31,0.3)]"
                      : "bg-white/[0.03] text-zinc-400"
                    }
                  `}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-sm font-semibold text-white tracking-tight truncate">{module.title}</h4>
                    <p className="text-[11px] text-zinc-400 truncate">{module.subtitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Layout (up to md) */}
        <div className="flex flex-col items-center gap-8 md:hidden relative z-10 mt-10">
          {/* Background orange glow behind mobile center */}
          <div
            aria-hidden
            className="landing-glow-orb absolute top-20 h-[220px] w-[220px] opacity-40 pointer-events-none z-0"
          />

          {/* Central Core */}
          <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full border border-[#FF5A1F]/30 bg-zinc-950/80 shadow-[0_0_60px_rgba(255,90,31,0.15)] w-48 h-48 text-center backdrop-blur-md">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5A1F]/10 to-transparent pointer-events-none" />
            <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-semibold mb-1">Ядро</span>
            <h3 className="text-lg font-bold text-white tracking-tight">Ядро Lifera</h3>
            <span className="text-[11px] text-zinc-400 mt-2 max-w-[130px] leading-tight">единый контекст прогресса</span>
          </div>

          {/* Vertical indicator line connecting to core */}
          <div className="h-8 w-px bg-gradient-to-b from-[#FF5A1F]/40 to-white/10" />

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md px-2">
            {ecosystemModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-[#FF5A1F]/30 hover:bg-white/[0.04]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F]">
                    <Icon size={16} />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{module.title}</h4>
                    <p className="text-[10px] text-zinc-400 truncate">{module.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement text */}
        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-sm sm:text-base text-zinc-500 font-medium tracking-wide">
            Одна система связывает намерение, действие и результат.
          </p>
        </div>
      </div>
    </section>
  );
}
