import { type FC, useMemo } from "react";
import { Select, Stack } from "@mantine/core";
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
      const inTeam1 = team?.team1.find((tp) => tp?.id === p.id);
      const inTeam2 = team?.team2.find((tp) => tp?.id === p.id);
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
    const player = players.find((p) => p.id === playerId) ?? null;

    setTeam(lobbyKey, teamKey, player, index);
  };

  return (
    <Stack mt="sm">
      <div>
        <div className="flex gap-2 w-full mb-2">
          <p className="basis-1/2">Команда 1</p>
          <p className="basis-1/2">Команда 2</p>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="flex gap-2" key={`${lobbyKey}`}>
            <div className="basis-1/2 mb-2">
              <Select
                data={getOptions(team?.team1[i]?.id)}
                value={team?.team1[i]?.id ?? null}
                onChange={(val) => handleSelectChange("team1", val, i)}
                // disabled={i === 0}
                style={{ width: "100%" }}
              />
            </div>
            <div className="basis-1/2">
              <Select
                data={getOptions(team?.team2[i]?.id)}
                value={team?.team2[i]?.id ?? null}
                onChange={(val) => handleSelectChange("team2", val, i)}
                // disabled={i === 0}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </Stack>
  );
};
