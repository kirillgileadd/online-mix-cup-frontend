import { useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { logout } from "../shared/api/auth.ts";
import { Button } from "@mantine/core";
import { AppCan } from "../shared/authorization.tsx";
import { ROUTES } from "../shared/routes.ts";

export function Header() {
  const navigate = useNavigate();
  const session = appSessionStore.useSession();

  const [isTransitioning, startTransition] = useTransition();

  const handleLogout = () =>
    startTransition(async () => {
      await logout();
      navigate("/login");
    });

  if (!session) return;

  return (
    <header className="bg-dark-400 shadow">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-10">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-dark-50">
                Mixify
              </Link>
            </div>
            <AppCan action={(permissions) => permissions.users.canManage()}>
              <nav className="flex gap-4">
                <Link
                  to={ROUTES.adminUsers}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Пользаки
                </Link>
                <Link
                  to={ROUTES.adminTournaments}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Турниры
                </Link>
                <Link
                  to={ROUTES.adminApplications}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Заявки
                </Link>
                <Link
                  to={ROUTES.adminPlayers}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Игроки
                </Link>
              </nav>
            </AppCan>
          </div>
          <div className="flex items-center">
            <div className="shrink-0 flex items-center gap-2">
              {session?.photoUrl && (
                <img
                  src={session.photoUrl}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="avatar"
                />
              )}
              <span className="mr-4 text-dark-50">{session.username}</span>
            </div>
            <Button onClick={handleLogout} disabled={isTransitioning}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
