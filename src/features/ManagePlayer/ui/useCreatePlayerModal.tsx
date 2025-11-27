import { useState } from "react";
import type { Player } from "../../../entitity/Player";
import { CreatePlayerModal } from "./CreatePlayerModal";

type CreatePlayerModalProps = {
  onClose: (player?: Player) => void;
  defaultTournamentId?: number;
};

export const useCreatePlayerModal = () => {
  const [modalProps, setModalProps] = useState<CreatePlayerModalProps>();

  const modal = modalProps ? <CreatePlayerModal {...modalProps} /> : undefined;

  const open = (options?: { tournamentId?: number }) => {
    return new Promise<Player | undefined>((res) => {
      setModalProps({
        onClose: (player) => {
          res(player);
          setModalProps(undefined);
        },
        defaultTournamentId: options?.tournamentId,
      });
    });
  };

  return {
    content: modal,
    open,
  };
};
