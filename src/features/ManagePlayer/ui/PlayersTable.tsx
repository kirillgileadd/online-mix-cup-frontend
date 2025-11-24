import { ActionIcon, Menu, Title, Badge, Select, Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import { IconDots, IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo, useState } from "react";
import { useGetPlayers } from "../model/useGetPlayers";
import { useReactTable } from "../../../shared/useReactTable";
import type { Player, PlayerStatus } from "../../../entitity/Player";
import { useUpdatePlayerModal } from "./useUpdatePlayerModal";
import { useCreatePlayerModal } from "./useCreatePlayerModal";
import { useGetTournaments } from "../../ManageTournament/model/useGetTournaments";

type PlayersTableProps = {
  className?: string;
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

export const PlayersTable: FC<PlayersTableProps> = ({ className }) => {
  const [tournamentId, setTournamentId] = useState<number | undefined>(
    undefined
  );
  const createModal = useCreatePlayerModal();
  const updateModal = useUpdatePlayerModal();
  const playersQuery = useGetPlayers(
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

  const handleEdit = (player: Player) => {
    updateModal.open(player.id);
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
        accessorKey: "tournament.name",
        header: "Турнир",
        accessorFn: (row) => row.tournament?.name || "-",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
      {
        accessorKey: "seed",
        header: "Сид",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue() ?? "-"}</>,
      },
      {
        accessorKey: "score",
        header: "Очки",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue() ?? "-"}</>,
      },
      {
        accessorKey: "chillZoneValue",
        header: "Chill Zone",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue() ?? "-"}</>,
      },
      {
        accessorKey: "lives",
        header: "Жизни",
        sortingFn: "numeric",
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue() ?? "-"}</>,
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
      <div className="flex gap-4 justify-between items-center mb-6">
        <Title size="h1">Игроки</Title>
        <Group gap="md">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => createModal.open()}
          >
            Создать игрока
          </Button>
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
        </Group>
      </div>
      <MantineReactTable table={table} />
      {createModal.content}
      {updateModal.content}
    </div>
  );
};

