import type { Participation } from "../../../shared/api/lobbies";

/**
 * Проверяет, заполнена ли команда (5 участников)
 * @param participations - массив participations команды
 * @returns true если команда заполнена (length === 5), иначе false
 */
export const isTeamFull = (participations: Participation[]): boolean => {
  return participations.length === 5;
};

