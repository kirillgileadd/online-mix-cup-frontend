import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, "profile"],
    queryFn: async () => {
      const response = await getProfile();
      return response;
    },
  });
};

