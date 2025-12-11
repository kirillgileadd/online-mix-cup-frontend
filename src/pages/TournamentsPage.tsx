import clsx from "clsx";
import type { FC } from "react";
import { TournamentsTable } from "../features/ManageTournament";

type TournamentsPageProps = {
  className?: string;
};

export const TournamentsPage: FC<TournamentsPageProps> = ({ className }) => {
  return (
    <div className={clsx("", className)}>
      <TournamentsTable />
    </div>
  );
};
