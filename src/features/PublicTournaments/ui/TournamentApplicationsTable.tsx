import { Title, Badge, Loader, Center, Text } from "@mantine/core";
import clsx from "clsx";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo } from "react";
import { useGetPublicApplications } from "../model/useGetPublicApplications";
import { useReactTable } from "../../../shared/useReactTable";
import type {
  Application,
  ApplicationStatus,
} from "../../../entitity/Application";

type TournamentApplicationsTableProps = {
  tournamentId: number;
  className?: string;
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "На модерации",
  approved: "Одобрена",
  rejected: "Отклонена",
};

export const TournamentApplicationsTable: FC<
  TournamentApplicationsTableProps
> = ({ tournamentId, className }) => {
  const applicationsQuery = useGetPublicApplications(tournamentId);

  const columns = useMemo<MRT_ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "nickname",
        header: "Никнейм",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => <>{cell.getValue() || "-"}</>,
      },
      {
        accessorKey: "mmr",
        header: "MMR",
        sortingFn: "numeric",
        filterFn: "equals",
      },
      {
        accessorKey: "gameRoles",
        header: "Игровые роли",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
      {
        accessorKey: "status",
        header: "Статус",
        sortingFn: "alphanumeric",
        filterFn: "equals",
        Cell: ({ cell }) => (
          <Badge
            variant="light"
            color={
              cell.getValue() === "approved"
                ? "green"
                : cell.getValue() === "rejected"
                  ? "red"
                  : "yellow"
            }
          >
            {statusLabels[cell.getValue() as ApplicationStatus]}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Дата создания",
        sortingFn: "datetime",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue() as string);
          return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: applicationsQuery?.data ?? [],
    enableRowActions: false,
    enableColumnOrdering: false,
    enableFilters: false,
    state: {
      isLoading: applicationsQuery.isLoading,
    },
    defaultColumn: {
      minSize: 20,
      maxSize: 200,
      size: 100,
    },
    enableColumnFilters: true,
    enableTopToolbar: true,
    enableGlobalFilter: true,
  });

  if (applicationsQuery.isLoading) {
    return (
      <Center className={clsx("py-12", className)}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (applicationsQuery.isError) {
    return (
      <div className={clsx("py-12", className)}>
        <Text c="red">Ошибка при загрузке заявок</Text>
      </div>
    );
  }

  return (
    <div className={clsx("", className)}>
      <Title size="h2" mb="xl">
        Заявки на турнир
      </Title>
      {applicationsQuery.data && applicationsQuery.data.length === 0 ? (
        <Text c="dimmed">Заявки не найдены</Text>
      ) : (
        <MantineReactTable table={table} />
      )}
    </div>
  );
};
