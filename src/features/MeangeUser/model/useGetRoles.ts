import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../../shared/api/roles";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: async () => {
      const response = await getRoles();
      return response;
    },
  });
};

