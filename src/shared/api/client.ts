import axios from "axios";
import { notifications } from "@mantine/notifications";
import { appSessionStore } from "../session.ts";

let refreshPromise: Promise<string | null> | null = null;

const getRefreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const result = await publicApiClient.post<{ accessToken: string }>(
          "/auth/refresh"
        );
        appSessionStore.setSessionToken(result.data.accessToken);
        return result.data.accessToken;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        appSessionStore.removeSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

export const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_ENVOY_API_URL,
  withCredentials: true,
});

export const authorizedApiClient = axios.create({
  baseURL: import.meta.env.VITE_ENVOY_API_URL,
  withCredentials: true,
});

authorizedApiClient.interceptors.request.use(async (config) => {
  let token = appSessionStore.getSessionToken();

  if (!token || appSessionStore.isSessionExpired()) {
    token = await getRefreshToken();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authorizedApiClient.interceptors.response.use(
  (config) => config,
  async (error) => {
    const request = error.config;
    if (error.response?.status === 401) {
      const token = appSessionStore.getSessionToken();

      if (token) {
        const newToken = await getRefreshToken();
        if (newToken) {
          return authorizedApiClient.request(request);
        }
      }
      appSessionStore.removeSession();
    } else {
      // Обрабатываем ошибки, кроме 401
      handleApiError(error);
    }
    // Пробрасываем оригинальную ошибку, чтобы сохранить структуру axios ошибки
    throw error;
  }
);

// Обработчик ошибок для publicApiClient
publicApiClient.interceptors.response.use(
  (config) => config,
  async (error) => {
    handleApiError(error);
    throw error;
  }
);

/**
 * Обрабатывает ошибки API и показывает уведомления
 * @param error - Ошибка от axios
 */
const handleApiError = (error: unknown) => {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        data?: unknown;
      };
      status?: number;
    };
  };

  const errorData = axiosError.response?.data;

  // Извлекаем message из ошибки
  const message = errorData?.message;

  // Показываем уведомление только если есть message и это не ошибка валидации
  // (ошибки валидации имеют data и обрабатываются отдельно в формах)
  if (message && !errorData?.data) {
    notifications.show({
      title: "Ошибка",
      message: message,
      color: "red",
    });
  }
};
