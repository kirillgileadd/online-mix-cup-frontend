import { type FC, useMemo } from "react";
import { Badge, ActionIcon, Tooltip, Text, Group } from "@mantine/core";
import { IconReplace, IconShieldCheck } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useReactTable } from "../../../shared/useReactTable";
import type { Participation, Team } from "../../../shared/api/lobbies";

type LobbyParticipantsTableProps = {
  participations: Participation[];
  teams: Team[];
  team1: Team | null;
  team2: Team | null;
  captain1: Participation | null;
  captain2: Participation | null;
  readonly?: boolean;
  onReplacePlayer?: (playerId: number) => void;
  isReplacing?: boolean;
};

const getTeamLabel = (team: Team | null, captain?: Participation | null) => {
  if (captain) {
    const namePattern = (name?: string | null) =>
      name ? `${name}'s Team` : undefined;
    const name =
      namePattern(captain.player?.user?.nickname) ||
      namePattern(captain.player?.user?.username) ||
      namePattern(captain.player?.username) ||
      "Неизвестно";
    return name;
  }
  return team ? `Команда #${team.id}` : "Команда";
};

const getPlayerName = (participant: Participation) =>
  participant.player?.user?.nickname ||
  participant.player?.user?.username ||
  participant.player?.username ||
  "Неизвестно";

export const LobbyParticipantsTable: FC<LobbyParticipantsTableProps> = ({
  participations,
  teams,
  team1,
  team2,
  captain1,
  captain2,
  readonly = false,
  onReplacePlayer,
  isReplacing = false,
}) => {
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

  const columns = useMemo<MRT_ColumnDef<Participation>[]>(
    () => [
      {
        accessorKey: "player.user.nickname",
        header: "Игрок",
        accessorFn: (row) => getPlayerName(row),
        sortingFn: "alphanumeric",
        filterFn: "contains",
        size: 150,
      },
      {
        accessorKey: "player.mmr",
        header: "MMR",
        sortingFn: numericSortingFn,
        filterFn: "equals",
        size: 80,
        Cell: ({ row }) => <>{row.original.player?.mmr ?? "-"}</>,
      },
      {
        accessorKey: "player.lives",
        header: "Жизни",
        sortingFn: numericSortingFn,
        filterFn: "equals",
        size: 80,
        Cell: ({ row }) => <>{row.original.player?.lives ?? "-"}</>,
      },
      {
        accessorKey: "player.gameRoles",
        header: "Роли",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        size: 120,
        Cell: ({ row }) => <>{row.original.player?.gameRoles ?? "-"}</>,
      },
      {
        id: "team",
        header: "Команда",
        accessorFn: (row) => {
          if (!row.teamId) return null;
          const team = teams.find((t) => t.id === row.teamId);
          const captain = row.teamId === team1?.id ? captain1 : captain2;
          return team ? getTeamLabel(team, captain) : null;
        },
        sortingFn: "alphanumeric",
        filterFn: "contains",
        size: 180,
        Cell: ({ row }) => {
          if (!row.original.teamId) return <Text c="dimmed">-</Text>;
          const team = teams.find((t) => t.id === row.original.teamId);
          const captain =
            row.original.teamId === team1?.id ? captain1 : captain2;
          return (
            <Group gap={4} wrap="nowrap">
              <Badge
                size="xs"
                variant="light"
                color={row.original.teamId === team1?.id ? "red" : "blue"}
              >
                {getTeamLabel(team || null, captain)}
              </Badge>
              {row.original.isCaptain && (
                <IconShieldCheck size={16} color="white" />
              )}
            </Group>
          );
        },
      },
      ...(readonly || !onReplacePlayer
        ? []
        : [
            {
              id: "actions",
              header: "Действия",
              enableSorting: false,
              enableColumnFilter: false,
              size: 80,
              Cell: ({ row }: { row: { original: Participation } }) => (
                <Tooltip label="Заменить игрока">
                  <ActionIcon
                    variant="subtle"
                    color="orange"
                    size="sm"
                    onClick={() => onReplacePlayer(row.original.playerId)}
                    loading={isReplacing}
                  >
                    <IconReplace size={16} />
                  </ActionIcon>
                </Tooltip>
              ),
            },
          ]),
    ],
    [
      numericSortingFn,
      teams,
      team1,
      team2,
      captain1,
      captain2,
      readonly,
      onReplacePlayer,
      isReplacing,
    ]
  );

  const table = useReactTable({
    columns,
    data: participations,
    enableRowActions: false,
    enableBottomToolbar: false,
    enableColumnOrdering: false,
    enableFilters: false,
    enablePagination: false,
    defaultColumn: {
      minSize: 20,
      maxSize: 180,
      size: 90,
    },
    mantinePaperProps: {
      className: "bg-[var(--color-dark-600)]",
    },
    mantineTableProps: {
      className: "bg-[var(--color-dark-600)]",
    },
    mantineTableBodyRowProps: () => ({
      className: "bg-[var(--color-dark-600)]",
    }),
    mantineTableHeadCellProps: {
      className: "bg-[var(--color-dark-600)]!",
    },
    mantineTableBodyCellProps: {
      className: "bg-[var(--color-dark-600)]",
    },
    enableColumnFilters: false,
    enableTopToolbar: false,
    enableGlobalFilter: false,
    initialState: {
      density: "xs",
    },
  });

  return <MantineReactTable table={table} />;
};
