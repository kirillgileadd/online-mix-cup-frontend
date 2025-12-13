import clsx from "clsx";
import type { FC } from "react";
import { ApplicationsTable } from "../features/ManageApplication";
import { Container } from "@mantine/core";

type ApplicationsPageProps = {
  className?: string;
};

export const ApplicationsPage: FC<ApplicationsPageProps> = ({ className }) => {
  return (
    <Container size="xl" className={clsx("py-6", className)}>
      <ApplicationsTable />
    </Container>
  );
};
