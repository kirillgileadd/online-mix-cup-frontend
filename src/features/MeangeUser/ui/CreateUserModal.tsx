import { Modal } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { User } from "../../../entitity/User";
import { UserForm } from "./UserForm";
import { type UserFormValues } from "../model/types";
import { useCreateUser } from "../model/useCreateUser";
import { validateUserForm } from "../model/validateUserForm";
import { handleValidationErrors } from "../model/handleValidationErrors";
import type { UseFormSetError } from "react-hook-form";

type CreateUserModalProps = {
  className?: string;
  onClose: (user?: User) => void;
};

export const CreateUserModal: FC<CreateUserModalProps> = ({
  className,
  onClose,
}) => {
  const createMutation = useCreateUser();
  const onCreateUser = async (
    userData: UserFormValues,
    setError: UseFormSetError<UserFormValues>
  ) => {
    try {
      const requestData = validateUserForm(userData);
      const response = await createMutation.mutateAsync(requestData);
      onClose(response.user);
    } catch (error) {
      handleValidationErrors(error, setError);
    }
  };

  return (
    <Modal
      title="Создать пользователя"
      opened
      onClose={onClose}
      className={clsx("", className)}
    >
      <UserForm onSuccess={onCreateUser} />
    </Modal>
  );
};
