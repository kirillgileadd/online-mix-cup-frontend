import { appSessionStore } from "../session.ts";
import { notifications } from "@mantine/notifications";
import { ROUTES } from "../routes.ts";
import { authorizedApiClient } from "./client.ts";

export type NotificationType = "lobby_created";

export interface NotificationPayload {
  type: NotificationType;
  data: {
    lobbyId: number;
    round: number;
    tournamentId: number;
    tournamentName: string;
    message: string;
  };
}

class NotificationService {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 секунды
  private heartbeatInterval: number | null = null;
  private isConnected = false;
  private notificationPermission: NotificationPermission = "default";
  private audioContext: AudioContext | null = null;
  private notificationSound: HTMLAudioElement | null = null;
  private cachedSettings: NotificationSettings | null = null;

  /**
   * Запрашивает разрешение на системные уведомления
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    if (this.notificationPermission === "granted") {
      return "granted";
    }

    if (this.notificationPermission === "denied") {
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  /**
   * Получает громкость из настроек (преобразует 1-10 в 0.1-1.0)
   */
  private getVolumeFromSettings(): number {
    // Если настройки закэшированы, используем их
    if (this.cachedSettings) {
      // Преобразуем 1-10 в 0.1-1.0
      return this.cachedSettings.notificationsVolume / 10;
    }
    // Значение по умолчанию (5 -> 0.5)
    return 0.5;
  }

  /**
   * Получает настройки уведомлений через API
   */
  private async fetchNotificationSettings(): Promise<NotificationSettings | null> {
    try {
      const settings = await getNotificationSettings();
      this.cachedSettings = settings;
      return settings;
    } catch (error) {
      console.warn("Failed to fetch notification settings:", error);
      return null;
    }
  }

  /**
   * Обновляет громкость звука на основе текущих настроек
   */
  private updateSoundVolume(): void {
    const volume = this.getVolumeFromSettings();
    if (this.notificationSound) {
      this.notificationSound.volume = volume;
    }
  }

  /**
   * Инициализирует звук уведомления (звук найденной игры из Dota 2)
   * Поддерживает форматы: mp3, ogg, wav
   * Файл должен быть размещен в public/dota2-match-found.{format}
   */
  private initNotificationSound(): void {
    if (this.notificationSound) {
      return;
    }

    try {
      // Пытаемся загрузить звук найденной игры из Dota 2
      // Поддерживаем разные форматы: mp3, ogg, wav
      const soundFormats = ["mp3", "ogg", "wav"];

      for (const format of soundFormats) {
        const audio = new Audio(`/dota2-match-found.${format}`);
        audio.volume = this.getVolumeFromSettings(); // Устанавливаем громкость из настроек
        audio.preload = "auto";

        // Проверяем, может ли браузер воспроизвести этот формат
        const canPlay = audio.canPlayType(`audio/${format}`);
        if (canPlay === "probably" || canPlay === "maybe") {
          this.notificationSound = audio;

          // Обработка ошибок загрузки
          audio.addEventListener("error", () => {
            console.warn(
              `Failed to load Dota 2 match found sound (${format}), trying next format`
            );
            if (this.notificationSound === audio) {
              this.notificationSound = null;
              // Пробуем следующий формат
              this.initNotificationSound();
            }
          });

          // Если загрузка успешна, останавливаем поиск
          audio.addEventListener("canplaythrough", () => {
            // Звук готов к воспроизведению
          });

          return;
        }
      }

      console.warn(
        "No supported audio format found for Dota 2 match found sound, using fallback"
      );
    } catch (error) {
      console.error("Failed to initialize notification sound:", error);
      this.notificationSound = null;
    }
  }

