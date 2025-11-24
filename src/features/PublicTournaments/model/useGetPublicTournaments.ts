import { useQuery } from "@tanstack/react-query";
import { getPublicTournaments } from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetPublicTournaments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOURNAMENTS, "public"],
    queryFn: async () => {
      const response = await getPublicTournaments();
      return response;
    },
  });
};

