import type { ProfileFormValues } from "./types";
import { fileToBase64 } from "../../../shared/utils/fileToBase64";

/**
 * Очищает значения формы от пустых строк и обрезает пробелы.
 * Конвертирует File в base64 строку.
 * Возвращает объект только с заполненными полями.
 */
export const validateProfileForm = async (
  profileData: ProfileFormValues
): Promise<{
  nickname?: string | null;
  discordUsername?: string | null;
  photoBase64?: string | null;
}> => {
  const result: {
    nickname?: string | null;
    discordUsername?: string | null;
    photoBase64?: string | null;
  } = {};

  if (
    profileData.nickname !== undefined &&
    profileData.nickname !== null &&
    profileData.nickname.trim() !== ""
  ) {
    result.nickname = profileData.nickname.trim();
  } else {
    result.nickname = null;
  }

  if (
    profileData.discordUsername !== undefined &&
    profileData.discordUsername !== null &&
    profileData.discordUsername.trim() !== ""
  ) {
    result.discordUsername = profileData.discordUsername.trim();
  } else {
    result.discordUsername = null;
  }

  if (
    profileData.photoBase64 !== undefined &&
    profileData.photoBase64 !== null
  ) {
    result.photoBase64 = await fileToBase64(profileData.photoBase64);
  } else {
    result.photoBase64 = null;
  }

  return result;
};