  /**
   * Воспроизводит звук уведомления
   */
  private async playNotificationSound(): Promise<void> {
    // Обновляем настройки перед воспроизведением, если они не загружены
    if (!this.cachedSettings) {
      await this.fetchNotificationSettings();
    }

    // Инициализируем звук при первом использовании
    this.initNotificationSound();

    // Обновляем громкость перед воспроизведением
    this.updateSoundVolume();

    try {
      // Пытаемся воспроизвести звук из файла
      if (this.notificationSound) {
        // Сбрасываем на начало для повторного воспроизведения
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch((error) => {
          console.error("Failed to play notification sound file:", error);
          // Fallback на синтезированный звук
          this.playFallbackSound();
        });
      } else {
        // Fallback на синтезированный звук, если файл не загружен
        this.playFallbackSound();
      }
    } catch (error) {
      console.error("Failed to play notification sound:", error);
      this.playFallbackSound();
    }
  }

  /**
   * Воспроизводит синтезированный звук как fallback
   */
  private playFallbackSound(): void {
    try {
      // Создаем простой звук через Web Audio API
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Настройки звука (короткий бип)
      oscillator.frequency.value = 800; // Частота в Гц
      oscillator.type = "sine";

      // Используем громкость из настроек
      const volume = this.getVolumeFromSettings();
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.2
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error("Failed to play fallback sound:", error);
    }
  }

