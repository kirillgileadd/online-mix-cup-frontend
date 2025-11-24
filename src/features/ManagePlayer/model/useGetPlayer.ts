import { useQuery } from "@tanstack/react-query";
import { getPlayer } from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPlayer = (playerId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYER, playerId],
    enabled: !!playerId,
    queryFn: async () => {
      if (!playerId) throw new Error("playerId is required");
      const player = await getPlayer(playerId);
      return player;
    },
  });
};

