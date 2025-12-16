import { Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { Header } from "./Header";
import { useNotifications } from "../shared/hooks/useNotifications.ts";

export function App() {
  // Подключаемся к уведомлениям при авторизации
  useNotifications();

  return (
    <LoadingScreen>
      <main className="min-h-screen">
        <Header />
        <Outlet />
      </main>
    </LoadingScreen>
  );
}
