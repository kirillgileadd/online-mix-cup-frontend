import type { UseFormSetError } from "react-hook-form";
import type { TournamentFormValues } from "./types";

/**
 * Формат ошибки валидации с бэкенда
 */
export interface ValidationErrorResponse {
  message?: string;
  data?: Record<string, string[]>;
}

/**
 * Обрабатывает ошибки валидации с бэкенда и устанавливает их в react-hook-form
 * @param error - Ошибка от axios или другой источник
 * @param setError - Функция setError из react-hook-form
 */
export const handleValidationErrors = (
  error: unknown,
  setError: UseFormSetError<TournamentFormValues>
): void => {
  // Проверяем, является ли это axios ошибкой
  const axiosError = error as {
    response?: {
      data?: ValidationErrorResponse;
      status?: number;
    };
    isAxiosError?: boolean;
  };

  // Проверяем, является ли это прямой ошибкой валидации
  const validationError = error as ValidationErrorResponse;

  // Извлекаем data из ошибки
  // Для axios ошибок: error.response.data.data
  // Для прямых ошибок: error.data
  const errorData =
    axiosError.response?.data?.data ||
    validationError.data ||
    (axiosError.response?.data as ValidationErrorResponse)?.data;

  if (!errorData) {
    return;
  }

  // Устанавливаем ошибки для каждого поля
  Object.entries(errorData).forEach(([field, messages]) => {
    const fieldName = field as keyof TournamentFormValues;
    const message = Array.isArray(messages) ? messages[0] : messages;

    if (message) {
      setError(fieldName, {
        type: "server",
        message: message,
      });
    }
  });
};

