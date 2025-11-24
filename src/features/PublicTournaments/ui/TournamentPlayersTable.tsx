import { Title, Badge, Loader, Center, Text } from "@mantine/core";
import clsx from "clsx";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo } from "react";
import { useGetPublicPlayers } from "../model/useGetPublicPlayers";
import { useReactTable } from "../../../shared/useReactTable";
import type { Player, PlayerStatus } from "../../../entitity/Player";

type TournamentPlayersTableProps = {
  tournamentId: number;
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

export const TournamentPlayersTable: FC<TournamentPlayersTableProps> = ({
  tournamentId,
  className,
}) => {
  const playersQuery = useGetPublicPlayers(tournamentId);

  const columns = useMemo<MRT_ColumnDef<Player>[]>(
    () => [
      {
        accessorKey: "user.username",
        header: "Пользователь",
        accessorFn: (row) => row.user?.username || row.user?.telegramId || "-",
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
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: playersQuery?.data ?? [],
    enableRowActions: false,
    enableColumnOrdering: false,
    enableFilters: false,
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

  if (playersQuery.isLoading) {
    return (
      <Center className={clsx("py-12", className)}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (playersQuery.isError) {
    return (
      <div className={clsx("py-12", className)}>
        <Text c="red">Ошибка при загрузке игроков</Text>
      </div>
    );
  }

  return (
    <div className={clsx("", className)}>
      <Title size="h2" mb="xl">
        Игроки турнира
      </Title>
      {playersQuery.data && playersQuery.data.length === 0 ? (
        <Text c="dimmed">Игроки не найдены</Text>
      ) : (
        <MantineReactTable table={table} />
      )}
    </div>
  );
};

