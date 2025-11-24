import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveApplication } from "../../../shared/api/applications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useApproveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.APPLICATIONS],
      });
    },
  });
};

