import { Brain, Bot, Sparkles, TrendingUp, Compass } from "lucide-react";

interface AiFeature {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const aiFeatures: AiFeature[] = [
  {
    title: "Анализ прогресса по сферам",
    desc: "Ассистент сканирует ваши показатели здоровья, финансов и навыков для выявления сильных сторон и дефицитов.",
    icon: Compass,
  },
  {
    title: "Привычки под стратегию",
    desc: "Генерирует ежедневные и еженедельные действия, которые напрямую привязаны к вашим большим жизненным целям.",
    icon: Sparkles,
  },
  {
    title: "Выявление просадок",
    desc: "Замечает, когда привычки начинают угасать или падает общая динамика активности, и предлагает мягкую коррекцию.",
    icon: TrendingUp,
  },
  {
    title: "Один следующий шаг",
    desc: "Избавляет от усталости планирования, предлагая одно конкретное ключевое действие здесь и сейчас.",
    icon: Brain,
  },
];

export function LandingAi() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-1/4 h-[380px] w-[380px] rounded-full bg-[var(--landing-ai-accent)] blur-[120px] opacity-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-10 bottom-1/4 h-[280px] w-[280px] rounded-full bg-[#FF5A1F]/5 blur-[100px] opacity-15"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center">

          {/* Left Column: Context, Heading, Assistant Mock Card */}
          <div className="text-left space-y-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                <Brain size={12} />
                Ассистент Lifera
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
                AI помогает выбрать следующий шаг
              </h2>
            </div>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Вместо хаотичных списков задач система анализирует ваш контекст и предлагает одно точечное действие, которое принесет максимум пользы вашему развитию сегодня.
            </p>

            {/* AI Recommendation simulated UI mock */}
            <div className="relative mt-8 max-w-sm rounded-2xl border border-violet-500/20 bg-zinc-950/90 p-5 shadow-[0_8px_32px_rgba(139,92,246,0.15)] backdrop-blur-md overflow-hidden select-none">
              {/* Gradient card accent */}
              <div aria-hidden className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Bot size={14} className="animate-pulse" />
                  </div>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Рекомендация AI</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">Сфера: Здоровье</span>
              </div>

              {/* Card Body */}
              <div className="mt-4 space-y-3">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  «Выполните привычку <span className="text-violet-300 font-semibold">«Медитация»</span>. Уровень стресса повышен на 15% за последние 2 дня, короткая сессия восстановит фокус.»
                </p>

                {/* Progress impact mocks */}
                <div className="flex items-center gap-3 pt-1 text-[10px] font-semibold text-emerald-400">
                  <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    +15 XP
                  </span>
                  <span className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md text-violet-300">
                    +5% Энергия
                  </span>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="mt-4 flex justify-between items-center">
                <div className="h-7 px-3 rounded-lg bg-violet-600/30 hover:bg-violet-600/40 text-violet-200 text-[10px] font-semibold border border-violet-500/30 flex items-center justify-center transition-all cursor-default">
                  Запустить привычку
                </div>
                <span className="text-[9px] text-zinc-500">анализ завершен 1м назад</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI features listed as premium glass cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {aiFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 p-5 shadow-lg hover:border-violet-500/30 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between min-h-[170px]"
                >
                  {/* Subtle inner hover glow */}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-transparent to-violet-600/0 group-hover:from-violet-600/[0.02] group-hover:to-transparent pointer-events-none transition-all duration-500" />

                  <div>
                    {/* Icon Badge */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.02] border border-white/10 text-zinc-400 group-hover:text-violet-400 group-hover:border-violet-500/30 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.15)] transition-all duration-300 mb-4">
                      <Icon size={18} />
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-2.5 group-hover:text-zinc-300 transition-colors">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
