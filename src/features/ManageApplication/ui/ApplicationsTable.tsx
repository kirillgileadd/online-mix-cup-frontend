import { ActionIcon, Menu, Title, Badge, Select, Image } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import { IconDots, IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo, useState } from "react";
import { useGetPendingApplications } from "../model/useGetPendingApplications";
import { useApproveApplication } from "../model/useApproveApplication";
import { useRejectApplication } from "../model/useRejectApplication";
import { useDeleteApplication } from "../model/useDeleteApplication";
import { useReactTable } from "@/shared/useReactTable";
import type { Application, ApplicationStatus } from "@/entitity/Application";
import { useGetTournaments } from "../../ManageTournament/model/useGetTournaments";

type ApplicationsTableProps = {
  className?: string;
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "На модерации",
  approved: "Одобрена",
  rejected: "Отклонена",
};

export const ApplicationsTable: FC<ApplicationsTableProps> = ({
  className,
}) => {
  const [tournamentId, setTournamentId] = useState<number | undefined>(
    undefined
  );
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();
  const deleteMutation = useDeleteApplication();
  const applicationsQuery = useGetPendingApplications(
    tournamentId ? { tournamentId } : undefined
  );
  const tournamentsQuery = useGetTournaments();

  const tournamentOptions = useMemo(() => {
    return (
      tournamentsQuery.data?.map((t) => ({
        value: t.id.toString(),
        label: t.name,
      })) ?? []
    );
  }, [tournamentsQuery.data]);

  const handleApprove = (application: Application) => {
    modals.openConfirmModal({
      title: "Одобрить заявку",
      children: (
        <div>
          Вы уверены, что хотите одобрить заявку от{" "}
          <strong>
            {application.user?.username || application.user?.telegramId}
          </strong>
          ?
        </div>
      ),
      labels: { confirm: "Одобрить", cancel: "Отмена" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        approveMutation.mutate(application.id);
      },
    });
  };

  const handleReject = (application: Application) => {
    modals.openConfirmModal({
      title: "Отклонить заявку",
      children: (
        <div>
          Вы уверены, что хотите отклонить заявку от{" "}
          <strong>
            {application.user?.username || application.user?.telegramId}
          </strong>
          ?
        </div>
      ),
      labels: { confirm: "Отклонить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        rejectMutation.mutate(application.id);
      },
    });
  };

  const handleDelete = (application: Application) => {
    modals.openConfirmModal({
      title: "Удалить заявку",
      children: (
        <div>
          Вы уверены, что хотите удалить заявку от{" "}
          <strong>
            {application.user?.username || application.user?.telegramId}
          </strong>
          ? Это действие нельзя отменить.
        </div>
      ),
      labels: { confirm: "Удалить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMutation.mutate(application.id);
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        sortingFn: "numeric",
        filterFn: "equals",
      },
      {
        accessorKey: "user.username",
        header: "Пользователь",
        accessorFn: (row) => row.user?.username || row.user?.telegramId || "-",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
      {
        accessorKey: "tournament.name",
        header: "Турнир",
        accessorFn: (row) => row.tournament?.name || "-",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
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
        accessorKey: "dotabuff",
        header: "Dotabuff",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | null | undefined;
          if (!value) return <>-</>;
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {value}
            </a>
          );
        },
      },
      {
        accessorKey: "receiptImageUrl",
        header: "Чек",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | null | undefined;
          if (!value) return <>-</>;
          const imageUrl = `${import.meta.env.VITE_ENVOY_API_URL}${value}`;
          return (
            <Image
              src={imageUrl}
              alt="Чек"
              width={100}
              height={100}
              fit="contain"
              className="cursor-pointer"
              onClick={() => {
                window.open(imageUrl, "_blank");
              }}
            />
          );
        },
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
    renderRowActions: ({ row }) => (
      <Menu>
        <Menu.Target>
          <ActionIcon variant="light">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconCheck size={16} />}
            onClick={() => handleApprove(row.original)}
            disabled={row.original.status !== "pending"}
            color="green"
          >
            Одобрить
          </Menu.Item>
          <Menu.Item
            leftSection={<IconX size={16} />}
            onClick={() => handleReject(row.original)}
            disabled={row.original.status !== "pending"}
            color="red"
          >
            Отклонить
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconTrash size={16} />}
            onClick={() => handleDelete(row.original)}
            color="red"
          >
            Удалить заявку
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    enableRowActions: true,
    enableColumnOrdering: false,
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

  return (
    <div className={clsx("", className)}>
      <div className="flex gap-4 justify-between items-center mb-6">
        <Title size="h1">Заявки</Title>
        <Select
          placeholder="Все турниры"
          data={[{ value: "", label: "Все турниры" }, ...tournamentOptions]}
          value={tournamentId?.toString() || ""}
          onChange={(value) =>
            setTournamentId(value ? Number(value) : undefined)
          }
          clearable
          style={{ width: 250 }}
        />
      </div>
      <MantineReactTable table={table} />
    </div>
  );
};
