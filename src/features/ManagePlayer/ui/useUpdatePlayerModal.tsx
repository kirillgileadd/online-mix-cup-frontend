import { useState } from "react";
import type { Player } from "../../../entitity/Player";
import { UpdatePlayerModal } from "./UpdatePlayerModal";

export const useUpdatePlayerModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (player?: Player) => void;
    playerId: number;
  }>();

  const modal = modalProps ? (
    <UpdatePlayerModal {...modalProps} />
  ) : undefined;

  const open = (playerId: number) => {
    return new Promise<Player | undefined>((res) => {
      setModalProps({
        onClose: (player) => {
          res(player);
          setModalProps(undefined);
        },
        playerId,
      });
    });
  };

  return {
    content: modal,
    open,
  };
};

