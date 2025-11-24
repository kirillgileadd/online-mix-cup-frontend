import { useQuery } from "@tanstack/react-query";
import {
  getPendingApplications,
  type GetPendingApplicationsParams,
} from "../../../shared/api/applications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPendingApplications = (params?: GetPendingApplicationsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, "pending", params],
    queryFn: () => getPendingApplications(params),
  });
};

