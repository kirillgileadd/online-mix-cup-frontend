import { useQuery } from "@tanstack/react-query";
import {
  getNotificationSettings,
  type NotificationSettings,
} from "../../../shared/api/notifications";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetNotificationSettings = () => {
  return useQuery<NotificationSettings>({
    queryKey: [QUERY_KEYS.USER, "profile", "notifications"],
    queryFn: async () => {
      const response = await getNotificationSettings();
      return response;
    },
  });
};

