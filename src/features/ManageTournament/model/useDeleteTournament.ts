import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTournament } from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";
import type { GetTournamentsResponse } from "../../../shared/api/tournaments";

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: (_, tournamentId) => {
      // Удаляем турнир из списка
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.TOURNAMENTS] },
        (oldData: GetTournamentsResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((tournament) => tournament.id !== tournamentId);
        }
      );
      // Удаляем кеш конкретного турнира
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.TOURNAMENT, tournamentId],
      });
    },
  });
};

