import { Link, useLocation } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { Button, Container } from "@mantine/core";
import { AppCan } from "../shared/authorization.tsx";
import { ROUTES } from "../shared/routes.ts";
import clsx from "clsx";
import { IconSend } from "@tabler/icons-react";
import { UserAvatarMenu } from "../widgets/UserAvatarMenu";

export function Header() {
  const location = useLocation();
  const session = appSessionStore.useSession();

  const getHeaderStyles = () => {
    const pathname = location.pathname;

    if (pathname === ROUTES.publicTournaments) {
      return "transparent border-none";
    }

    if (pathname.startsWith("/tournaments/") && pathname !== "/tournaments/") {
      return "border-none";
    }

    return "bg-dark-800 border-b border-dark-600 shadow";
  };

  const telegramBotUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "mixifycup_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}`;

  return (
    <header className={clsx("", getHeaderStyles())}>
      <Container size="xl" className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-10">
            <div className="shrink-0 flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <img src="/favicon.svg" alt="Mixify Cup" className="h-8 w-8" />
                <span className="text-xl font-bold text-white">Mixify</span>
              </Link>
            </div>

            <nav className="flex gap-4">
              <AppCan action={(permissions) => permissions.users.canManage()}>
                <Link
                  to={ROUTES.adminUsers}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Пользаки
                </Link>
              </AppCan>
              <AppCan action={(permissions) => permissions.users.canManage()}>
                <Link
                  to={ROUTES.adminTournaments}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Турниры
                </Link>
              </AppCan>
              <AppCan action={(permissions) => permissions.users.canManage()}>
                <Link
                  to={ROUTES.adminApplications}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Заявки
                </Link>
              </AppCan>
              <AppCan action={(permissions) => permissions.users.canManage()}>
                <Link
                  to={ROUTES.adminPlayers}
                  className="text-dark-100 hover:text-dark-50 transition-colors"
                >
                  Игроки
                </Link>
              </AppCan>
              <Link
                to={ROUTES.leaderboard}
                className="text-dark-100 hover:text-dark-50 transition-colors"
              >
                Лидерборд
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex items-center flex-wrap gap-2">
              <Button
                component="a"
                href={telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconSend size={16} />}
                color="blue"
              >
                Подать заявку
              </Button>
              {session ? (
                <UserAvatarMenu session={session} />
              ) : (
                <Link to={ROUTES.login}>
                  <Button variant="light">Войти</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
