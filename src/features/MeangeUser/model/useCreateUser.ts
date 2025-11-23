import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  type CreateUserRequest,
  type CreateUserResponse,
  type GetUsersResponse,
} from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateUserResponse, unknown, CreateUserRequest>({
    mutationFn: async (req) => {
      const response = await createUser(req);
      return response;
    },
    onSuccess: (userResponse) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.USERS] },
        (oldData: GetUsersResponse | undefined) => {
          if (!oldData || !userResponse) return oldData;

          return [userResponse, ...oldData];
        }
      );
    },
  });
};
