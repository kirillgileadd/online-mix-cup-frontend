import { type FC, useMemo } from "react";
import { Select, Stack, Table } from "@mantine/core";
import { type LobbyTeams, useLobbyStore } from "./lobby.store";
import type { Player } from "../../entitity/Player";

type TeamProps = {
  lobbyKey: string;
  team?: LobbyTeams;
  players: Player[];
};

export const Team: FC<TeamProps> = ({ lobbyKey, team, players }) => {
  const setTeam = useLobbyStore((state) => state.setTeam);

  // Игроки, которых можно выбрать (не в других слотах)
  const validPlayerForSelect = useMemo(() => {
    return players.filter((p) => {
      const inTeam1 = team?.team1.find((tp) => tp.id === p.id);
      const inTeam2 = team?.team2.find((tp) => tp.id === p.id);
      return !inTeam1 && !inTeam2;
    });
  }, [team, players]);

  // Функция для формирования опций селекта для каждой позиции
  const getOptions = (currentPlayerId?: string) => {
    const optionsPlayers = [...validPlayerForSelect];

    // Добавляем текущего игрока на этой позиции, чтобы value отображался
    if (currentPlayerId) {
      const alreadySelected = players.find((p) => p.id === currentPlayerId);
      if (
        alreadySelected &&
        !optionsPlayers.some((p) => p.id === currentPlayerId)
      ) {
        optionsPlayers.push(alreadySelected);
      }
    }

    return optionsPlayers.map((p) => ({ label: p.nickname, value: p.id }));
  };

  // Обработчик выбора игрока
  const handleSelectChange = (
    teamKey: "team1" | "team2",
    playerId: string | null,
    index: number,
  ) => {
    if (!playerId) return;
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    setTeam(lobbyKey, teamKey, player, index);
  };

  return (
    <Stack mt="sm">
      <Table striped highlightOnHover verticalSpacing="md">
        <thead className="text-center">
          <tr>
            <th>Команда 1</th>
            <th>Команда 2</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={`${lobbyKey}-team-${i}`}>
              <td>
                <Select
                  data={getOptions(team?.team1[i]?.id)}
                  value={team?.team1[i]?.id ?? ""}
                  onChange={(val) => handleSelectChange("team1", val, i)}
                  // disabled={i === 0}
                  style={{ width: "100%" }}
                />
              </td>
              <td>
                <Select
                  data={getOptions(team?.team2[i]?.id)}
                  value={team?.team2[i]?.id ?? ""}
                  onChange={(val) => handleSelectChange("team2", val, i)}
                  // disabled={i === 0}
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Stack>
  );
};
