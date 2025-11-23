import { useState } from "react";
import type { User } from "../../../entitity/User";
import { CreateUserModal } from "./CreateUserModal";

export const useCreateUserModal = () => {
  const [modalProps, setModalProps] = useState<{
    onClose: (user?: User) => void;
  }>();

  const modal = modalProps ? <CreateUserModal {...modalProps} /> : undefined;

  const createUser = () => {
    return new Promise<User | undefined>((res) => {
      setModalProps({
        onClose: (user) => {
          res(user);
          setModalProps(undefined);
        },
      });
    });
  };

  return {
    modal,
    createUser,
  };
};
