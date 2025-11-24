import { useQuery } from "@tanstack/react-query";
import { getLobbyById } from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetLobby = (lobbyId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOBBY, lobbyId],
    enabled: !!lobbyId,
    queryFn: async () => {
      if (!lobbyId) throw new Error("lobbyId is required");
      const response = await getLobbyById(lobbyId);
      return response;
    },
  });
};

