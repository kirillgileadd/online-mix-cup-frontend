/**
 * Обрабатывает URL фото: если начинается с https - использует как есть,
 * иначе добавляет базовый URL API
 * @param photoUrl - URL фото (может быть относительным или абсолютным)
 * @returns Обработанный URL или undefined, если photoUrl не передан
 */
export function getPhotoUrl(photoUrl: string | null | undefined): string | undefined {
  if (!photoUrl) {
    return undefined;
  }

  // Если начинается с https - используем как есть
  if (photoUrl.startsWith("https://")) {
    return photoUrl;
  }

  // Если начинается с /uploads или другой относительный путь - добавляем базовый URL API
  const baseUrl = import.meta.env.VITE_ENVOY_API_URL || "";
  return `${baseUrl}${photoUrl}`;
}

