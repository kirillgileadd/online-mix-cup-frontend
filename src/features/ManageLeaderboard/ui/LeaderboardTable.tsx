import { ActionIcon, Menu, Button, Group, Avatar } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import {
  IconDots,
  IconEdit,
  IconPlus,
  IconTrash,
  IconCoin,
  IconUser,
} from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo } from "react";
import { useGetLeaderboard } from "../model/useGetLeaderboard";
import { useReactTable } from "../../../shared/useReactTable";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import { useUpdateLeaderboardModal } from "./useUpdateLeaderboardModal";
import { useCreateLeaderboardModal } from "./useCreateLeaderboardModal";
import { useDeleteLeaderboard } from "../model/useDeleteLeaderboard";
import { useAddPointsModal } from "./useAddPointsModal";
import { AppCan, useAppPermissions } from "../../../shared/authorization";

type LeaderboardTableProps = {
  className?: string;
};

export const LeaderboardTable: FC<LeaderboardTableProps> = ({ className }) => {
  const createModal = useCreateLeaderboardModal();
  const updateModal = useUpdateLeaderboardModal();
  const deleteMutation = useDeleteLeaderboard();
  const addPointsModal = useAddPointsModal();
  const leaderboardQuery = useGetLeaderboard();
  const permissions = useAppPermissions();

  const handleEdit = (leaderboard: Leaderboard) => {
    updateModal.open(leaderboard.id);
  };

  const handleDelete = (leaderboard: Leaderboard) => {
    const userName =
      leaderboard.user?.username ||
      leaderboard.user?.nickname ||
      leaderboard.user?.telegramId ||
      "пользователя";

    modals.openConfirmModal({
      title: "Удалить запись из лидерборда",
      children: (
        <div>
          Вы уверены, что хотите удалить запись для <strong>{userName}</strong>?
          Это действие нельзя отменить.
        </div>
      ),
      labels: { confirm: "Удалить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMutation.mutate(leaderboard.id);
      },
    });
  };

  const handleAddPoints = (leaderboard: Leaderboard) => {
    if (leaderboard.userId) {
      addPointsModal.open(leaderboard.userId);
    }
  };

  const getRankBorderColor = (rank: number | null) => {
    if (rank === 1) return "border-yellow-500";
    if (rank === 2) return "border-gray-400";
    if (rank === 3) return "border-orange-500";
    return "border-dark-600";
  };

  const columns = useMemo<MRT_ColumnDef<Leaderboard>[]>(
    () => [
      {
        accessorKey: "rank",
        header: "#",
        // sortingFn: "numeric",
        // filterFn: "equals",
        Cell: ({ row }) => <>{row.original.rank ?? "-"}</>,
      },
      {
        accessorKey: "user",
        header: "Пользователь",
        accessorFn: (row) =>
          row.user?.nickname ||
          row.user?.username ||
          row.user?.telegramId ||
          "-",
        Cell: ({ row }) => {
          const rank = row.original.rank;
          const borderColor = getRankBorderColor(rank);
          const displayName =
            row.original.user?.nickname ||
            row.original.user?.username ||
            row.original.user?.telegramId ||
            "-";
          return (
            <div className="flex items-center gap-3">
              <Avatar
                size={40}
                radius={1000}
                src={row.original.user?.photoUrl || undefined}
                className={`border-2 ${borderColor}`}
              >
                {!row.original.user?.photoUrl && (
                  <IconUser size={20} className="text-gray-400" />
                )}
              </Avatar>
              <span>{displayName}</span>
            </div>
          );
        },
        // sortingFn: "alphanumeric",
        // filterFn: "contains",
      },
      {
        accessorKey: "points",
        header: "Очки",
        // sortingFn: "numeric",
        // filterFn: "equals",
        Cell: ({ row }) => <>{row.original.points}</>,
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: leaderboardQuery?.data ?? [],
    renderRowActions: ({ row }) => (
      <AppCan action={(permissions) => permissions.users.canManage()}>
        <Menu>
          <Menu.Target>
            <ActionIcon variant="light">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => handleEdit(row.original)}
            >
              Редактировать
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCoin size={16} />}
              onClick={() => handleAddPoints(row.original)}
            >
              Добавить очки
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={() => handleDelete(row.original)}
            >
              Удалить
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </AppCan>
    ),
    enableRowActions: !!permissions.users.canManage(),
    enableColumnOrdering: false,
    state: {
      isLoading: leaderboardQuery.isLoading,
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
      <div className="flex gap-4 justify-between items-center mb-6 flex-wrap">
        <AppCan action={(permissions) => permissions.users.canManage()}>
          <Group gap="md">
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => createModal.open()}
            >
              Создать запись
            </Button>
          </Group>
        </AppCan>
      </div>
      <MantineReactTable table={table} />
      {createModal.content}
      {updateModal.content}
      {addPointsModal.content}
    </div>
  );
};
