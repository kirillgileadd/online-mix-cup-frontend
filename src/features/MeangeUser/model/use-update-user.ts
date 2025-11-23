import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUser,
  type UpdateUserRequest,
  type UpdateUserResponse,
  type GetUsersResponse,
} from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, unknown, UpdateUserRequest>({
    mutationFn: async (req) => {
      const response = await updateUser(req);
      return response;
    },
    onSuccess: (userResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.USERS] },
        (oldData: GetUsersResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((user) =>
            user.id === userResponse?.id ? userResponse : user
          );
        }
      );
      if (userResponse) {
        queryClient.setQueryData([QUERY_KEYS.USER, userResponse.id], {
          user: userResponse,
        });
      }
    },
  });
};
