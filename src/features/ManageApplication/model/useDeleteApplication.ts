import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "../../../shared/api/applications";
import { QUERY_KEYS } from "../../../shared/query-keys";
import type { GetPendingApplicationsResponse } from "../../../shared/api/applications";

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: (_, applicationId) => {
      // Удаляем заявку из списка
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.APPLICATIONS] },
        (oldData: GetPendingApplicationsResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(
            (application) => application.id !== applicationId
          );
        }
      );
    },
  });
};
