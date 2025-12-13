import { useQuery } from "@tanstack/react-query";
import { getLeaderboardItem } from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetLeaderboardItem = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LEADERBOARD_ITEM, id],
    queryFn: async () => {
      const response = await getLeaderboardItem(id);
      return response;
    },
    enabled: !!id,
  });
};

