import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPlayer,
  type CreatePlayerRequest,
  type CreatePlayerResponse,
  type GetPlayersResponse,
} from "../../../shared/api/players";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePlayerResponse, unknown, CreatePlayerRequest>({
    mutationFn: async (req) => {
      const response = await createPlayer(req);
      return response;
    },
    onSuccess: (playerResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.PLAYERS] },
        (oldData: GetPlayersResponse | undefined) => {
          if (!oldData || !playerResponse) return oldData;
          return [...oldData, playerResponse];
        }
      );
    },
  });
};

