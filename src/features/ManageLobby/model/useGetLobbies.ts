import { useQuery } from "@tanstack/react-query";
import { listLobbiesByTournament } from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetLobbies = (tournamentId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOBBIES, tournamentId],
    enabled: !!tournamentId,
    queryFn: async () => {
      if (!tournamentId) throw new Error("tournamentId is required");
      const response = await listLobbiesByTournament(tournamentId);
      return response;
    },
  });
};

