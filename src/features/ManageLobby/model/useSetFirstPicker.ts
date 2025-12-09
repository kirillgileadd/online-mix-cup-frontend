import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setFirstPicker,
  type SetFirstPickerRequest,
  type SetFirstPickerResponse,
} from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useSetFirstPicker = () => {
  const queryClient = useQueryClient();

  return useMutation<SetFirstPickerResponse, unknown, SetFirstPickerRequest>({
    mutationFn: async (data) => {
      const response = await setFirstPicker(data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBY, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LOBBY, data.id, "current-picker"],
      });
      if (data.tournamentId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LOBBIES, data.tournamentId],
        });
      }
    },
  });
};

