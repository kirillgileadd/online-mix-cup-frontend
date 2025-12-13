import { useQuery } from "@tanstack/react-query";
import {
  getLeaderboard,
  type GetLeaderboardParams,
} from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetLeaderboard = (params?: GetLeaderboardParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LEADERBOARD, params],
    queryFn: async () => {
      const response = await getLeaderboard(params);
      return response;
    },
  });
};

