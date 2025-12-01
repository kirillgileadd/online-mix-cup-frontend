import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  replacePlayer,
  type ReplacePlayerRequest,
  type ReplacePlayerResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useReplacePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<ReplacePlayerResponse, unknown, ReplacePlayerRequest>({
    mutationFn: async (data) => {
      const response = await replacePlayer(data);
      return response;
    },
    onSuccess: (data) => {
      // Обновляем лобби
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBY, data.id],
      });
      if (data.tournamentId) {
        // Обновляем список лобби
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LOBBIES, data.tournamentId],
        });
        // Обновляем чилл зону (все варианты с round и без)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PLAYERS, "chill-zone", data.tournamentId],
        });
      }
    },
  });
};

