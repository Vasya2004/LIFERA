export default function TermsPage() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold text-foreground">
          ПУБЛИЧНАЯ ОФЕРТА
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lifera — платформа для управления целями и личной продуктивностью
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Дата публикации: 13 июня 2026 г.</p>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          1. ОБЩИЕ ПОЛОЖЕНИЯ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Настоящий документ является публичной офертой самозанятого гражданина
            Василия (ИНН: 425307654609), именуемого в дальнейшем «Исполнитель»,
            и определяет условия использования сервиса Lifera (далее — «Сервис»).
          </p>
          <p>
            Факт регистрации и использования Сервиса означает полное и
            безоговорочное принятие (акцепт) настоящей оферты пользователем
            (далее — «Пользователь»).
          </p>
          <p>
            Если Пользователь не согласен с условиями оферты, он обязан
            воздержаться от использования Сервиса.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          2. ПРЕДМЕТ ОФЕРТЫ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Исполнитель предоставляет Пользователю доступ к веб-сервису Lifera
            для управления целями, привычками, привычками, навыками, здоровьем,
            финансами и достижениями на условиях настоящей оферты.
          </p>
          <p>
            Сервис включает в себя: постановку целей, отслеживание привычек
            и привычек, систему геймификации (XP, уровни, достижения),
            AI-рекомендации, журнал здоровья и финансов.
          </p>
          <p>
            Исполнитель не является медицинским сервисом, финансовым советником
            или психологом. Все рекомендации носят информационный характер.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          3. ТАРИФЫ И ПОДПИСКА
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Сервис предлагает следующие тарифные планы:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>
              <strong className="text-foreground">Free</strong> — бесплатно. Включает: до 3 целей,
              до 5 привычек, базовый прогресс и достижения.
            </li>
            <li>
              <strong className="text-foreground">Pro</strong> — 499 ₽ в месяц. Включает: безлимит
              целей и привычек, полная история прогресса, расширенная аналитика,
              Pro-шаблоны, расширенные рекомендации Lifera.
            </li>
            <li>
              <strong className="text-foreground">Ultra</strong> — 999 ₽ в месяц. Включает: всё из
              Pro, расширенные AI-рекомендации, приоритетные подсказки,
              Premium-шаблоны и достижения.
            </li>
          </ul>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          4. ПОРЯДОК ОПЛАТЫ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Оплата производится через платёжный сервис ЮKassa. Подписка
            активируется автоматически после успешной оплаты. Средства
            списываются ежемесячно в дату первой оплаты.
          </p>
          <p>
            Пользователь может изменить или отменить подписку в любое время
            через настройки аккаунта.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          5. ВОЗВРАТ СРЕДСТВ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Пользователь вправе отказаться от подписки в личном кабинете.
            При отмене подписки доступ к платным функциям сохраняется до
            конца оплаченного периода.
          </p>
          <p>
            Возврат средств за текущий период не производится, за исключением
            случаев, предусмотренных действующим законодательством Российской
            Федерации.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          6. ПРАВА И ОБЯЗАННОСТИ ПОЛЬЗОВАТЕЛЯ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Пользователь обязуется:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Использовать Сервис исключительно в личных некоммерческих целях.</li>
            <li>Не передавать учётные данные третьим лицам.</li>
            <li>Не использовать Сервис для распространения вредоносного контента.</li>
            <li>Своевременно оплачивать подписку при использовании платных тарифов.</li>
          </ul>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          7. ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Lifera не является медицинским сервисом, финансовым советником
            или психологом. Все рекомендации носят информационный характер.
          </p>
          <p>
            Исполнитель не несёт ответственности за решения, принятые
            Пользователем на основании рекомендаций Сервиса.
          </p>
          <p>
            Исполнитель не гарантирует бесперебойную работу Сервиса и несёт
            ответственность только в пределах суммы последней оплаты
            Пользователя.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          8. КОНТАКТЫ
        </h2>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>Email: vasya13nom@gmail.com</p>
          <p>ИНН самозанятого: 425307654609</p>
        </div>
      </div>
    </section>
  );
}
