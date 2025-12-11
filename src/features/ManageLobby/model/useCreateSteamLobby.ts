import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSteamLobby,
  type CreateSteamLobbyRequest,
  type CreateSteamLobbyResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useCreateSteamLobby = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSteamLobbyResponse, unknown, CreateSteamLobbyRequest>({
    mutationFn: async (data) => {
      const response = await createSteamLobby(data);
      return response;
    },
    onSuccess: (_, variables) => {
      // Инвалидируем кеш лобби, чтобы обновить информацию о Steam лобби
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBY, variables.lobbyId],
      });
      if (variables.lobbyId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LOBBIES],
        });
      }
    },
  });
};

