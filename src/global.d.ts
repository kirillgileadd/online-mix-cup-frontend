import type { TelegramUser } from "./shared/api/auth";

// Типы для Twitch Embed API
export type TwitchEmbedInstance = {
  addEventListener: (event: string, callback: () => void) => void;
  getPlayer: () => unknown;
  setChannel: (channel: string) => void;
  setVideo: (videoId: string, timestamp?: number) => void;
};

declare global {
  interface Window {
    TelegramOnAuthCb?: (user: TelegramUser) => Promise<void>;
    Twitch?: {
      Embed: new (
        embedId: string,
        options: {
          width: string | number;
          height: string | number;
          channel: string;
          parent: string[];
          layout?: string;
          autoplay?: boolean;
          muted?: boolean;
        }
      ) => TwitchEmbedInstance;
    };
  }
}

export {};
