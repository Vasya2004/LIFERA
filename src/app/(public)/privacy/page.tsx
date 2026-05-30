export default function PrivacyPage() {
  return (
    <section className="prose prose-neutral max-w-3xl dark:prose-invert">
      <h1>Политика конфиденциальности</h1>
      <p>
        Lifera хранит пользовательские цели, челленджи, прогресс, XP и настройки
        в Supabase PostgreSQL с Row Level Security. Доступ к данным ограничен
        владельцем аккаунта.
      </p>
      <p>
        Health и finance данные считаются чувствительными и не передаются во
        внешние AI-провайдеры без отдельного сценария и согласия пользователя.
      </p>
    </section>
  );
}

