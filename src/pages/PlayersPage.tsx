import clsx from "clsx";
import type { FC } from "react";
import { PlayersTable } from "../features/ManagePlayer";
import { Container } from "@mantine/core";

type PlayersPageProps = {
  className?: string;
};

export const PlayersPage: FC<PlayersPageProps> = ({ className }) => {
  return (
    <Container size="xl" className={clsx("py-6", className)}>
      <PlayersTable />
    </Container>
  );
};

