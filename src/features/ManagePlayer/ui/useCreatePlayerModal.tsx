import { useState } from "react";
import type { Player } from "../../../entitity/Player";
import { CreatePlayerModal } from "./CreatePlayerModal";

export const useCreatePlayerModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (player?: Player) => void;
  }>();

  const modal = modalProps ? (
    <CreatePlayerModal {...modalProps} />
  ) : undefined;

  const open = () => {
    return new Promise<Player | undefined>((res) => {
      setModalProps({
        onClose: (player) => {
          res(player);
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

