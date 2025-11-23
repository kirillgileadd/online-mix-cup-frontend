import { useState } from "react";
import type { Tournament } from "../../../entitity/Tournament";
import { UpdateTournamentModal } from "./UpdateTournamentModal";

export const useUpdateTournamentModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (tournament?: Tournament) => void;
    tournamentId: number;
  }>();

  const modal = modalProps ? (
    <UpdateTournamentModal {...modalProps} />
  ) : undefined;

  const updateTournament = (tournamentId: number) => {
    return new Promise<Tournament | undefined>((res) => {
      setModalProps({
        onClose: (tournament) => {
          res(tournament);
          setModalProps(undefined);
        },
        tournamentId,
      });
    });
  };

  return {
    modal,
    updateTournament,
  };
};

