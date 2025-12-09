import { useQuery } from "@tanstack/react-query";
import { getCurrentPicker } from "../../../shared/api/lobbies";
import { QUERY_KEYS } from "../../../shared/query-keys";

export const useGetCurrentPicker = (
  lobbyId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOBBY, lobbyId, "current-picker"],
    enabled: !!lobbyId && enabled,
    queryFn: async () => {
      if (!lobbyId) throw new Error("lobbyId is required");
      const response = await getCurrentPicker(lobbyId);
      return response;
    },
  });
};
