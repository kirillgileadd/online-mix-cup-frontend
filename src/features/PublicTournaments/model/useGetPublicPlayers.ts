import { useQuery } from "@tanstack/react-query";
import { getPublicPlayers } from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPublicPlayers = (tournamentId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYERS, tournamentId, "public"],
    queryFn: async () => {
      const response = await getPublicPlayers(tournamentId);
      return response;
    },
    enabled: !!tournamentId,
  });
};

