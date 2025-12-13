import { useState } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import { UpdateLeaderboardModal } from "./UpdateLeaderboardModal";

type UpdateLeaderboardModalState = {
  onClose: (leaderboard?: Leaderboard) => void;
  leaderboardId: number;
};

export const useUpdateLeaderboardModal = () => {
  const [modalProps, setModalProps] = useState<UpdateLeaderboardModalState>();

  const modal = modalProps ? <UpdateLeaderboardModal {...modalProps} /> : undefined;

  const open = (leaderboardId: number) => {
    return new Promise<Leaderboard | undefined>((res) => {
      setModalProps({
        onClose: (leaderboard) => {
          res(leaderboard);
          setModalProps(undefined);
        },
        leaderboardId,
      });
    });
  };

  return {
    content: modal,
    open,
  };
};

