import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import {
  AddPointsForm,
  type AddPointsFormValues,
} from "./AddPointsForm";
import { useAddPoints } from "../model/useAddPoints";
import type { UseFormSetError } from "react-hook-form";

type AddPointsModalProps = {
  className?: string;
  userId: number;
  onClose: (leaderboard?: Leaderboard) => void;
};

export const AddPointsModal: FC<AddPointsModalProps> = ({
  className,
  onClose,
  userId,
}) => {
  const addPointsMutation = useAddPoints();

  const onAddPoints = async (
    data: AddPointsFormValues,
    setError: UseFormSetError<AddPointsFormValues>
  ) => {
    try {
      const leaderboardResponse = await addPointsMutation.mutateAsync({
        userId,
        data: {
          points: data.points,
        },
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
            setError(field as keyof AddPointsFormValues, {
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
      title="Добавить очки"
      onClose={onClose}
      opened={true}
    >
      <AddPointsForm onSuccess={onAddPoints} />
    </Modal>
  );
};

