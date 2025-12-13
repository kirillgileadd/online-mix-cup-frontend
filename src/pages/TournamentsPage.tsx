import clsx from "clsx";
import type { FC } from "react";
import { TournamentsTable } from "../features/ManageTournament";
import { Container } from "@mantine/core";

type TournamentsPageProps = {
  className?: string;
};

export const TournamentsPage: FC<TournamentsPageProps> = ({ className }) => {
  return (
    <Container size="xl" className={clsx("py-6", className)}>
      <TournamentsTable />
    </Container>
  );
};
