import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTournamentStatus,
  type UpdateTournamentStatusRequest,
  type UpdateTournamentStatusResponse,
  type GetTournamentsResponse,
} from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTournamentStatusResponse,
    unknown,
    UpdateTournamentStatusRequest
  >({
    mutationFn: async (req) => {
      const response = await updateTournamentStatus(req);
      return response;
    },
    onSuccess: (tournamentResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.TOURNAMENTS] },
        (oldData: GetTournamentsResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((tournament) =>
            tournament.id === tournamentResponse?.id
              ? tournamentResponse
              : tournament
          );
        }
      );
      if (tournamentResponse) {
        queryClient.setQueryData(
          [QUERY_KEYS.TOURNAMENT, tournamentResponse.id],
          { tournament: tournamentResponse }
        );
      }
    },
  });
};

