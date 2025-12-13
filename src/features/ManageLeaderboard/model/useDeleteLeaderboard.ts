import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLeaderboard } from "../../../shared/api/leaderboard";
import { QUERY_KEYS } from "../../../shared/query-keys";
import type { GetLeaderboardResponse } from "../../../shared/api/leaderboard";

export const useDeleteLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLeaderboard,
    onSuccess: (_, leaderboardId) => {
      // Удаляем запись из списка
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.LEADERBOARD] },
        (oldData: GetLeaderboardResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (leaderboard) => leaderboard.id !== leaderboardId
          );
        }
      );
      // Удаляем кеш конкретной записи
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.LEADERBOARD_ITEM, leaderboardId],
      });
    },
  });
};

