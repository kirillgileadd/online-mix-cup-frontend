import type { User } from "../../../entitity/User";
import type { ProfileFormValues } from "./types";

/**
 * Сравнивает текущие значения профиля с новыми и возвращает только измененные поля
 */
export const getChangedFields = async (
  currentProfile: User,
  newValues: ProfileFormValues,
  fileToBase64?: (file: File) => Promise<string>
): Promise<{
  nickname?: string | null;
  discordUsername?: string | null;
  photoBase64?: string | null;
}> => {
  const changed: {
    nickname?: string | null;
    discordUsername?: string | null;
    photoBase64?: string | null;
  } = {};

  // Проверяем nickname
  const newNickname =
    newValues.nickname !== undefined && newValues.nickname !== null
      ? newValues.nickname.trim() || null
      : null;
  const currentNickname = currentProfile.nickname ?? null;

  if (newNickname !== currentNickname) {
    changed.nickname = newNickname;
  }

  // Проверяем discordUsername
  const newDiscordUsername =
    newValues.discordUsername !== undefined &&
    newValues.discordUsername !== null
      ? newValues.discordUsername.trim() || null
      : null;
  const currentDiscordUsername = currentProfile.discordUsername ?? null;

  if (newDiscordUsername !== currentDiscordUsername) {
    changed.discordUsername = newDiscordUsername;
  }

  // Проверяем фото (если загружено новое)
  if (newValues.photoBase64 !== undefined && newValues.photoBase64 !== null) {
    if (fileToBase64) {
      changed.photoBase64 = await fileToBase64(newValues.photoBase64);
    } else {
      // Если fileToBase64 не передан, используем встроенную функцию
      const { fileToBase64: defaultFileToBase64 } = await import(
        "../../../shared/utils/fileToBase64"
      );
      changed.photoBase64 = await defaultFileToBase64(newValues.photoBase64);
    }
  }

  return changed;
};

