import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Tournament } from "../../../entitity/Tournament";
import { TournamentForm } from "./TournamentForm";
import { type TournamentFormValues } from "../model/types";
import { useUpdateTournamentFull } from "../model/useUpdateTournamentFull";
import { validateTournamentForm } from "../model/validateTournamentForm";
import { handleValidationErrors } from "../model/handleValidationErrors";
import type { UseFormSetError } from "react-hook-form";

type UpdateTournamentModalProps = {
  className?: string;
  tournamentId: number;
  onClose: (tournament?: Tournament) => void;
};

export const UpdateTournamentModal: FC<UpdateTournamentModalProps> = ({
  className,
  onClose,
  tournamentId,
}) => {
  const updateMutation = useUpdateTournamentFull();

  const onUpdateTournament = async (
    tournamentData: TournamentFormValues,
    setError: UseFormSetError<TournamentFormValues>
  ) => {
    try {
      const validatedData = validateTournamentForm(tournamentData);
      const requestData = {
        tournamentId: tournamentId,
        ...validatedData,
      };
      const tournamentResponse = await updateMutation.mutateAsync(requestData);
      onClose(tournamentResponse);
    } catch (error) {
      handleValidationErrors(error, setError);
    }
  };

  return (
    <Modal
      className={clsx("", className)}
      withinPortal
      title="Обновить турнир"
      onClose={onClose}
      opened={true}
    >
      <TournamentForm onSuccess={onUpdateTournament} tournamentId={tournamentId} />
    </Modal>
  );
};

