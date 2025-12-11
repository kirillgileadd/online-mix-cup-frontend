import { Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export function App() {
  return (
    <LoadingScreen>
      <main className="min-h-screen">
        <Outlet />
      </main>
    </LoadingScreen>
  );
}
