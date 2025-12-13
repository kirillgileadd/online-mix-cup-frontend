import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  type UpdateProfileRequest,
  type UpdateProfileResponse,
} from "../../../shared/api/users";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, unknown, UpdateProfileRequest>({
    mutationFn: async (req) => {
      const response = await updateProfile(req);
      return response;
    },
    onSuccess: (userResponse) => {
      queryClient.setQueryData([QUERY_KEYS.USER, "profile"], userResponse);
      if (userResponse) {
        queryClient.setQueryData([QUERY_KEYS.USER, userResponse.id], userResponse);
      }
    },
  });
};

