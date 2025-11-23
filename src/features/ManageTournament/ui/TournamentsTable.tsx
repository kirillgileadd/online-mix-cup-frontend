import { ActionIcon, Button, Menu, Title, Badge } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import { IconDots, IconPray, IconEdit } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo } from "react";
import { useGetTournaments } from "../model/useGetTournaments";
import { useCreateTournamentModal } from "./useCreateTournamentModal";
import { useUpdateTournamentModal } from "./useUpdateTournamentModal";
import { useUpdateTournament } from "../model/useUpdateTournament";
import { startTournament } from "../../../shared/api/tournaments";
import { useReactTable } from "../../../shared/useReactTable";
import type {
  Tournament,
  TournamentStatus,
} from "../../../entitity/Tournament";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../shared/query-keys";
import type { GetTournamentsResponse } from "../../../shared/api/tournaments";

type TournamentsTableProps = {
  className?: string;
};

const statusLabels: Record<TournamentStatus, string> = {
  draft: "Черновик",
  collecting: "Сбор заявок",
  running: "Идет",
  finished: "Завершен",
};

const statusOptions = [
  { value: "draft", label: "Черновик" },
  { value: "collecting", label: "Сбор заявок" },
  { value: "running", label: "Идет" },
  { value: "finished", label: "Завершен" },
];

export const TournamentsTable: FC<TournamentsTableProps> = ({ className }) => {
  const createModal = useCreateTournamentModal();
  const updateModal = useUpdateTournamentModal();
  const updateMutation = useUpdateTournament();
  const queryClient = useQueryClient();

  const tournamentsQuery = useGetTournaments();

  const startTournamentMutation = useMutation({
    mutationFn: startTournament,
    onSuccess: (tournament) => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.TOURNAMENTS] },
        (oldData: GetTournamentsResponse | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((t) => (t.id === tournament.id ? tournament : t));
        }
      );
    },
  });

  const handleStartTournament = (tournament: Tournament) => {
    modals.openConfirmModal({
      title: "Запустить турнир",
      children: (
        <div>
          Вы уверены, что хотите запустить турнир{" "}
          <strong>{tournament.name}</strong>? Это действие нельзя отменить.
        </div>
      ),
      labels: { confirm: "Запустить", cancel: "Отмена" },
      confirmProps: { color: "blue" },
      onConfirm: () => {
        startTournamentMutation.mutate(tournament.id);
      },
    });
  };

  const handleUpdateStatus = (
    tournament: Tournament,
    status: TournamentStatus
  ) => {
    updateMutation.mutate({
      tournamentId: tournament.id,
      status,
    });
  };

  const columns = useMemo<MRT_ColumnDef<Tournament>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Название",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
      {
        accessorKey: "status",
        header: "Статус",
        sortingFn: "alphanumeric",
        filterFn: "equals",
        Cell: ({ cell }) => (
          <Badge variant="light">
            {statusLabels[cell.getValue() as TournamentStatus]}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Цена",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue()} ₽</>,
      },
      {
        accessorKey: "prizePool",
        header: "Призовой фонд",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => (
          <>{cell.getValue() ? `${cell.getValue()} ₽` : "-"}</>
        ),
      },
      {
        accessorKey: "eventDate",
        header: "Дата события",
        sortingFn: "datetime",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const date = cell.getValue() as string | null;
          if (!date) return "-";
          return new Date(date).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      {
        accessorKey: "createdAt",
        header: "Дата создания",
        sortingFn: "datetime",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue() as string);
          return date.toLocaleDateString("ru-RU");
        },
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: tournamentsQuery?.data ?? [],
    renderRowActions: ({ row }) => (
      <Menu>
        <Menu.Target>
          <ActionIcon variant="light">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEdit size={16} />}
            onClick={() => updateModal.updateTournament(row.original.id)}
          >
            Обновить турнир
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Изменить статус</Menu.Label>
          {statusOptions.map((option) => (
            <Menu.Item
              key={option.value}
              onClick={() =>
                handleUpdateStatus(
                  row.original,
                  option.value as TournamentStatus
                )
              }
              disabled={row.original.status === option.value}
            >
              {option.label}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconPray size={16} />}
            onClick={() => handleStartTournament(row.original)}
            disabled={row.original.status !== "collecting"}
          >
            Запустить турнир
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    enableRowActions: true,
    enableColumnOrdering: false,
    state: {
      isLoading: tournamentsQuery.isLoading,
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

  return (
    <>
      <div className={clsx("", className)}>
        <div className="flex gap-4 justify-between">
          <Title size="h1" className="mb-6">
            Турниры
          </Title>

          <Button size="sm" onClick={createModal.createTournament}>
            Создать турнир
          </Button>
        </div>
        <MantineReactTable table={table} />
      </div>
      {createModal.modal}
      {updateModal.modal}
    </>
  );
};
