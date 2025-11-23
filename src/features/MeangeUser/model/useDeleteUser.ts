import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";
import type { GetUsersResponse } from "../../../shared/api/users";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number>({
    mutationFn: async (userId) => {
      await deleteUser(userId);
    },
    onSuccess: (_, userId) => {
      // Удаляем пользователя из списка
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.USERS] },
        (oldData: GetUsersResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((user) => user.id !== userId);
        }
      );
      // Удаляем кеш конкретного пользователя
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.USER, userId],
      });
    },
  });
};

