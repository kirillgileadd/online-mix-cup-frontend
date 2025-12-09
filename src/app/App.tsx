import { Outlet } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export function App() {
  return (
    <LoadingScreen>
      <div className="min-h-screen">
        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </LoadingScreen>
  );
}
