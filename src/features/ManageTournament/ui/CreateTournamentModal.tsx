import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Tournament } from "../../../entitity/Tournament";
import { TournamentForm } from "./TournamentForm";
import { type TournamentFormValues } from "../model/types";
import { useCreateTournament } from "../model/useCreateTournament";
import { validateTournamentForm } from "../model/validateTournamentForm";
import { handleValidationErrors } from "../model/handleValidationErrors";
import type { UseFormSetError } from "react-hook-form";

type CreateTournamentModalProps = {
  className?: string;
  onClose: (tournament?: Tournament) => void;
};

export const CreateTournamentModal: FC<CreateTournamentModalProps> = ({
  className,
  onClose,
}) => {
  const createMutation = useCreateTournament();
  const onCreateTournament = async (
    tournamentData: TournamentFormValues,
    setError: UseFormSetError<TournamentFormValues>
  ) => {
    try {
      const requestData = validateTournamentForm(tournamentData);
      const response = await createMutation.mutateAsync(requestData);
      onClose(response);
    } catch (error) {
      handleValidationErrors(error, setError);
    }
  };

  return (
    <Modal
      title="Создать турнир"
      opened
      onClose={onClose}
      className={clsx("", className)}
    >
      <TournamentForm onSuccess={onCreateTournament} />
    </Modal>
  );
};

