import clsx from "clsx";
import type { FC } from "react";
import { ApplicationsTable } from "../features/ManageApplication";

type ApplicationsPageProps = {
  className?: string;
};

export const ApplicationsPage: FC<ApplicationsPageProps> = ({ className }) => {
  return (
    <div className={clsx("", className)}>
      <ApplicationsTable />
    </div>
  );
};

