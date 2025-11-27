import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Player } from "../../../entitity/Player";
import { PlayerForm, type PlayerFormValues } from "./PlayerForm";
import { useCreatePlayer } from "../model/useCreatePlayer";
import type { UseFormSetError } from "react-hook-form";

type CreatePlayerModalProps = {
  className?: string;
  onClose: (player?: Player) => void;
  defaultTournamentId?: number;
};

export const CreatePlayerModal: FC<CreatePlayerModalProps> = ({
  className,
  onClose,
  defaultTournamentId,
}) => {
  const createMutation = useCreatePlayer();

  const onCreatePlayer = async (
    playerData: PlayerFormValues,
    setError: UseFormSetError<PlayerFormValues>
  ) => {
    try {
      if (!playerData.userId || !playerData.tournamentId) {
        throw new Error("userId и tournamentId обязательны");
      }
      const playerResponse = await createMutation.mutateAsync({
        userId: playerData.userId,
        tournamentId: playerData.tournamentId,
        nickname: playerData.nickname,
        gameRoles: playerData.gameRoles || undefined,
        mmr: playerData.mmr ?? undefined,
        chillZoneValue: playerData.chillZoneValue,
        lives: playerData.lives,
        status: playerData.status as "active" | "eliminated",
      });
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
      title="Создать игрока"
      onClose={onClose}
      opened={true}
    >
      <PlayerForm
        onSuccess={onCreatePlayer}
        defaultTournamentId={defaultTournamentId}
      />
    </Modal>
  );
};
