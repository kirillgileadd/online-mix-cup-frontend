import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetUser = (userId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");
      const response = await getUser(userId);
      return response;
    },
  });
};
