import clsx from "clsx";
import type { FC } from "react";
import { useEffect } from "react";
import { appSessionStore } from "../shared/session.ts";
import { useNavigate } from "react-router-dom";
import {
  devLogin,
  loginByTelegram,
  type TelegramUser,
} from "../shared/api/auth.ts";
import { Button, Card } from "@mantine/core";
import { ROUTES } from "../shared/routes.ts";
import { useMutation } from "@tanstack/react-query";

type LoginPageProps = {
  className?: string;
};

export const LoginPage: FC<LoginPageProps> = ({ className }) => {
  const navigate = useNavigate();

  appSessionStore.updateSessionSteam.useEvent(() => {
    if (event?.type === "update") {
      navigate(ROUTES.publicTournaments);
    }
  });

  const devLoginMutation = useMutation({
    mutationFn: devLogin,
    onSuccess: () => {
      navigate(ROUTES.publicTournaments);
    },
    onError: () => {
      // Dev login failed
    },
  });

  const botName = import.meta.env.VITE_TELEGRAM_BOT_USERNAME as
    | string
    | undefined;

  useEffect(() => {
    if (!botName) {
      return;
    }

    window.TelegramOnAuthCb = async (user: TelegramUser) => {
      try {
        await loginByTelegram(user);
        navigate(ROUTES.publicTournaments);
      } catch {
        // Telegram login failed
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramOnAuthCb(user)");
    script.setAttribute("data-lang", "ru");

    script.onload = () => {
      // [TG] widget script loaded
    };
    script.onerror = () => {
      // [TG] widget script error
    };

    const container = document.getElementById("tg-login-container");
    container?.appendChild(script);

    return () => {
      window.TelegramOnAuthCb = undefined;
      script.remove();
    };
  }, [botName]);

  return (
    <div className={clsx("flex justify-center items-center mt-20", className)}>
      <Card>
        <p className="text-xl mb-4 text-center block">Войдите в аккаунт</p>
        <div id="tg-login-container" />
        {import.meta.env.VITE_NODE_ENV === "development" && (
          <Button
            type="button"
            onClick={() => devLoginMutation.mutate()}
            loading={devLoginMutation.isPending}
            fullWidth
            mt="md"
          >
            Тестовый вход
          </Button>
        )}
      </Card>
    </div>
  );
};
