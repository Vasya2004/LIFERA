"use client";

import { useId, useState } from "react";

const faqItems = [
  {
    answer:
      "Lifera не строится вокруг списка дел. В центре системы находятся цели, привычки, прогресс, XP, достижения и AI-рекомендации.",
    question: "Чем Lifera отличается от обычного планировщика задач?",
  },
  {
    answer:
      "Нет. Привычки в Lifera — это регулярные действия внутри системы развития, связанные с целями, навыками, здоровьем, финансами и общей RPG-логикой прогресса.",
    question: "Это приложение для привычек?",
  },
  {
    answer:
      "Пользователь получает XP за продвижение по целям, этапы плана цели и выполнение привычек. Уровни, достижения и прогресс помогают видеть развитие как понятный маршрут.",
    question: "Как работает геймификация?",
  },
  {
    answer:
      "AI Ассистент анализирует цели, привычки и прогресс пользователя, помогает выбрать следующий шаг, замечает просадки и предлагает более понятную траекторию движения.",
    question: "Зачем нужен AI Ассистент?",
  },
  {
    answer:
      "Да. Free-план позволяет начать работу с целями, привычками и базовыми AI-рекомендациями.",
    question: "Можно ли пользоваться Lifera бесплатно?",
  },
  {
    answer:
      "Пользователь проходит onboarding, выбирает ключевые сферы жизни, задаёт первую цель, получает стартовую привычку и попадает на Dashboard.",
    question: "Что происходит после регистрации?",
  },
];

const DEFAULT_OPEN_INDEX = 0;

function FaqToggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex h-5 w-5 shrink-0 items-center justify-center text-[var(--landing-accent-2)]"
    >
      <span className="absolute h-[2px] w-4 rounded-full bg-current" />
      <span
        className={[
          "absolute h-4 w-[2px] rounded-full bg-current transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />
    </span>
  );
}

export function LandingFaq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(DEFAULT_OPEN_INDEX);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section className="landing-section relative" id="faq">
      <div className="landing-container">
        <h2 className="landing-faq-title text-left font-semibold uppercase tracking-[-0.02em] text-[var(--landing-text)]">
          FAQ
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-[1.5] text-[var(--landing-text-secondary)] sm:text-base">
          Часто задаваемые вопросы о Life RPG-системе Lifera
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:mt-12">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                className={[
                  "landing-faq-item group relative overflow-hidden rounded-[26px] border transition-[border-color,box-shadow] duration-300",
                  isOpen
                    ? "landing-faq-item-open border-[rgb(255_106_42/0.28)]"
                    : "border-[var(--landing-border)]",
                ].join(" ")}
                key={item.question}
              >
                <span aria-hidden className="landing-faq-glow pointer-events-none" />
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="relative flex min-h-[72px] w-full items-center gap-4 px-5 py-5 text-left sm:min-h-[88px] sm:px-8 sm:py-6"
                  id={buttonId}
                  onClick={() => toggle(index)}
                  type="button"
                >
                  <span className="min-w-0 flex-1 pr-4">
                    <span className="block text-sm font-medium uppercase leading-snug tracking-[0.04em] text-[var(--landing-text)] sm:text-base md:text-lg">
                      {item.question}
                    </span>
                  </span>
                  <FaqToggle open={isOpen} />
                </button>

                <div
                  aria-labelledby={buttonId}
                  className={[
                    "landing-faq-panel grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                  id={panelId}
                  role="region"
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-[13px] leading-[1.55] text-[var(--landing-text-secondary)] sm:px-8 sm:pb-7 sm:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
