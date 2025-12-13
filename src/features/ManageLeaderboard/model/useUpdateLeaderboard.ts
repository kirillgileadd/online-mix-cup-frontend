import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLeaderboard,
  type UpdateLeaderboardRequest,
  type UpdateLeaderboardResponse,
  type GetLeaderboardResponse,
} from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdateLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateLeaderboardResponse,
    unknown,
    { id: number; data: UpdateLeaderboardRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await updateLeaderboard(id, data);
      return response;
    },
    onSuccess: (leaderboardResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.LEADERBOARD] },
        (oldData: GetLeaderboardResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((leaderboard) =>
            leaderboard.id === leaderboardResponse?.id
              ? leaderboardResponse
              : leaderboard
          );
        }
      );
      if (leaderboardResponse) {
        queryClient.setQueryData(
          [QUERY_KEYS.LEADERBOARD_ITEM, leaderboardResponse.id],
          leaderboardResponse
        );
      }
    },
  });
};