  /**
   * Показывает системное уведомление (работает даже когда вкладка неактивна)
   */
  private showSystemNotification(
    title: string,
    message: string,
    onClick?: () => void
  ): void {
    if (this.notificationPermission !== "granted") {
      return;
    }

    try {
      const notification = new Notification(title, {
        body: message,
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        tag: "lobby-notification", // Тег для группировки уведомлений
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        if (onClick) {
          onClick();
        }
        notification.close();
      };

      // Автоматически закрываем уведомление через 10 секунд
      setTimeout(() => {
        notification.close();
      }, 10000);
    } catch (error) {
      console.error("Failed to show system notification:", error);
    }
  }

  /**
   * Проверяет и обновляет токен, если он истек
   * Использует axios interceptor для автоматического обновления токена
   * @returns true если токен был обновлен или был актуален, false если не удалось обновить
   */
  private async refreshTokenIfNeeded(): Promise<boolean> {
    const token = appSessionStore.getSessionToken();
    if (!token) {
      console.warn("No token available for refresh");
      return false;
    }

    // Проверяем, истек ли токен
    if (appSessionStore.isSessionExpired()) {
      console.log("Token expired, refreshing via axios interceptor...");
      try {
        // Выполняем запрос через authorizedApiClient
        // Interceptor автоматически обновит токен, если он истек
        // Используем любой endpoint, который требует авторизации
        await authorizedApiClient.get("/notifications/stream", {
          validateStatus: () => true, // Не выбрасываем ошибку, чтобы обработать через interceptor
        });
        console.log("Token refreshed successfully");
        return true;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return false;
      }
    }

    // Токен актуален
    return true;
  }

  /**
   * Подключается к SSE эндпоинту для получения уведомлений
   */
  async connect(): Promise<void> {
    const token = appSessionStore.getSessionToken();
    if (!token) {
      console.warn("Cannot connect to notifications: no token");
      return;
    }

    // Загружаем настройки при подключении
    await this.fetchNotificationSettings();

    // Запрашиваем разрешение на уведомления при первом подключении
    if (this.notificationPermission === "default") {
      this.requestPermission();
    }

    // Закрываем существующее подключение, если есть
    this.disconnect();

    const baseURL = import.meta.env.VITE_ENVOY_API_URL;
    // EventSource не поддерживает кастомные заголовки
    // Токен передается через cookies (withCredentials: true)
    const url = `${baseURL}/notifications/stream`;

    try {
      this.eventSource = new EventSource(url, {
        withCredentials: true,
      });

      this.eventSource.onopen = () => {
        console.log("SSE connection opened");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.eventSource.onmessage = async (event) => {
        try {
          const payload: NotificationPayload = JSON.parse(event.data);
          await this.handleNotification(payload);
        } catch (error) {
          console.error("Failed to parse notification:", error);
        }
      };

      // Обрабатываем специальные события (если сервер отправляет их)
      this.eventSource.addEventListener("heartbeat", () => {
        // Heartbeat обрабатывается автоматически
      });

      this.eventSource.onerror = async (error) => {
        console.error("SSE connection error:", error);
        this.isConnected = false;
        this.stopHeartbeat();

        // Проверяем состояние соединения
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          // Проверяем и обновляем токен, если он истек
          const tokenRefreshed = await this.refreshTokenIfNeeded();
          if (tokenRefreshed) {
            console.log("Token refreshed, reconnecting...");
          }
          this.handleReconnect();
        }
      };
    } catch (error) {
      console.error("Failed to create SSE connection:", error);
      this.handleReconnect();
    }
  }

  /**
   * Отключается от SSE эндпоинта
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * Обрабатывает полученное уведомление
   */
  private async handleNotification(
    payload: NotificationPayload
  ): Promise<void> {
    switch (payload.type) {
      case "lobby_created":
        await this.showLobbyCreatedNotification(payload);
        break;
      default:
        console.warn("Unknown notification type:", payload.type);
    }
  }

  /**
   * Показывает уведомление о создании лобби
   */
  private async showLobbyCreatedNotification(
    payload: NotificationPayload
  ): Promise<void> {
    const { data } = payload;
    const title = "🎮 Игра скоро начнется!";
    const message =
      data.message ||
      `Вы попали в лобби раунда ${data.round} турнира ${data.tournamentName}. Лобби #${data.lobbyId}`;

    const handleClick = () => {
      // Навигация к странице турнира
      window.location.href = ROUTES.publicTournament(data.tournamentId);
    };

    // Воспроизводим звук
    await this.playNotificationSound();

    // Показываем уведомление Mantine (в приложении)
    notifications.show({
      title,
      message,
      color: "blue",
      autoClose: 10000, // 10 секунд
      onClick: handleClick,
    });

    // Показываем системное уведомление (работает даже когда вкладка неактивна)
    this.showSystemNotification(title, message, handleClick);
  }

  /**
   * Обрабатывает переподключение при ошибке
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    this.reconnectTimeout = window.setTimeout(async () => {
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      // Проактивно обновляем токен перед переподключением
      await this.refreshTokenIfNeeded();
      await this.connect();
    }, delay);
  }

  /**
   * Запускает heartbeat для поддержания соединения
   */
  private startHeartbeat(): void {
    // Heartbeat обрабатывается автоматически через onmessage
    // Здесь можно добавить дополнительную логику, если нужно
  }

  /**
   * Останавливает heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Обновляет кэш настроек уведомлений
   * Вызывается после обновления настроек через форму
   */
  updateSettingsCache(settings: NotificationSettings): void {
    this.cachedSettings = settings;
    // Обновляем громкость звука, если он уже инициализирован
    this.updateSoundVolume();
  }

  /**
   * Проверяет, подключен ли сервис
   */
  get connected(): boolean {
    return (
      this.isConnected && this.eventSource?.readyState === EventSource.OPEN
    );
  }
}

export const notificationService = new NotificationService();

// Типы для настроек уведомлений
export interface NotificationSettings {
  id: number;
  userId: number;
  isTelegramNotifications: boolean;
  isSSENotifications: boolean;
  notificationsVolume: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsRequest {
  isTelegramNotifications?: boolean;
  isSSENotifications?: boolean;
  notificationsVolume?: number;
}

// API методы для настроек уведомлений
export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const response = await authorizedApiClient.get<NotificationSettings>(
      "/users/profile/notifications"
    );
    return response.data;
  };

export const updateNotificationSettings = async (
  data: UpdateNotificationSettingsRequest
): Promise<NotificationSettings> => {
  const response = await authorizedApiClient.patch<NotificationSettings>(
    "/users/profile/notifications",
    data
  );
  return response.data;
};
