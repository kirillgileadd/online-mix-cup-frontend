import { useQuery } from "@tanstack/react-query";
import { getPublicTournament } from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPublicTournament = (tournamentId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOURNAMENT, tournamentId, "public"],
    queryFn: async () => {
      const response = await getPublicTournament(tournamentId);
      return response;
    },
    enabled: !!tournamentId,
  });
};

