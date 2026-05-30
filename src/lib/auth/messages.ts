const authErrorMap: Array<{ match: RegExp; message: string }> = [
  {
    match: /invalid login credentials/i,
    message: "Неверный email или пароль.",
  },
  {
    match: /email not confirmed/i,
    message: "Подтвердите email, затем войдите в аккаунт.",
  },
  {
    match: /user already registered/i,
    message: "Пользователь с таким email уже зарегистрирован. Войдите в аккаунт.",
  },
  {
    match: /password should be at least/i,
    message: "Пароль должен быть не короче 8 символов.",
  },
  {
    match: /unable to validate email/i,
    message: "Проверьте корректность email.",
  },
];

export function mapAuthErrorMessage(message: string): string {
  const mapped = authErrorMap.find((item) => item.match.test(message));
  if (mapped) {
    return mapped.message;
  }

  if (/[а-яА-ЯёЁ]/.test(message)) {
    return message;
  }

  return "Проверьте введённые данные и попробуйте ещё раз.";
}
