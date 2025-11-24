import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectApplication } from "../../../shared/api/applications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPLICATIONS],
      });
    },
  });
};

