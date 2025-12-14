import { type FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Center, Loader, LoadingOverlay } from "@mantine/core";
import type { TwitchEmbedInstance } from "../../global";

type TwitchEmbedProps = {
  channel: string;
  className?: string;
};

export const TwitchEmbed: FC<TwitchEmbedProps> = ({ channel, className }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const embedInstanceRef = useRef<TwitchEmbedInstance | null>(null);
  const embedIdRef = useRef(
    `twitch-embed-${Math.random().toString(36).substr(2, 9)}`
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!embedRef.current || !channel) return;

    const embedId = embedIdRef.current;

    const loadTwitchEmbed = () => {
      if (!window.Twitch?.Embed) {
        // Проверяем, не загружается ли скрипт уже
        const existingScript = document.querySelector(
          'script[src="https://embed.twitch.tv/embed/v1.js"]'
        );
        if (existingScript) {
          // Если скрипт уже загружается, ждем его загрузки
          existingScript.addEventListener("load", () => {
            initializeEmbed();
          });
          return;
        }

        const script = document.createElement("script");
        script.src = "https://embed.twitch.tv/embed/v1.js";
        script.async = true;
        script.onload = () => {
          initializeEmbed();
        };
        script.onerror = () => {
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } else {
        initializeEmbed();
      }
    };

    const initializeEmbed = () => {
      if (!window.Twitch?.Embed || !embedRef.current) {
        setIsLoading(false);
        return;
      }

      // Полностью очищаем предыдущий инстанс и все дочерние элементы
      if (embedRef.current) {
        // Удаляем все iframe элементы, которые могли остаться
        const iframes = embedRef.current.querySelectorAll("iframe");
        iframes.forEach((iframe) => iframe.remove());
        embedRef.current.innerHTML = "";
      }
      embedInstanceRef.current = null;

      // Проверяем, не существует ли уже элемент с таким ID
      const existingElement = document.getElementById(embedId);
      if (existingElement && existingElement !== embedRef.current) {
        existingElement.remove();
      }

      // Устанавливаем ID для элемента
      embedRef.current.id = embedId;

      try {
        // Создаем новый инстанс
        embedInstanceRef.current = new window.Twitch.Embed(embedId, {
          width: "100%",
          height: "100%",
          channel: channel,
          parent: [window.location.hostname],
          layout: "video",
          autoplay: false,
          muted: false,
        });

        // Слушаем событие готовности плеера
        embedInstanceRef.current.addEventListener("ready", () => {
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error initializing Twitch embed:", error);
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadTwitchEmbed();

    return () => {
      // Полная очистка при размонтировании
      if (embedRef.current) {
        embedRef.current.innerHTML = "";
        embedRef.current.removeAttribute("id");
      }
      embedInstanceRef.current = null;
      setIsLoading(true);
    };
  }, [channel]);

  return (
    <div
      className={clsx("w-full relative overflow-hidden rounded-lg", className)}
      style={{ aspectRatio: "16/9" }}
    >
      {isLoading && (
        <LoadingOverlay visible={isLoading}>
          <div className="absolute inset-0 flex items-center justify-center bg-dark-800 rounded-lg z-10">
            <Center>
              <Loader size="lg" />
            </Center>
          </div>
        </LoadingOverlay>
      )}
      <div
        ref={embedRef}
        id={embedIdRef.current}
        className={clsx(
          "w-full h-full rounded-lg overflow-hidden",
          isLoading && "opacity-0"
        )}
      />
    </div>
  );
};
