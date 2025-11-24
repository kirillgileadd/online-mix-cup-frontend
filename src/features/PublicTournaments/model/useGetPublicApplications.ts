import { useQuery } from "@tanstack/react-query";
import { getPublicApplications } from "../../../shared/api/applications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPublicApplications = (tournamentId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS, tournamentId, "public"],
    queryFn: async () => {
      const response = await getPublicApplications(tournamentId);
      return response;
    },
    enabled: !!tournamentId,
  });
};

