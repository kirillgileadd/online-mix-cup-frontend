import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: async () => {
      const response = await getUsers();
      return response;
    },
  });
};

