import clsx from "clsx";
import type { FC } from "react";
import { TournamentsList } from "../features/PublicTournaments";

type PublicTournamentsPageProps = {
  className?: string;
};

export const PublicTournamentsPage: FC<PublicTournamentsPageProps> = ({
  className,
}) => {
  return (
    <div className={clsx("p-6", className)}>
      <TournamentsList />
    </div>
  );
};

