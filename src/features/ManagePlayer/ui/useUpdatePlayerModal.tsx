import { useState } from "react";
import type { Player } from "../../../entitity/Player";
import { UpdatePlayerModal } from "./UpdatePlayerModal";

type UpdatePlayerModalState = {
  onClose: (player?: Player) => void;
  playerId: number;
  defaultTournamentId?: number;
};

export const useUpdatePlayerModal = () => {
  const [modalProps, setModalProps] = useState<UpdatePlayerModalState>();

  const modal = modalProps ? <UpdatePlayerModal {...modalProps} /> : undefined;

  const open = (playerId: number, options?: { tournamentId?: number }) => {
    return new Promise<Player | undefined>((res) => {
      setModalProps({
        onClose: (player) => {
          res(player);
          setModalProps(undefined);
        },
        playerId,
        defaultTournamentId: options?.tournamentId,
      });
    });
  };

  return {
    content: modal,
    open,
  };
};
