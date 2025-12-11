import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  leaveSteamLobby,
  type LeaveSteamLobbyResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useLeaveSteamLobby = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveSteamLobbyResponse, unknown, void>({
    mutationFn: async () => {
      const response = await leaveSteamLobby();
      return response;
    },
    onSuccess: () => {
      // Инвалидируем кеш всех лобби, так как бот покинул лобби
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBIES],
      });
    },
  });
};

