"use client";

import "./assistant-orb.css";

import { useCallback, useRef, useState } from "react";
import {
  ArrowUp,
  Eye,
  EyeOff,
  Heart,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AssistantOrb } from "@/components/assistant/assistant-orb";
import { AssistantPromptCard } from "@/components/assistant/assistant-prompt-card";
import type { AssistantPageData } from "@/lib/domain/assistant-page";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const SCENARIOS = [
  {
    accent: "brand",
    icon: Target,
    prompt: "Помоги определить следующий шаг по моей главной цели",
    subtitle: "Помогу расставить приоритеты и наметить следующий шаг",
    title: "Цели и привычки",
  },
  {
    accent: "finance",
    icon: TrendingUp,
    prompt: "Проанализируй мою финансовую картину и предложи следующий шаг",
    subtitle: "Разберём расходы, капитал и финансовую цель",
    title: "Финансы",
  },
  {
    accent: "health",
    icon: Heart,
    prompt: "Помоги оценить моё самочувствие и выбрать простой шаг на сегодня",
    subtitle: "Сон, энергия, восстановление и мягкие рекомендации",
    title: "Здоровье",
  },
  {
    accent: "achievement",
    icon: Trophy,
    prompt: "Покажи, какое достижение ближе всего и что сделать дальше",
    subtitle: "Прогресс, ближайшие вехи и мотивация",
    title: "Достижения",
  },
] as const;

function generateResponse(prompt: string, data: AssistantPageData): string {
  const lower = prompt.toLowerCase();
  const rec = data.mainRecommendation;
  const s = data.snapshot;

  if (lower.includes("цел") || lower.includes("приоритет") || lower.includes("привыч")) {
    return `${rec.title}. ${rec.recommendation} ${rec.reason}`;
  }

  if (lower.includes("финанс") || lower.includes("расход") || lower.includes("бюджет")) {
    if (s.activeGoals === 0) {
      return "У вас пока нет активных целей. Создайте финансовую цель в разделе «Цели», чтобы я мог отслеживать прогресс.";
    }
    return `Сейчас у вас ${s.activeGoals} активных целей. Рекомендую сосредоточиться на одной ключевой финансовой цели и создать регулярную привычку для отслеживания.`;
  }

  if (lower.includes("здоров") || lower.includes("энерг") || lower.includes("сон")) {
    return "Для анализа здоровья добавьте записи в раздел «Здоровье». Это поможет видеть динамику энергии, сна и восстановления.";
  }

  if (lower.includes("достижен") || lower.includes("наград") || lower.includes("вех")) {
    if (s.unlockedAchievements === 0) {
      return "Достижения ещё не открыты. Выполните первую привычку — первые вехи откроются автоматически.";
    }
    return `У вас открыто ${s.unlockedAchievements} достижений. Продолжайте выполнять привычки — новые вехи откроются по мере роста.`;
  }

  if (lower.includes("привет") || lower.includes("помощ") || lower.includes("помоги")) {
    return `Привет! Я ассистент Lifera. ${rec.title} — ${rec.recommendation}`;
  }

  return `${rec.title}. ${rec.recommendation} ${rec.effect}`;
}

