import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
} from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { LoginPage } from "../pages/LoginPage.tsx";
import { App } from "./App.tsx";
import { TournamentPage } from "../pages/TournamentPage.tsx";
import { Lobby } from "../features/Lobby";
import { Header } from "./Header.tsx";
import { UserRole } from "../shared/types.ts";
import { useRole } from "../shared/authorization.tsx";
import { ROUTES } from "../shared/routes.ts";
import { UsersPage } from "../pages/UsersPage.tsx";
import { TournamentsPage } from "../pages/TournamentsPage.tsx";

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({
  children,
  roles: allowedRoles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) {
  const userRoles = useRole() || [];

  console.log(userRoles, "userRoles");

  const isAllowed =
    allowedRoles.length === 0 ||
    allowedRoles.some((r) => userRoles.includes(r));

  if (isAllowed) {
    return <>{children}</>;
  }

  return <Navigate to={ROUTES.forbidden} replace />;
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        loader: () => {
          return redirect("/tournament");
        },
      },
      {
        element: (
          <div>
            <Header />
            <Outlet />
          </div>
        ),
        loader: () => {
          if (!appSessionStore.getSessionToken()) {
            return redirect(ROUTES.login);
          }
          return null;
        },
        children: [
          { path: "/tournament", element: <TournamentPage /> },
          { path: "/lobbies", element: <Lobby /> },
          {
            path: ROUTES.adminUsers,
            element: (
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <UsersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.adminTournaments,
            element: (
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <TournamentsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        loader: () => {
          if (appSessionStore.getSessionToken()) {
            return redirect("/tournament");
          }
          return null;
        },
        children: [{ path: ROUTES.login, element: <LoginPage /> }],
      },
    ],
  },
]);

appSessionStore.updateSessionSteam.listen((event) => {
  if (event.type === "remove") {
    router.navigate(ROUTES.login);
  }
});
