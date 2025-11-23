import { useQuery } from "@tanstack/react-query";
import { getTournament } from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetTournament = (tournamentId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOURNAMENT, tournamentId],
    enabled: !!tournamentId,
    queryFn: async () => {
      if (!tournamentId) throw new Error("tournamentId is required");
      const tournament = await getTournament(tournamentId);
      return { tournament };
    },
  });
};

