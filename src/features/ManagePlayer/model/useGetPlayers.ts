import { useQuery } from "@tanstack/react-query";
import { getPlayers, type GetPlayersParams } from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPlayers = (params?: GetPlayersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYERS, params],
    queryFn: async () => {
      const response = await getPlayers(params);
      return response;
    },
  });
};

