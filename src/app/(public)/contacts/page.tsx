export default function ContactsPage() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold text-foreground">
          КОНТАКТЫ И РЕКВИЗИТЫ
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lifera — платформа для управления целями и личной продуктивностью
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          https://lifera.app
        </p>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          ИСПОЛНИТЕЛЬ
        </h2>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>Самозанятый гражданин</p>
          <p>ИНН: 425307654609</p>
          <p>Email: vasya13nom@gmail.com</p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          ПОДДЕРЖКА
        </h2>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>По всем вопросам пишите на vasya13nom@gmail.com</p>
          <p>Время ответа: в течение 24 часов в рабочие дни.</p>
        </div>

        <h2 className="mt-8 mb-2 text-base font-semibold text-foreground">
          КАК ПОЛУЧИТЬ УСЛУГУ ПОСЛЕ ОПЛАТЫ
        </h2>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          <p>
            После успешной оплаты подписка активируется автоматически.
            Доступ к расширенным функциям открывается мгновенно в вашем
            аккаунте на https://lifera.app
          </p>
        </div>
      </div>
    </section>
  );
}
