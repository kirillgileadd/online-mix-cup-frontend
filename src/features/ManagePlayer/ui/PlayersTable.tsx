import {
  ActionIcon,
  Menu,
  Title,
  Badge,
  Select,
  Button,
  Group,
} from "@mantine/core";
import clsx from "clsx";
import { IconDots, IconEdit, IconPlus } from "@tabler/icons-react";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_SortingFn,
} from "mantine-react-table";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { useGetPlayers } from "../model/useGetPlayers";
import { useReactTable } from "../../../shared/useReactTable";
import type { Player, PlayerStatus } from "../../../entitity/Player";
import { useUpdatePlayerModal } from "./useUpdatePlayerModal";
import { useCreatePlayerModal } from "./useCreatePlayerModal";
import { useGetTournaments } from "../../ManageTournament/model/useGetTournaments";

type PlayersTableProps = {
  className?: string;
  title?: string;
  lockedTournamentId?: number;
  showCreateButton?: boolean;
  showTournamentFilter?: boolean;
  refreshToken?: number;
};

const statusLabels: Record<PlayerStatus, string> = {
  active: "Активен",
  eliminated: "Выбыл",
  inactive: "Неактивен",
};

const statusColors: Record<PlayerStatus, string> = {
  active: "green",
  eliminated: "red",
  inactive: "gray",
};

const numericWithNulls: MRT_SortingFn<Player> = (rowA, rowB, columnId) => {
  const a = rowA.getValue<number | null>(columnId);
  const b = rowB.getValue<number | null>(columnId);
  const valA = a ?? Number.NEGATIVE_INFINITY;
  const valB = b ?? Number.NEGATIVE_INFINITY;
  if (valA === valB) return 0;
  return valA > valB ? 1 : -1;
};

export const PlayersTable: FC<PlayersTableProps> = ({
  className,
  title = "Игроки",
  lockedTournamentId,
  showCreateButton = true,
  showTournamentFilter = true,
  refreshToken,
}) => {
  const [tournamentId, setTournamentId] = useState<number | undefined>(
    lockedTournamentId
  );

  console.log("lockedTournamentId", lockedTournamentId, tournamentId);

  useEffect(() => {
    if (lockedTournamentId !== undefined) {
      setTournamentId(lockedTournamentId);
    }
  }, [lockedTournamentId]);

  const effectiveTournamentId =
    lockedTournamentId !== undefined ? lockedTournamentId : tournamentId;
  const createModal = useCreatePlayerModal();
  const updateModal = useUpdatePlayerModal();
  const playersQuery = useGetPlayers(
    effectiveTournamentId ? { tournamentId: effectiveTournamentId } : undefined
  );
  const tournamentsQuery = useGetTournaments();
  const shouldSkipFirstRefetch = useRef(true);

  useEffect(() => {
    if (refreshToken === undefined) return;
    if (shouldSkipFirstRefetch.current) {
      shouldSkipFirstRefetch.current = false;
      return;
    }
    void playersQuery.refetch();
  }, [refreshToken, playersQuery]);

  const tournamentOptions = useMemo(() => {
    return (
      tournamentsQuery.data?.map((t) => ({
        value: t.id.toString(),
        label: t.name,
      })) ?? []
    );
  }, [tournamentsQuery.data]);

  const handleEdit = (player: Player) => {
    updateModal.open(player.id, {
      tournamentId: effectiveTournamentId,
    });
  };

  const columns = useMemo<MRT_ColumnDef<Player>[]>(
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
        accessorKey: "user.nickname",
        header: "Никнейм",
        accessorFn: (row) => row.user?.nickname || "-",
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
        accessorKey: "mmr",
        header: "MMR",
        sortingFn: numericWithNulls,
        filterFn: "equals",
        Cell: ({ row }) => <>{row.original.mmr ?? "-"}</>,
      },
      {
        accessorKey: "chillZoneValue",
        header: "Chill Zone",
        sortingFn: numericWithNulls,
        filterFn: "equals",
        Cell: ({ row }) => <>{row.original.chillZoneValue ?? "-"}</>,
      },
      {
        accessorKey: "lives",
        header: "Жизни",
        sortingFn: numericWithNulls,
        filterFn: "equals",
        Cell: ({ row }) => <>{row.original.lives ?? "-"}</>,
      },
      {
        accessorKey: "status",
        header: "Статус",
        sortingFn: "alphanumeric",
        filterFn: "equals",
        Cell: ({ cell }) => (
          <Badge
            variant="light"
            color={statusColors[cell.getValue() as PlayerStatus]}
          >
            {statusLabels[cell.getValue() as PlayerStatus]}
          </Badge>
        ),
      },
      {
        accessorKey: "gameRoles",
        header: "Игровые роли",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ row }) => <>{row.original.gameRoles ?? "-"}</>,
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
    data: playersQuery?.data ?? [],
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
            onClick={() => handleEdit(row.original)}
          >
            Редактировать
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    enableRowActions: true,
    enableColumnOrdering: false,
    state: {
      isLoading: playersQuery.isLoading,
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
        <Title size="h1">{title}</Title>
        <Group gap="md">
          {showCreateButton && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() =>
                createModal.open({ tournamentId: effectiveTournamentId })
              }
            >
              Создать игрока
            </Button>
          )}
          {showTournamentFilter && lockedTournamentId === undefined && (
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
          )}
          {lockedTournamentId !== undefined && (
            <Badge color="gray" variant="light">
              Турнир #{lockedTournamentId}
            </Badge>
          )}
        </Group>
      </div>
      <MantineReactTable table={table} />
      {createModal.content}
      {updateModal.content}
    </div>
  );
};
