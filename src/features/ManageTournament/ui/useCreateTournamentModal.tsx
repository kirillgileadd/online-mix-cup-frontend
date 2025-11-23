import { useState } from "react";
import type { Tournament } from "../../../entitity/Tournament";
import { CreateTournamentModal } from "./CreateTournamentModal";

export const useCreateTournamentModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (tournament?: Tournament) => void;
  }>();

  const modal = modalProps ? (
    <CreateTournamentModal {...modalProps} />
  ) : undefined;

  const createTournament = () => {
    return new Promise<Tournament | undefined>((res) => {
      setModalProps({
        onClose: (tournament) => {
          res(tournament);
          setModalProps(undefined);
        },
      });
    });
  };

  return {
    modal,
    createTournament,
  };
};