export function AssistantChat({ data }: { data: AssistantPageData }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const msgCounter = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    msgCounter.current += 1;
    const userMsg: Message = { id: `u-${msgCounter.current}`, role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    msgCounter.current += 1;
    const responseText = generateResponse(text, data);
    const assistantMsg: Message = { id: `a-${msgCounter.current}`, role: "assistant", text: responseText };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  }, [data, loading]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleScenarioClick(prompt: string) {
    setInput(prompt);
    sendMessage(prompt);
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div className="app-page relative flex min-h-[calc(100vh-var(--topbar-height))] flex-col items-center pt-6 pb-8 xl:pb-10">
      <div className="flex w-full max-w-[920px] flex-1 flex-col items-center">
        {messages.length === 0 && (
          <>
            <div className="mb-5 mt-3">
              <AssistantOrb onActivate={focusInput} />
            </div>

            <h1 className="text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Привет, {data.snapshot.activeGoals > 0 ? "пользователь" : "пользователь"} 👋
            </h1>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              Чем могу помочь сегодня?
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {SCENARIOS.map((s) => (
                <AssistantPromptCard
                  accent={s.accent}
                  description={s.subtitle}
                  icon={s.icon}
                  key={s.title}
                  onClick={() => handleScenarioClick(s.prompt)}
                  prompt={s.prompt}
                  title={s.title}
                />
              ))}
            </div>
          </>
        )}

        {messages.length > 0 && (
          <div className="mt-6 grid w-full gap-4">
            {messages.map((msg) => (
              <div
                className={[
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start",
                ].join(" ")}
                key={msg.id}
              >
                {msg.role === "assistant" && (
                  <div className="orb-mini mt-1 shrink-0">
                    <div className="orb-mini-inner" />
                  </div>
                )}
                <div
                  className={[
                    "max-w-lg rounded-2xl px-4 py-3 text-sm",
                    msg.role === "user"
                      ? "rounded-br-sm border border-[#FF5A1F]/30 bg-[#FF5A1F]/15 text-zinc-950 dark:text-white"
                      : "rounded-bl-sm border border-zinc-200 bg-white text-zinc-800 dark:border-white/5 dark:bg-zinc-900 dark:text-white",
                  ].join(" ")}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="orb-mini mt-1 shrink-0">
                  <div className="orb-mini-inner" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/5 bg-zinc-900 px-4 py-3">
                  <span className="bounce-dot h-2 w-2 rounded-full bg-orange-500" style={{ animationDelay: "0ms" }} />
                  <span className="bounce-dot h-2 w-2 rounded-full bg-orange-500" style={{ animationDelay: "200ms" }} />
                  <span className="bounce-dot h-2 w-2 rounded-full bg-orange-500" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
            )}
          </div>
        )}

        {messages.length > 0 && (
          <button
            className="mt-4 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            type="button"
          >
            Новый диалог
          </button>
        )}

        <div className="relative mt-6 w-full max-w-2xl">
          <textarea
            ref={inputRef}
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white/90 px-5 py-4 pr-16 text-base text-zinc-950 shadow-[var(--shadow-sm)] outline-none backdrop-blur-xl transition-[border-color,box-shadow,background-color] placeholder:text-zinc-500 focus:border-[#FF5A1F]/55 focus:shadow-[0_0_0_4px_rgba(255,90,31,0.12)] dark:border-white/10 dark:bg-zinc-900/85 dark:text-white dark:placeholder:text-zinc-500"
            maxLength={2000}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Спросите что угодно..."
            rows={1}
            value={input}
          />
          <button
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#FF5A1F]/35 bg-[#FF5A1F]/15 text-[#FF5A1F] transition-[background-color,box-shadow,opacity] hover:bg-[#FF5A1F]/25 hover:shadow-[0_0_24px_rgba(255,90,31,0.28)] disabled:opacity-30"
            disabled={!input.trim() || loading}
            onClick={() => sendMessage(input)}
            type="button"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        className="fixed right-4 top-20 z-30 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs text-zinc-600 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        onClick={() => setContextOpen(!contextOpen)}
        type="button"
      >
        {contextOpen ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        Контекст системы
      </button>

      <div
        className={[
          "fixed right-0 top-0 z-20 h-full w-80 border-l border-white/5 bg-zinc-950 p-5 transition-transform duration-300",
          contextOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white">Что видит система</h3>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Сводка по вашим данным — рекомендации строятся на целях, привычках и регулярности.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: "Активные цели", value: data.snapshot.activeGoals },
            { label: "Активные привычки", value: data.snapshot.activeChallenges },
            { label: "Привычки сегодня", value: `${data.snapshot.ritualsToday}/${data.snapshot.ritualsTotal}` },
            { label: "Опыт за неделю", value: data.snapshot.weeklyXp },
            { label: "Открытые достижения", value: data.snapshot.unlockedAchievements },
            { label: "Сферы с активностью", value: data.snapshot.activeLifeAreas },
          ].map((item) => (
            <div className="rounded-xl border border-white/5 bg-zinc-900 p-3" key={item.label}>
              <p className="text-xs text-zinc-400">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-white/5 bg-zinc-900 p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-orange-400" />
            <p className="text-xs font-semibold text-white">Рекомендация</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-400">
            {data.mainRecommendation.title}. {data.mainRecommendation.recommendation}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900 p-3">
          <p className="text-xs font-semibold text-white">Режим ассистента</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            Сейчас Lifera использует базовый рекомендательный режим: анализирует ваши цели, привычки, опыт и достижения.
          </p>
        </div>
      </div>

      {contextOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40"
          onClick={() => setContextOpen(false)}
        />
      )}
    </div>
  );
}
