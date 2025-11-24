import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  draftPick,
  type DraftPickRequest,
  type DraftPickResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useDraftPick = () => {
  const queryClient = useQueryClient();

  return useMutation<DraftPickResponse, unknown, DraftPickRequest>({
    mutationFn: async (data) => {
      const response = await draftPick(data);
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

