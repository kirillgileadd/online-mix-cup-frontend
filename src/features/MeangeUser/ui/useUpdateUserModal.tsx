import { useState } from "react";
import type { User } from "../../../entitity/User";
import { UpdateUserModal } from "./UpdateUserModal";

export const useUpdateUserModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (user?: User) => void;
    userId: number;
  }>();

  const modal = modalProps ? <UpdateUserModal {...modalProps} /> : undefined;

  const updateUser = (userId: number) => {
    return new Promise<User | undefined>((res) => {
      setModalProps({
        onClose: (user) => {
          res(user);
          setModalProps(undefined);
        },
        userId,
      });
    });
  };

  return {
    modal,
    updateUser,
  };
};
