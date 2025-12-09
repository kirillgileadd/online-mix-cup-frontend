import type { TournamentFormValues } from "./types";
import { fileToBase64 } from "../../../shared/utils/fileToBase64";

/**
 * Очищает значения формы от пустых строк и обрезает пробелы.
 * Конвертирует File в base64 строку.
 * Возвращает объект только с заполненными полями.
 */
export const validateTournamentForm = async (
  tournamentData: TournamentFormValues
): Promise<{
  name: string;
  eventDate?: string | null;
  price: number;
  prizePool?: number | null;
  previewImageBase64?: string | null;
}> => {
  const result: {
    name: string;
    eventDate?: string | null;
    price: number;
    prizePool?: number | null;
    previewImageBase64?: string | null;
  } = {
    name: tournamentData.name.trim(),
    price: tournamentData.price,
  };

  if (
    tournamentData.eventDate !== undefined &&
    tournamentData.eventDate !== null
  ) {
    result.eventDate = tournamentData.eventDate;
  }
  if (
    tournamentData.prizePool !== undefined &&
    tournamentData.prizePool !== null
  ) {
    result.prizePool = tournamentData.prizePool;
  }
  if (
    tournamentData.previewImageBase64 !== undefined &&
    tournamentData.previewImageBase64 !== null
  ) {
    result.previewImageBase64 = await fileToBase64(tournamentData.previewImageBase64);
  }

  return result;
};
