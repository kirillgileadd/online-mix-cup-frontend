import { useEffect, useRef } from "react";
import { notificationService } from "../api/notifications.ts";
import { appSessionStore } from "../session.ts";

/**
 * Хук для управления SSE подключением к уведомлениям
 * Автоматически подключается при авторизации и отключается при выходе
 */
export function useNotifications() {
  const isConnectedRef = useRef(false);

  useEffect(() => {
    const session = appSessionStore.getSession();

    // Подключаемся только если пользователь авторизован
    if (session && !isConnectedRef.current) {
      notificationService.connect().catch((error) => {
        console.error("Failed to connect to notifications:", error);
      });
      isConnectedRef.current = true;
    }

    // Отключаемся при размонтировании или выходе
    return () => {
      if (isConnectedRef.current) {
        notificationService.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, []);

  // Слушаем изменения сессии
  useEffect(() => {
    const unsubscribe = appSessionStore.updateSessionSteam.listen((event) => {
      if (event.type === "update") {
        // Пользователь авторизовался - подключаемся
        if (!isConnectedRef.current) {
          notificationService.connect().catch((error) => {
            console.error("Failed to connect to notifications:", error);
          });
          isConnectedRef.current = true;
        }
      } else if (event.type === "remove") {
        // Пользователь вышел - отключаемся
        if (isConnectedRef.current) {
          notificationService.disconnect();
          isConnectedRef.current = false;
        }
      }
    });

    return unsubscribe;
  }, []);

  return {
    connected: notificationService.connected,
    connect: () => {
      notificationService.connect().catch((error) => {
        console.error("Failed to connect to notifications:", error);
      });
      isConnectedRef.current = true;
    },
    disconnect: () => {
      notificationService.disconnect();
      isConnectedRef.current = false;
    },
  };
}
