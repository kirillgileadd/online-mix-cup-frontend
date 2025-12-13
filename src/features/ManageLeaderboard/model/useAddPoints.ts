import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPoints,
  type AddPointsRequest,
  type AddPointsResponse,
  type GetLeaderboardResponse,
} from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useAddPoints = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddPointsResponse,
    unknown,
    { userId: number; data: AddPointsRequest }
  >({
    mutationFn: async ({ userId, data }) => {
      const response = await addPoints(userId, data);
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

