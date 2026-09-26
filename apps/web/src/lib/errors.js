export function getQueryErrorInfo(error) {
  const code = error?.code || error?.cause?.code;
  const message = error?.message || error?.cause?.message || '';
  const lower = message.toLowerCase();

  if (
    code === 'PGRST205'
    || lower.includes('could not find the table')
    || lower.includes('schema cache')
  ) {
    return {
      title: 'База ещё не настроена',
      message:
        'В Supabase нет таблиц архива. Выполни SQL из supabase/migrations, затем нажми «Повторить».',
      setup: true,
    };
  }

  if (code === '42501' || lower.includes('row-level security') || lower.includes('permission denied')) {
    return {
      title: 'Нет доступа',
      message: 'Недостаточно прав для чтения данных. Проверь, что ты вошёл в аккаунт.',
      setup: false,
    };
  }

  if (
    lower.includes('failed to fetch')
    || lower.includes('network')
    || lower.includes('превышено время ожидания')
    || lower.includes('timeout')
  ) {
    return {
      title: 'Нет соединения',
      message: 'Не удалось связаться с Supabase. Проверь интернет и ключи в .env.local.',
      setup: false,
    };
  }

  if (lower.includes('supabase не настроен') || lower.includes('not configured')) {
    return {
      title: 'Supabase не настроен',
      message: 'Добавь NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local.',
      setup: true,
    };
  }

  return {
    title: 'Ошибка',
    message: message || 'Не удалось загрузить данные',
    setup: false,
  };
}
