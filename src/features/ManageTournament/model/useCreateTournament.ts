import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTournament,
  type CreateTournamentRequest,
  type CreateTournamentResponse,
  type GetTournamentsResponse,
} from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateTournamentResponse, unknown, CreateTournamentRequest>({
    mutationFn: async (req) => {
      const response = await createTournament(req);
      return response;
    },
    onSuccess: (tournamentResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.TOURNAMENTS] },
        (oldData: GetTournamentsResponse | undefined) => {
          if (!oldData || !tournamentResponse) return oldData;

          return [...oldData, tournamentResponse];
        }
      );
    },
  });
};

