import clsx from "clsx";
import type { FC } from "react";
import { PlayersTable } from "../features/ManagePlayer";

type PlayersPageProps = {
  className?: string;
};

export const PlayersPage: FC<PlayersPageProps> = ({ className }) => {
  return (
    <div className={clsx("", className)}>
      <PlayersTable />
    </div>
  );
};

