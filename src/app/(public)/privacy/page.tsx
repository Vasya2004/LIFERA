export default function PrivacyPage() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold text-foreground">
          ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
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
            Настоящая Политика конфиденциальности определяет порядок сбора,
            хранения, использования и защиты персональных данных пользователей
            сервиса Lifera (далее — «Сервис»).
          </p>
          <p>
            Использование Сервиса означает согласие Пользователя с условиями
            настоящей Политики. Если Пользователь не согласен с условиями, он
            должен воздержаться от использования Сервиса.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          2. КАКИЕ ДАННЫЕ МЫ СОБИРАЕМ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Сервис собирает следующие категории данных:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Данные аккаунта: email, имя, URL аватара</li>
            <li>
              Данные о целях, привычках, навыках, здоровье и финансах
              (вводятся пользователем добровольно)
            </li>
            <li>
              Технические данные: IP-адрес, тип браузера, время визитов
            </li>
          </ul>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          3. КАК МЫ ИСПОЛЬЗУЕМ ДАННЫЕ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Для предоставления функционала Сервиса</li>
            <li>Для формирования персональных AI-рекомендаций</li>
            <li>Для технической поддержки</li>
            <li>Данные не передаются третьим лицам без согласия пользователя</li>
          </ul>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          4. ХРАНЕНИЕ ДАННЫХ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            Данные хранятся на защищённых серверах Supabase (supabase.com).
            Передача данных осуществляется по протоколу HTTPS.
          </p>
          <p>
            Данные хранятся до момента удаления аккаунта Пользователем.
            После удаления аккаунта данные удаляются в течение 30 дней.
          </p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          5. ПРАВА ПОЛЬЗОВАТЕЛЯ
        </h2>
        <div className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>Пользователь вправе:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Запросить удаление своего аккаунта и всех связанных данных</li>
            <li>Получить копию своих персональных данных</li>
            <li>Отозвать согласие на обработку данных</li>
            <li>Подать жалобу в надзорный орган</li>
          </ul>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          6. КОНТАКТЫ
        </h2>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>По вопросам обработки данных обращайтесь:</p>
          <p>Email: vasya13nom@gmail.com</p>
          <p>ИНН самозанятого: 425307654609</p>
        </div>
      </div>
    </section>
  );
}
