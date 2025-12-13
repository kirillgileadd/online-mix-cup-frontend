import clsx from "clsx";
import type { FC } from "react";
import { UsersTable } from "../features/MeangeUser";
import { Container } from "@mantine/core";

type UsersPageProps = {
  className?: string;
};

export const UsersPage: FC<UsersPageProps> = ({ className }) => {
  return (
    <Container size="xl" className={clsx("py-6", className)}>
      <UsersTable />
    </Container>
  );
};
