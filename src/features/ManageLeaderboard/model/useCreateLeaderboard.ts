import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLeaderboard,
  type CreateLeaderboardRequest,
  type CreateLeaderboardResponse,
  type GetLeaderboardResponse,
} from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useCreateLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateLeaderboardResponse, unknown, CreateLeaderboardRequest>({
    mutationFn: async (req) => {
      const response = await createLeaderboard(req);
      return response;
    },
    onSuccess: (leaderboardResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.LEADERBOARD] },
        (oldData: GetLeaderboardResponse | undefined) => {
          if (!oldData || !leaderboardResponse) return oldData;
          return [leaderboardResponse, ...oldData];
        }
      );
    },
  });
};

