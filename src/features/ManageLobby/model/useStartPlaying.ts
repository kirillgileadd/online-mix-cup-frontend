import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  startPlaying,
  type StartPlayingRequest,
  type StartPlayingResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useStartPlaying = () => {
  const queryClient = useQueryClient();

  return useMutation<StartPlayingResponse, unknown, StartPlayingRequest>({
    mutationFn: async (data) => {
      const response = await startPlaying(data);
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


