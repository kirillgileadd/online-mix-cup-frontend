import { Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { Header } from "./Header";

export function App() {
  return (
    <LoadingScreen>
      <main className="min-h-screen">
        <Header />
        <Outlet />
      </main>
    </LoadingScreen>
  );
}
