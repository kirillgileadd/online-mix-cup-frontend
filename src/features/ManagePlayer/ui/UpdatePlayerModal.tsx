import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Player } from "../../../entitity/Player";
import { PlayerForm, type PlayerFormValues } from "./PlayerForm";
import { useUpdatePlayer } from "../model/useUpdatePlayer";
import type { UseFormSetError } from "react-hook-form";

type UpdatePlayerModalProps = {
  className?: string;
  playerId: number;
  onClose: (player?: Player) => void;
  defaultTournamentId?: number;
};

export const UpdatePlayerModal: FC<UpdatePlayerModalProps> = ({
  className,
  onClose,
  playerId,
  defaultTournamentId,
}) => {
  const updateMutation = useUpdatePlayer();

  const onUpdatePlayer = async (
    playerData: PlayerFormValues,
    setError: UseFormSetError<PlayerFormValues>
  ) => {
    try {
      const { userId, tournamentId, ...updateData } = playerData;
      const requestData = {
        playerId: playerId,
        ...updateData,
      };
      const playerResponse = await updateMutation.mutateAsync(requestData);
      onClose(playerResponse);
    } catch (error) {
      // Обработка ошибок валидации
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              data?: Record<string, string[]>;
            };
          };
        };
        const validationErrors = axiosError.response?.data?.data;
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, messages]) => {
            setError(field as keyof PlayerFormValues, {
              type: "server",
              message: messages[0],
            });
          });
        }
      }
    }
  };

  return (
    <Modal
      className={clsx("", className)}
      withinPortal
      title="Обновить игрока"
      onClose={onClose}
      opened={true}
    >
      <PlayerForm
        onSuccess={onUpdatePlayer}
        playerId={playerId}
        defaultTournamentId={defaultTournamentId}
      />
    </Modal>
  );
};

