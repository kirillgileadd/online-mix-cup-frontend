import { type FC, useMemo } from "react";
import {
  Card,
  Title,
  Button,
  Group,
  Badge,
  Stack,
  Select,
  Text,
} from "@mantine/core";
import type { Lobby, Participation } from "../../../shared/api/lobbies";
import { useStartDraft, useDraftPick, useFinishLobby } from "../index";
import { notifications } from "@mantine/notifications";

type LobbyCardProps = {
  lobby: Lobby;
  readonly?: boolean;
};

const getStatusColor = (status: Lobby["status"]) => {
  switch (status) {
    case "PENDING":
      return "gray";
    case "DRAFTING":
      return "blue";
    case "PLAYING":
      return "yellow";
    case "FINISHED":
      return "green";
    default:
      return "gray";
  }
};

const getStatusLabel = (status: Lobby["status"]) => {
  switch (status) {
    case "PENDING":
      return "Ожидание";
    case "DRAFTING":
      return "Драфт";
    case "PLAYING":
      return "Игра";
    case "FINISHED":
      return "Завершено";
    default:
      return status;
  }
};

export const LobbyCard: FC<LobbyCardProps> = ({ lobby, readonly }) => {
  const startDraftMutation = useStartDraft();
  const draftPickMutation = useDraftPick();
  const finishLobbyMutation = useFinishLobby();

  const getPlayerName = (participant: Participation) =>
    participant.player?.nickname ||
    participant.player?.username ||
    "Неизвестно";

  // Группируем участников по командам
  const team1 = useMemo(
    () =>
      lobby.participations
        .filter((p) => p.team === 1)
        .sort((a, b) => {
          if (a.isCaptain && !b.isCaptain) return -1;
          if (!a.isCaptain && b.isCaptain) return 1;
          return 0;
        }),
    [lobby.participations]
  );

  const team2 = useMemo(
    () =>
      lobby.participations
        .filter((p) => p.team === 2)
        .sort((a, b) => {
          if (a.isCaptain && !b.isCaptain) return -1;
          if (!a.isCaptain && b.isCaptain) return 1;
          return 0;
        }),
    [lobby.participations]
  );

  const unassigned = useMemo(
    () => lobby.participations.filter((p) => !p.team),
    [lobby.participations]
  );

  // Определяем, кто должен выбирать сейчас
  const getCurrentPicker = () => {
    if (lobby.status !== "DRAFTING") return null;

    const captains = lobby.participations.filter((p) => p.isCaptain);
    const captain1 = captains.find((p) => p.team === 1);
    const captain2 = captains.find((p) => p.team === 2);

    if (!captain1 || !captain2) return null;

    // Считаем количество выбранных игроков (не капитанов)
    const pickedCount = lobby.participations.filter(
      (p) => p.pickedAt && !p.isCaptain
    ).length;

    // Определяем порядок выбора
    const captain1MMR = captain1.player?.mmr || 0;
    const captain2MMR = captain2.player?.mmr || 0;

    // Капитан с большим MMR начинает первым
    const higherMMRCaptain = captain1MMR >= captain2MMR ? captain1 : captain2;
    const lowerMMRCaptain = captain1MMR >= captain2MMR ? captain2 : captain1;

    // Первый выбор делает капитан с большим MMR
    // Затем по очереди: 1-2-2-1-1-2-2-1-1-2
    if (pickedCount === 0) {
      return higherMMRCaptain;
    }

    // Паттерн выбора: 1-2-2-1-1-2-2-1-1-2
    const pattern = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1]; // 0 = higher, 1 = lower
    const turn = pattern[pickedCount % pattern.length];
    return turn === 0 ? higherMMRCaptain : lowerMMRCaptain;
  };

  const currentPicker = getCurrentPicker();

  const handleStartDraft = async () => {
    try {
      await startDraftMutation.mutateAsync(lobby.id);
      notifications.show({
        title: "Успех",
        message: "Драфт начат",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось начать драфт",
        color: "red",
      });
    }
  };

  const handleDraftPick = async (playerId: number, team: number) => {
    try {
      await draftPickMutation.mutateAsync({
        lobbyId: lobby.id,
        playerId,
        team,
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось выбрать игрока",
        color: "red",
      });
    }
  };

  const handleFinishLobby = async (winningTeam: number) => {
    try {
      await finishLobbyMutation.mutateAsync({
        lobbyId: lobby.id,
        winningTeam,
      });
      notifications.show({
        title: "Успех",
        message: "Лобби завершено",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось завершить лобби",
        color: "red",
      });
    }
  };

  const buildPlayerOptions = (currentPlayerId?: number | null) => {
    const options = [...unassigned];

    if (
      currentPlayerId &&
      !options.some((player) => player.playerId === currentPlayerId)
    ) {
      const current = lobby.participations.find(
        (participation) => participation.playerId === currentPlayerId
      );
      if (current) {
        options.push(current);
      }
    }

    return options.map((participant) => ({
      value: String(participant.playerId),
      label: `${getPlayerName(participant)} (MMR: ${
        participant.player?.mmr || 0
      }, Жизни: ${participant.player?.lives ?? "-"})`,
    }));
  };

  const renderDraftSelects = (teamNumber: 1 | 2, team: Participation[]) => (
    <Stack gap="xs" mt="sm">
      {Array.from({ length: 5 }).map((_, index) => {
        const slot = team[index];
        const label = `Игрок ${index + 1}`;
        const isDisabled = lobby.status !== "DRAFTING" || !!readonly;

        return (
          <Select
            key={`${teamNumber}-${index}`}
            label={label}
            placeholder="Выберите игрока"
            data={buildPlayerOptions(slot?.playerId ?? null)}
            value={slot ? String(slot.playerId) : null}
            disabled={isDisabled}
            description={
              slot
                ? `MMR: ${slot.player?.mmr ?? "-"} · Жизни: ${
                    slot.player?.lives ?? "-"
                  }${slot.isCaptain ? " · Капитан" : ""}`
                : undefined
            }
            onChange={(value) => {
              if (value && !readonly) {
                handleDraftPick(Number(value), teamNumber);
              }
            }}
            clearable={!readonly && lobby.status === "DRAFTING"}
          />
        );
      })}
    </Stack>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group>
            <Title order={4}>Лобби #{lobby.id}</Title>
            <Badge color={getStatusColor(lobby.status)}>
              {getStatusLabel(lobby.status)}
            </Badge>
            <Text size="sm" c="dimmed">
              Раунд {lobby.round}
            </Text>
          </Group>

          {lobby.status === "PENDING" && !readonly && (
            <Button
              onClick={handleStartDraft}
              loading={startDraftMutation.isPending}
            >
              Начать драфт
            </Button>
          )}

          {lobby.status === "DRAFTING" && (
            <>
              {team1.length === 5 && team2.length === 5 ? (
                <Badge color="green">Драфт завершен</Badge>
              ) : currentPicker ? (
                <Text size="sm" c="blue" fw={500}>
                  Выбирает: {getPlayerName(currentPicker)}
                </Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Ожидание начала драфта
                </Text>
              )}
            </>
          )}

          {lobby.status === "PLAYING" && !readonly && (
            <Group>
              <Select
                placeholder="Выберите победителя"
                data={[
                  { value: "1", label: "Команда 1" },
                  { value: "2", label: "Команда 2" },
                ]}
                onChange={(value) => {
                  if (value) {
                    handleFinishLobby(Number(value));
                  }
                }}
              />
            </Group>
          )}
          {lobby.status === "PLAYING" && readonly && (
            <Badge color="yellow" variant="light">
              Идет матч
            </Badge>
          )}
        </Group>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:basis-1/2 md:flex-1 min-w-0">
            <div>
              <Group justify="space-between" mb="xs">
                <Title order={5}>Команда 1</Title>
                <Badge color="gray">{team1.length}/5</Badge>
              </Group>
              {renderDraftSelects(1, team1)}
            </div>

            <div>
              <Group justify="space-between" mb="xs">
                <Title order={5}>Команда 2</Title>
                <Badge color="gray">{team2.length}/5</Badge>
              </Group>
              {renderDraftSelects(2, team2)}
            </div>
          </div>

          <Stack gap="xs" className="md:basis-1/2 md:flex-1 min-w-0">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Игроки лобби</Title>
              <Badge color="blue">{lobby.participations.length}</Badge>
            </Group>
            {lobby.participations.map((participant) => (
              <div
                key={participant.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dark-400 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Text fw={600}>{getPlayerName(participant)}</Text>
                  {participant.isCaptain && (
                    <Badge size="xs" color="blue">
                      Капитан
                    </Badge>
                  )}
                  {participant.team && (
                    <Badge
                      size="xs"
                      color={participant.team === 1 ? "teal" : "grape"}
                    >
                      Команда {participant.team}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex gap-4 text-gray-400">
                    <span>MMR: {participant.player?.mmr ?? "-"}</span>
                    <span>Роли: {participant.player?.gameRoles ?? "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </Card>
  );
};
