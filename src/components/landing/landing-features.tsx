import {
  Bot,
  Flame,
  HeartPulse,
  LayoutDashboard,
  Target,
  Trophy,
  Wallet,
  Wrench,
} from "lucide-react";

const modules = [
  {
    icon: LayoutDashboard,
    title: "Главная",
    description:
      "Единая панель прогресса: цель, привычки, здоровье, финансы, достижения и рекомендации.",
    color: "#FF5A1F",
  },
  {
    icon: Target,
    title: "Цели",
    description:
      "Формулируйте важные направления и связывайте их с действиями и желаниями.",
    color: "#F97316",
  },
  {
    icon: Flame,
    title: "Привычки",
    description:
      "Регулярные действия, которые двигают цель и помогают строить серию.",
    color: "#3B82F6",
  },
  {
    icon: HeartPulse,
    title: "Здоровье",
    description:
      "Отслеживайте энергию, сон, стресс, восстановление и проблемные зоны тела.",
    color: "#F43F5E",
  },
  {
    icon: Wallet,
    title: "Финансы",
    description:
      "Следите за капиталом, расходами, целями месяца и финансовыми желаниями.",
    color: "#10B981",
  },
  {
    icon: Trophy,
    title: "Достижения",
    description:
      "Фиксируйте прогресс, открывайте награды и видьте ближайший результат.",
    color: "#F59E0B",
  },
  {
    icon: Wrench,
    title: "Навыки",
    description:
      "Развивайте hard и soft skills через регулярную практику и личные цели.",
    color: "#06B6D4",
  },
  {
    icon: Bot,
    title: "Ассистент",
    description:
      "Получайте следующий шаг на основе целей, привычек, здоровья и финансов.",
    color: "#8B5CF6",
  },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

export function LandingFeatures() {
  return (
    <section className="landing-section relative overflow-hidden" id="features">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black 10%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 0%, rgb(255 90 31 / 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="landing-container relative">
        <h2 className="max-w-[760px] text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.08] tracking-tight text-[var(--landing-text)]">
          Всё для личного прогресса
          <br className="hidden sm:block" /> в одной системе
        </h2>
        <p className="mt-5 max-w-[720px] text-[clamp(1rem,1.8vw,1.0625rem)] leading-[1.6] text-[var(--landing-text-secondary)]">
          Цели, привычки, здоровье, финансы, навыки, достижения и AI-помощник
          связаны в единую систему развития.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const rgb = hexToRgb(mod.color);
            return (
              <div
                className="features-card group"
                key={mod.title}
                style={
                  {
                    "--card-accent": mod.color,
                    "--card-accent-rgb": rgb,
                  } as React.CSSProperties
                }
              >
                <div className="features-card-glow" />
                <div className="features-card-icon-badge">
                  <Icon
                    aria-hidden
                    className="features-card-icon"
                    size={22}
                  />
                </div>
                <h3 className="relative mt-6 text-xl font-semibold text-white">
                  {mod.title}
                </h3>
                <p className="relative mt-2.5 text-[0.875rem] leading-[1.6] text-zinc-400">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
