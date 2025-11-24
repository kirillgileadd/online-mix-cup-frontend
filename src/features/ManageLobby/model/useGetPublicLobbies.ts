import { useQuery } from "@tanstack/react-query";
import { listPublicLobbiesByTournament } from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPublicLobbies = (tournamentId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOBBIES, "public", tournamentId],
    enabled: !!tournamentId,
    queryFn: async () => {
      if (!tournamentId) return [];
      const response = await listPublicLobbiesByTournament(tournamentId);
      return response;
    },
  });
};


