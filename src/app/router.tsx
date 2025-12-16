import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { LoginPage } from "../pages/LoginPage.tsx";
import { App } from "./App.tsx";
import { UserRole } from "../shared/types.ts";
import { useRole } from "../shared/authorization.tsx";
import { ROUTES } from "../shared/routes.ts";
import { UsersPage } from "../pages/UsersPage.tsx";
import { TournamentsPage } from "../pages/TournamentsPage.tsx";
import { ApplicationsPage } from "../pages/ApplicationsPage.tsx";
import { PlayersPage } from "../pages/PlayersPage.tsx";
import { PublicTournamentsPage } from "../pages/PublicTournamentsPage.tsx";
import { PublicTournamentPage } from "../pages/PublicTournamentPage.tsx";
import { AdminTournamentPage } from "../pages/AdminTournamentPage.tsx";
import { ForbiddenPage } from "../pages/ForbiddenPage.tsx";
import { NotFoundPage } from "../pages/NotFoundPage.tsx";
import { LeaderboardPage } from "../pages/LeaderboardPage.tsx";
import { ProfilePage } from "../pages/ProfilePage.tsx";
import { AboutTournamentPage } from "../pages/AboutTournamentPage.tsx";
import { RegulationPage } from "../pages/RegulationPage.tsx";

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({
  children,
  roles: allowedRoles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) {
  const userRoles = useRole() || [];

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
          return redirect(ROUTES.publicTournaments);
        },
      },
      {
        path: ROUTES.publicTournaments,
        element: <PublicTournamentsPage />,
      },
      {
        path: "/tournaments/:id",
        element: <PublicTournamentPage />,
      },
      {
        path: ROUTES.leaderboard,
        element: <LeaderboardPage />,
      },
      {
        path: ROUTES.aboutTournament,
        element: <AboutTournamentPage />,
      },
      {
        path: ROUTES.regulation,
        element: <RegulationPage />,
      },
      {
        loader: () => {
          if (!appSessionStore.getSessionToken()) {
            return redirect(ROUTES.login);
          }
          return null;
        },
        children: [
          {
            path: ROUTES.profile,
            element: <ProfilePage />,
          },
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
          {
            path: "/admin/tournaments/:id",
            element: (
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AdminTournamentPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.adminApplications,
            element: (
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <ApplicationsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.adminPlayers,
            element: (
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <PlayersPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        loader: () => {
          if (appSessionStore.getSessionToken()) {
            return redirect(ROUTES.publicTournaments);
          }
          return null;
        },
        children: [{ path: ROUTES.login, element: <LoginPage /> }],
      },
      {
        path: ROUTES.forbidden,
        element: <ForbiddenPage />,
      },
      {
        path: ROUTES.notFound,
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

appSessionStore.updateSessionSteam.listen((event) => {
  if (event.type === "remove") {
    router.navigate(ROUTES.login);
  }
});
