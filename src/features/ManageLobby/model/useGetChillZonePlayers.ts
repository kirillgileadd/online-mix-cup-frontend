import { useQuery } from "@tanstack/react-query";
import { getChillZonePlayers } from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetChillZonePlayers = (
  tournamentId?: number,
  round?: number
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.PLAYERS,
      "chill-zone",
      tournamentId,
      round ?? "all",
    ],
    enabled: !!tournamentId,
    queryFn: async () => {
      if (!tournamentId) return [];
      const response = await getChillZonePlayers(tournamentId, round);
      return response;
    },
  });
};


