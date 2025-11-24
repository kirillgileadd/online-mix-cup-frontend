import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startDraft,
  type StartDraftResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useStartDraft = () => {
  const queryClient = useQueryClient();

  return useMutation<StartDraftResponse, unknown, number>({
    mutationFn: async (lobbyId) => {
      const response = await startDraft(lobbyId);
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
      }
    },
  });
};

