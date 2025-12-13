import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import {
  LeaderboardForm,
  type LeaderboardFormValues,
} from "./LeaderboardForm";
import { useUpdateLeaderboard } from "../model/useUpdateLeaderboard";
import type { UseFormSetError } from "react-hook-form";

type UpdateLeaderboardModalProps = {
  className?: string;
  leaderboardId: number;
  onClose: (leaderboard?: Leaderboard) => void;
};

export const UpdateLeaderboardModal: FC<UpdateLeaderboardModalProps> = ({
  className,
  onClose,
  leaderboardId,
}) => {
  const updateMutation = useUpdateLeaderboard();

  const onUpdateLeaderboard = async (
    leaderboardData: LeaderboardFormValues,
    setError: UseFormSetError<LeaderboardFormValues>
  ) => {
    try {
      const requestData = {
        id: leaderboardId,
        data: {
          points: leaderboardData.points ?? undefined,
          createdAt: leaderboardData.createdAt ?? undefined,
        },
      };
      const leaderboardResponse = await updateMutation.mutateAsync(requestData);
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
      title="Обновить запись в лидерборде"
      onClose={onClose}
      opened={true}
    >
      <LeaderboardForm
        onSuccess={onUpdateLeaderboard}
        leaderboardId={leaderboardId}
      />
    </Modal>
  );
};

