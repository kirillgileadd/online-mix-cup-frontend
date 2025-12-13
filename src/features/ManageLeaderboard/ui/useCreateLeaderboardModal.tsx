import { useState } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import { CreateLeaderboardModal } from "./CreateLeaderboardModal";

type CreateLeaderboardModalProps = {
  onClose: (leaderboard?: Leaderboard) => void;
};

export const useCreateLeaderboardModal = () => {
  const [modalProps, setModalProps] = useState<CreateLeaderboardModalProps>();

  const modal = modalProps ? <CreateLeaderboardModal {...modalProps} /> : undefined;

  const open = () => {
    return new Promise<Leaderboard | undefined>((res) => {
      setModalProps({
        onClose: (leaderboard) => {
          res(leaderboard);
          setModalProps(undefined);
        },
      });
    });
  };

  return {
    content: modal,
    open,
  };
};

