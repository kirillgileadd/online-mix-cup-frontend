import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updatePlayer,
  type UpdatePlayerRequest,
  type UpdatePlayerResponse,
  type GetPlayersResponse,
} from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePlayerResponse, unknown, UpdatePlayerRequest>({
    mutationFn: async (req) => {
      const response = await updatePlayer(req);
      return response;
    },
    onSuccess: (playerResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.PLAYERS] },
        (oldData: GetPlayersResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((player) =>
            player.id === playerResponse?.id ? playerResponse : player
          );
        }
      );
      if (playerResponse) {
        queryClient.setQueryData(
          [QUERY_KEYS.PLAYER, playerResponse.id],
          playerResponse
        );
      }
    },
  });
};

