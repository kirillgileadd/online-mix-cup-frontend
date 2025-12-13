import { useState } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import { AddPointsModal } from "./AddPointsModal";

type AddPointsModalState = {
  onClose: (leaderboard?: Leaderboard) => void;
  userId: number;
};

export const useAddPointsModal = () => {
  const [modalProps, setModalProps] = useState<AddPointsModalState>();

  const modal = modalProps ? <AddPointsModal {...modalProps} /> : undefined;

  const open = (userId: number) => {
    return new Promise<Leaderboard | undefined>((res) => {
      setModalProps({
        onClose: (leaderboard) => {
          res(leaderboard);
          setModalProps(undefined);
        },
        userId,
      });
    });
  };

  return {
    content: modal,
    open,
  };
};

