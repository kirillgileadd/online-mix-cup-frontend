import { type FC } from "react";
import { useLobbyStore } from "./lobby.store.ts";
import { useNavigate } from "react-router-dom";
import { Button, Card, Group, Select, Stack, Title } from "@mantine/core";
import { Team } from "./Team.tsx";
import clsx from "clsx";
import { PlayerTable } from "./PlayerTable.tsx";
import { usePlayerStore } from "../../entitity/Player/player.store.ts";
import type { Player } from "../../entitity/Player/types.ts";
import { notifications } from "@mantine/notifications";

type LobbyProps = {
  className?: string;
};

export const Lobby: FC<LobbyProps> = ({ className }) => {
  const navigate = useNavigate();
  const lobbies = useLobbyStore((state) => state.lobbies);
  const teams = useLobbyStore((state) => state.teams);
  const chillZone = useLobbyStore((state) => state.chillZone);
  const setWinner = useLobbyStore((state) => state.setWinner);
  const loseLives = usePlayerStore((state) => state.loseLives);
  const incrementChillZone = usePlayerStore(
    (state) => state.incrementChillZone,
  );

  const handleNextRound = () => {
    if (!teams) {
      console.warn("Нет данных о командах");
      return;
    }
    const loserIds: string[] = [];
    let invalid = false;

    Object.entries(teams).forEach(([lobbyKey, t]) => {
      const hasNullPlayer = [...t.team1, ...t.team2].some((p) => p === null);
      if (hasNullPlayer || t.team1.length < 5 || t.team2.length < 5) {
        notifications.show({
          title: "Слоты",
          message: `Лобби ${lobbyKey}: есть незаполненные слоты команд`,
          color: "red",
        });
        invalid = true;
        return; // skip further processing this lobby
      }
      if (!t.winner) {
        notifications.show({
          title: "Винер",
          message: `Лобби ${lobbyKey}: победитель не выбран`,
          color: "red",
        });
        invalid = true;
        return;
      }
      // winner chosen and all players filled
      if (t.winner !== "team1") {
        loserIds.push(...t.team1.filter(Boolean).map((p) => (p as Player).id));
      }
      if (t.winner !== "team2") {
        loserIds.push(...t.team2.filter(Boolean).map((p) => (p as Player).id));
      }
    });

    if (invalid) return; // abort round finish

    if (loserIds.length) loseLives(loserIds);

    if (chillZone.length) {
      incrementChillZone(chillZone.map((p) => p.id));
    }

    navigate("/");
  };

  const handleWinnerChange = (lobbyKey: string, val: "team1" | "team2") => {
    setWinner(lobbyKey, val);
  };

  return (
    <div className={clsx("p-6 max-w-6xl mx-auto", className)}>
      <div className="flex justify-between items-center mb-6">
        <Title order={2} className="mb-6">
          Лобби турнира
        </Title>
        <Button color="green" size="md" onClick={handleNextRound}>
          Завершить раунд
        </Button>
      </div>

      <Stack>
        {lobbies.map((lobby, idx) => {
          const lobbyKey = `lobby-${idx}`;
          return (
            <Card
              key={lobbyKey}
              shadow="sm"
              padding="md"
              radius="md"
              bg="gray.8"
            >
              <div className="flex gap-4">
                <div className="flex-1 mb-6">
                  <Title order={4}>Лобби {idx + 1}</Title>
                  <PlayerTable data={lobby} lobbyKey={lobbyKey} />
                </div>
                <div className="flex-1">
                  <Title order={4}>Формирование команд</Title>
                  <Team
                    team={teams?.[lobbyKey]}
                    lobbyKey={lobbyKey}
                    players={lobby}
                  />
                  <Group align="center">
                    <span>Победила:</span>
                    <Select
                      data={[
                        { value: "team1", label: "Команда 1" },
                        { value: "team2", label: "Команда 2" },
                      ]}
                      value={teams?.[lobbyKey]?.winner || null}
                      onChange={(val) =>
                        handleWinnerChange(lobbyKey, val as "team1" | "team2")
                      }
                    />
                  </Group>
                </div>
              </div>
            </Card>
          );
        })}

        {chillZone.length > 0 && (
          <Card shadow="sm" padding="md" radius="md" bg="gray.8">
            <Title order={4} className="mb-2">
              Chill Zone
            </Title>
            <PlayerTable data={chillZone} />
          </Card>
        )}
      </Stack>
    </div>
  );
};
