import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import {
  LeaderboardForm,
  type LeaderboardFormValues,
} from "./LeaderboardForm";
import { useCreateLeaderboard } from "../model/useCreateLeaderboard";
import type { UseFormSetError } from "react-hook-form";

type CreateLeaderboardModalProps = {
  className?: string;
  onClose: (leaderboard?: Leaderboard) => void;
};

export const CreateLeaderboardModal: FC<CreateLeaderboardModalProps> = ({
  className,
  onClose,
}) => {
  const createMutation = useCreateLeaderboard();

  const onCreateLeaderboard = async (
    leaderboardData: LeaderboardFormValues,
    setError: UseFormSetError<LeaderboardFormValues>
  ) => {
    try {
      if (!leaderboardData.userId) {
        throw new Error("userId обязателен");
      }
      const leaderboardResponse = await createMutation.mutateAsync({
        userId: leaderboardData.userId,
        points: leaderboardData.points ?? undefined,
        createdAt: leaderboardData.createdAt ?? new Date().toISOString(),
      });
      onClose(leaderboardResponse);
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
            setError(field as keyof LeaderboardFormValues, {
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
      title="Создать запись в лидерборде"
      onClose={onClose}
      opened={true}
    >
      <LeaderboardForm onSuccess={onCreateLeaderboard} />
    </Modal>
  );
};

