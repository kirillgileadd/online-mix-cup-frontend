import clsx from "clsx";
import type { FC } from "react";
import { UsersTable } from "../features/MeangeUser";

type UsersPageProps = {
  className?: string;
};

export const UsersPage: FC<UsersPageProps> = ({ className }) => {
  return (
    <div className={clsx("", className)}>
      <UsersTable />
    </div>
  );
};
