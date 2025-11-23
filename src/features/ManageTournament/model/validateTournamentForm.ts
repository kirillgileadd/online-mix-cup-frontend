import type { TournamentFormValues } from "./types";

/**
 * Очищает значения формы от пустых строк и обрезает пробелы.
 * Возвращает объект только с заполненными полями.
 */
export const validateTournamentForm = (
  tournamentData: TournamentFormValues
): {
  name: string;
  eventDate?: string | null;
  price: number;
  prizePool?: number | null;
} => {
  const result: {
    name: string;
    eventDate?: string | null;
    price: number;
    prizePool?: number | null;
  } = {
    name: tournamentData.name.trim(),
    price: tournamentData.price,
  };

  if (tournamentData.eventDate !== undefined && tournamentData.eventDate !== null) {
    result.eventDate = tournamentData.eventDate;
  }
  if (tournamentData.prizePool !== undefined && tournamentData.prizePool !== null) {
    result.prizePool = tournamentData.prizePool;
  }

  return result;
};

