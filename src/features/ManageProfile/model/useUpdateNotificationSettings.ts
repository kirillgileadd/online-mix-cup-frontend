import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateNotificationSettings,
  type NotificationSettings,
  type UpdateNotificationSettingsRequest,
} from "../../../shared/api/notifications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NotificationSettings,
    unknown,
    UpdateNotificationSettingsRequest
  >({
    mutationFn: async (req) => {
      const response = await updateNotificationSettings(req);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [QUERY_KEYS.USER, "profile", "notifications"],
        data
      );
    },
  });
};

