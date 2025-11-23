import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "../../../shared/api/tournaments";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetTournaments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOURNAMENTS],
    queryFn: async () => {
      const response = await getTournaments();
      return response;
    },
  });
};

