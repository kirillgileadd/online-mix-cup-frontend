import { Title, Badge, Loader, Center, Text } from "@mantine/core";
import clsx from "clsx";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useEffect, useMemo, useRef } from "react";
import { useGetPublicPlayers } from "../model/useGetPublicPlayers";
import { useReactTable } from "../../../shared/useReactTable";
import type { Player, PlayerStatus } from "../../../entitity/Player";

type TournamentPlayersTableProps = {
  tournamentId: number;
  className?: string;
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

export const TournamentPlayersTable: FC<TournamentPlayersTableProps> = ({
  tournamentId,
  className,
  refreshToken,
}) => {
  const playersQuery = useGetPublicPlayers(tournamentId);
  const isFirstRefetch = useRef(true);
  const numericSortingFn = useMemo(
    () => (rowA: any, rowB: any, columnId: string) => {
      const valueA = Number(
        rowA.getValue(columnId) ?? Number.NEGATIVE_INFINITY
      );
      const valueB = Number(
        rowB.getValue(columnId) ?? Number.NEGATIVE_INFINITY
      );
      if (Number.isNaN(valueA) && Number.isNaN(valueB)) return 0;
      if (Number.isNaN(valueA)) return 1;
      if (Number.isNaN(valueB)) return -1;
      return valueA - valueB;
    },
    []
  );

  useEffect(() => {
    if (refreshToken === undefined) return;
    if (isFirstRefetch.current) {
      isFirstRefetch.current = false;
      return;
    }
    void playersQuery.refetch();
  }, [refreshToken, playersQuery]);

  const columns = useMemo<MRT_ColumnDef<Player>[]>(
    () => [
      {
        id: "position",
        header: "Место",
        enableSorting: false,
        enableColumnFilter: false,
        size: 60,
        Cell: ({ table, row }) => {
          const sortedRows = table.getPrePaginationRowModel().rows;
          const index = sortedRows.findIndex(
            (sortedRow) => sortedRow.id === row.id
          );
          return index + 1;
        },
      },
      {
        accessorKey: "nickname",
        header: "Игрок",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ row }) => (
          <>
            {row.original.nickname ||
              row.original.user?.username ||
              row.original.user?.telegramId ||
              "-"}
          </>
        ),
      },
      {
        accessorKey: "chillZoneValue",
        header: "Chill Zone",
        sortingFn: numericSortingFn,
        filterFn: "equals",
        Cell: ({ cell }) => <>{cell.getValue() ?? "-"}</>,
      },
      {
        accessorKey: "lives",
        header: "Жизни",
        sortingFn: numericSortingFn,
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
        accessorKey: "gameRoles",
        header: "Игровые роли",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ row }) => <>{row.original.gameRoles ?? "-"}</>,
      },
    ],
    [numericSortingFn]
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
