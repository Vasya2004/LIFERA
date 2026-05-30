import { jsonError } from "@/lib/api/response";

const GENERIC_BY_STATUS: Record<number, string> = {
  400: "Не удалось выполнить запрос. Проверьте данные и попробуйте снова.",
  401: "Требуется вход в аккаунт.",
  403: "Недостаточно прав для этого действия.",
  404: "Запись не найдена.",
  422: "Проверьте введённые данные.",
  500: "Внутренняя ошибка сервера. Попробуйте позже.",
  503: "Сервис временно недоступен. Попробуйте позже.",
};

export function logApiError(context: string, error: unknown) {
  console.error(`[api:${context}]`, error);
}

export function isUserFacingMessage(message: string) {
  return /[а-яА-ЯёЁ]/.test(message);
}

export function genericErrorMessage(status: number) {
  return GENERIC_BY_STATUS[status] ?? GENERIC_BY_STATUS[500];
}

export function jsonSafeError(
  context: string,
  error: unknown,
  status = 500,
  fallbackMessage?: string,
) {
  logApiError(context, error);

  if (fallbackMessage) {
    return jsonError(fallbackMessage, status);
  }

  if (error instanceof Error && isUserFacingMessage(error.message)) {
    return jsonError(error.message, status);
  }

  return jsonError(genericErrorMessage(status), status);
}

export function jsonSupabaseError(
  context: string,
  error: { message: string } | null,
  status = 500,
  userMessage?: string,
) {
  if (error) {
    logApiError(context, error);
  }

  return jsonError(userMessage ?? genericErrorMessage(status), status);
}
