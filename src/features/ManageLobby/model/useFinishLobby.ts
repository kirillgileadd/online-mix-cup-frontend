import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  finishLobby,
  type FinishLobbyRequest,
  type FinishLobbyResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useFinishLobby = () => {
  const queryClient = useQueryClient();

  return useMutation<FinishLobbyResponse, unknown, FinishLobbyRequest>({
    mutationFn: async (data) => {
      const response = await finishLobby(data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBY, data.id],
      });
      if (data.tournamentId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LOBBIES, data.tournamentId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.TOURNAMENT, data.tournamentId],
        });
      }
    },
  });
};

