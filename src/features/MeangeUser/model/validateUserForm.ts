import type { UserFormValues } from "./types";

/**
 * Очищает значения формы от пустых строк и обрезает пробелы.
 * Возвращает объект только с заполненными полями.
 */
export const validateUserForm = (
  userData: UserFormValues
): {
  telegramId: string;
  username?: string;
  nickname?: string;
  photoUrl?: string;
  discordUsername?: string;
  steamId64?: string;
  roles: string[];
} => {
  const result: {
    telegramId: string;
    username?: string;
    nickname?: string;
    photoUrl?: string;
    discordUsername?: string;
    steamId64?: string;
    roles: string[];
  } = {
    telegramId: userData.telegramId.trim(),
    roles: userData.roles,
  };

  if (userData.username?.trim()) {
    result.username = userData.username.trim();
  }
  if (userData.nickname?.trim()) {
    result.nickname = userData.nickname.trim();
  }
  if (userData.photoUrl?.trim()) {
    result.photoUrl = userData.photoUrl.trim();
  }
  if (userData.discordUsername?.trim()) {
    result.discordUsername = userData.discordUsername.trim();
  }
  if (userData.steamProfileLink?.trim()) {
    result.steamId64 = userData.steamProfileLink.trim();
  }

  return result;
};
