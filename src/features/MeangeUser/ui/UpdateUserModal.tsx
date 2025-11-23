import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { User } from "../../../entitity/User";
import { UserForm } from "./UserForm";
import { type UserFormValues } from "../model/types";
import { useUpdateUser } from "../model/use-update-user";
import { validateUserForm } from "../model/validateUserForm";
import { handleValidationErrors } from "../model/handleValidationErrors";
import type { UseFormSetError } from "react-hook-form";

type UpdateUserModalProps = {
  className?: string;
  userId: number;
  onClose: (user?: User) => void;
};

export const UpdateUserModal: FC<UpdateUserModalProps> = ({
  className,
  onClose,
  userId,
}) => {
  const updateMutation = useUpdateUser();

  const onUpdateUser = async (
    userData: UserFormValues,
    setError: UseFormSetError<UserFormValues>
  ) => {
    try {
      const validatedData = validateUserForm(userData);
      const requestData = {
        userId: userId,
        ...validatedData,
      };
      const userResponse = await updateMutation.mutateAsync(requestData);
      onClose(userResponse);
    } catch (error) {
      handleValidationErrors(error, setError);
    }
  };

  return (
    <Modal
      className={clsx("", className)}
      withinPortal
      title="Обновить пользователя"
      onClose={onClose}
      opened={true}
    >
      <UserForm onSuccess={onUpdateUser} userId={userId} />
    </Modal>
  );
};
