import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateLobbies,
  type GenerateLobbiesRequest,
  type GenerateLobbiesResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGenerateLobbies = () => {
  const queryClient = useQueryClient();

  return useMutation<GenerateLobbiesResponse, unknown, GenerateLobbiesRequest>({
    mutationFn: async (data) => {
      const response = await generateLobbies(data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBIES, variables.tournamentId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TOURNAMENT, variables.tournamentId],
      });
    },
  });
};

