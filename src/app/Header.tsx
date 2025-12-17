import { Link, useLocation } from "react-router-dom";
import { appSessionStore } from "../shared/session.ts";
import { Button, Container, Drawer, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { ROUTES } from "../shared/routes.ts";
import clsx from "clsx";
import { IconSend, IconMenu2 } from "@tabler/icons-react";
import { UserAvatarMenu } from "../widgets/UserAvatarMenu";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const session = appSessionStore.useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getHeaderStyles = () => {
    const pathname = location.pathname;

    if (pathname === ROUTES.publicTournaments) {
      return "transparent border-none";
    }

    if (pathname.startsWith("/tournaments/") && pathname !== "/tournaments/") {
      return "border-none";
    }

    if (pathname === ROUTES.aboutTournament) {
      return "transparent border-none absolute top-0 left-0 right-0 z-50";
    }

    if (pathname === ROUTES.regulation) {
      return "transparent border-none absolute top-0 left-0 right-0 z-50";
    }

    return "bg-dark-800 border-b border-dark-600 shadow";
  };

  const telegramBotUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "mixifycup_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}`;

  const handleLinkClick = () => {
    close();
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > minSwipeDistance;
    if (isDownSwipe) {
      close();
    }
  };

  const getLinkClassName = (isMobile: boolean) =>
    isMobile
      ? "text-dark-100 hover:text-dark-50 transition-colors block py-2"
      : "text-dark-100 hover:text-dark-50 transition-colors";

  const navigationLinks = (isMobile = false) => (
    <>
      <Link
        to={ROUTES.leaderboard}
        onClick={isMobile ? handleLinkClick : undefined}
        className={getLinkClassName(isMobile)}
      >
        Лидерборд
      </Link>
      <Link
        to={ROUTES.aboutTournament}
        onClick={isMobile ? handleLinkClick : undefined}
        className={getLinkClassName(isMobile)}
      >
        О турнире
      </Link>
      <Link
        to={ROUTES.regulation}
        onClick={isMobile ? handleLinkClick : undefined}
        className={getLinkClassName(isMobile)}
      >
        Регламент
      </Link>
    </>
  );

  const mobileAdditionalButtons = (
    <Button
      component="a"
      href={telegramBotUrl}
      target="_blank"
      rel="noopener noreferrer"
      leftSection={<IconSend size={16} />}
      color="blue"
      fullWidth
      className="mt-4"
    >
      Подать заявку
    </Button>
  );

  return (
    <>
      <header className={clsx("", getHeaderStyles())}>
        <Container size="xl" className="mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              {!isDesktop && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={open}
                  className="text-white"
                  size="lg"
                >
                  <IconMenu2 size={24} />
                </ActionIcon>
              )}
              <div className="shrink-0 flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src="/favicon.svg"
                    alt="Mixify Cup"
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-bold text-white">Mixify</span>
                </Link>
              </div>

              {isDesktop && (
                <nav className="flex gap-4">{navigationLinks(false)}</nav>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isDesktop && (
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
              )}
              {session ? (
                <UserAvatarMenu session={session} />
              ) : (
                <Link to={ROUTES.login}>
                  <Button variant="light">Войти</Button>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </header>

      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="80%"
        title={
          <div className="flex items-center w-full">
            <span className="text-white text-lg font-semibold">Меню</span>
          </div>
        }
        classNames={{
          content: "bg-dark-900 rounded-t-2xl relative",
          header: "bg-dark-900 border-b border-white/10",
          body: "p-6",
        }}
      >
        {/* Полоска для свайпа */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-50 flex justify-center cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-20 h-1.5 bg-white/30 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          {navigationLinks(true)}
          {mobileAdditionalButtons}
        </div>
      </Drawer>
    </>
  );
}
