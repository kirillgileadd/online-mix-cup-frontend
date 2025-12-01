import { type FC, useMemo, useState, useEffect } from "react";
import {
  Card,
  Title,
  Button,
  Group,
  Badge,
  Stack,
  Select,
  Text,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconReplace } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import type { Lobby, Participation } from "../../../shared/api/lobbies";
import {
  useStartDraft,
  useDraftPick,
  useStartPlaying,
  useFinishLobby,
  useReplacePlayer,
} from "../index";
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

const getTeamLabel = (team: number, captain?: Participation | null) => {
  if (captain) {
    const namePattern = (name?: string) => `${name}'s Team`;
    const name =
      namePattern(captain.player?.nickname) ||
      namePattern(captain.player?.username) ||
      "Неизвестно";
    return name;
  }
  return team === 1 ? "Команда 1" : "Команда 2";
};

export const LobbyCard: FC<LobbyCardProps> = ({ lobby, readonly }) => {
  const startDraftMutation = useStartDraft();
  const draftPickMutation = useDraftPick();
  const startPlayingMutation = useStartPlaying();
  const finishLobbyMutation = useFinishLobby();
  const replacePlayerMutation = useReplacePlayer();

  // Победитель жребия (рандомно выбранный капитан)
  const [lotteryWinnerId, setLotteryWinnerId] = useState<number | null>(null);
  // Капитан, который будет делать первый пик (выбирается победителем жребия)
  const [firstPickerId, setFirstPickerId] = useState<number | null>(null);

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

  const hasFullTeams =
    team1.length === 5 && team2.length === 5 && lobby.status === "DRAFTING";

  // Определяем победившую команду
  const winningTeam = useMemo(() => {
    if (lobby.status !== "FINISHED") return null;

    const winners = lobby.participations.filter((p) => p.result === "WIN");
    if (winners.length === 0) return null;

    // Берем команду первого победителя (все в команде должны иметь одинаковый результат)
    const winnerTeam = winners[0].team;
    return winnerTeam || null;
  }, [lobby.status, lobby.participations]);

  // Получаем капитанов
  const captains = useMemo(() => {
    return lobby.participations.filter((p) => p.isCaptain);
  }, [lobby.participations]);

  const captain1 = useMemo(
    () => captains.find((p) => p.team === 1),
    [captains]
  );
  const captain2 = useMemo(
    () => captains.find((p) => p.team === 2),
    [captains]
  );

  // Рандомно выбираем победителя жребия при начале драфта
  useEffect(() => {
    if (
      lobby.status === "DRAFTING" &&
      captain1 &&
      captain2 &&
      lotteryWinnerId === null
    ) {
      // Рандомно выбираем победителя жребия (50/50)
      const random = Math.random() < 0.5;
      const winner = random ? captain1 : captain2;
      setLotteryWinnerId(winner.playerId);
    }
    // Сбрасываем при смене статуса на PENDING
    if (lobby.status === "PENDING") {
      setLotteryWinnerId(null);
      setFirstPickerId(null);
    }
  }, [lobby.status, captain1, captain2, lotteryWinnerId]);

  // Определяем, кто должен выбирать сейчас
  const getCurrentPicker = () => {
    if (lobby.status !== "DRAFTING") return null;

    if (!captain1 || !captain2) return null;

    // Если еще не выбран первый пикер, возвращаем null
    if (firstPickerId === null) return null;

    // Считаем количество выбранных игроков (не капитанов)
    const pickedCount = lobby.participations.filter(
      (p) => p.pickedAt && !p.isCaptain
    ).length;

    // Определяем капитанов на основе выбранного первого пикера
    const firstPicker =
      firstPickerId === captain1.playerId ? captain1 : captain2;
    const secondPicker =
      firstPickerId === captain1.playerId ? captain2 : captain1;

    // Первый выбор делает выбранный капитан
    if (pickedCount === 0) {
      return firstPicker;
    }

    // Паттерн выбора: 1-2-2-1-1-2-2-1-1-2
    const pattern = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1]; // 0 = firstPicker, 1 = secondPicker
    const turn = pattern[pickedCount % pattern.length];
    return turn === 0 ? firstPicker : secondPicker;
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

  const handleDraftPick = async (playerId: number | null, team: number) => {
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

  const handleStartPlaying = async () => {
    try {
      await startPlayingMutation.mutateAsync({ lobbyId: lobby.id });
      notifications.show({
        title: "Успех",
        message: "Игра начата",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось начать игру",
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

  const handleReplacePlayer = async (playerId: number) => {
    try {
      modals.openConfirmModal({
        title: "Подтвердите замену игрока",
        children: (
          <Text size="sm">
            Вы уверены, что хотите заменить этого игрока? Игрок получит -1
            жизнь, а лобби перейдет в статус PENDING. Все игроки потеряют статус
            капитанов и команды.
          </Text>
        ),
        labels: { confirm: "Заменить", cancel: "Отмена" },
        confirmProps: { color: "orange" },
        onConfirm: async () => {
          try {
            await replacePlayerMutation.mutateAsync({
              lobbyId: lobby.id,
              playerId,
            });
            notifications.show({
              title: "Успех",
              message: "Игрок заменен",
              color: "green",
            });
          } catch (error) {
            notifications.show({
              title: "Ошибка",
              message:
                error instanceof Error
                  ? error.message
                  : "Не удалось заменить игрока",
              color: "red",
            });
          }
        },
      });
    } catch (error) {
      // Ошибка открытия модального окна
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
        // const isDisabled = ;

        return (
          <Select
            key={`${teamNumber}-${index}`}
            label={label}
            placeholder="Выберите игрока"
            data={buildPlayerOptions(slot?.playerId ?? null)}
            value={slot ? String(slot.playerId) : null}
            // disabled={isDisabled}
            // description={
            //   slot
            //     ? `MMR: ${slot.player?.mmr ?? "-"} · Жизни: ${
            //         slot.player?.lives ?? "-"
            //       }${slot.isCaptain ? " · Капитан" : ""}`
            //     : undefined
            // }
            onChange={(value) => {
              if (!readonly) {
                handleDraftPick(value ? Number(value) : null, teamNumber);
              }
            }}
            readOnly={index === 0 || readonly || lobby.status !== "DRAFTING"}
            clearable={!readonly && lobby.status === "DRAFTING" && index !== 0}
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
            {winningTeam && (
              <Badge color="green" size="lg" variant="light">
                🏆 Победитель:{" "}
                {getTeamLabel(
                  winningTeam,
                  winningTeam === 1 ? captain1 : captain2
                )}
              </Badge>
            )}
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
              ) : captain1 && captain2 ? (
                <Group gap="md" align="center">
                  {lotteryWinnerId && (
                    <Text size="sm" c="yellow" fw={500}>
                      🎲 Победитель жребия:{" "}
                      {getPlayerName(
                        lotteryWinnerId === captain1.playerId
                          ? captain1
                          : captain2
                      )}
                    </Text>
                  )}
                  {lotteryWinnerId && firstPickerId === null && !readonly && (
                    <Select
                      placeholder="Выберите первого пикера"
                      data={[
                        {
                          value: String(captain1.playerId),
                          label: getPlayerName(captain1),
                        },
                        {
                          value: String(captain2.playerId),
                          label: getPlayerName(captain2),
                        },
                      ]}
                      value={firstPickerId ? String(firstPickerId) : null}
                      onChange={(value) => {
                        if (value) {
                          setFirstPickerId(Number(value));
                        }
                      }}
                      style={{ minWidth: 220 }}
                    />
                  )}
                  {currentPicker && (
                    <Text size="sm" c="blue" fw={500}>
                      Выбирает: {getPlayerName(currentPicker)}
                    </Text>
                  )}
                  {!lotteryWinnerId && (
                    <Text size="sm" c="dimmed">
                      Ожидание начала драфта
                    </Text>
                  )}
                </Group>
              ) : (
                <Text size="sm" c="dimmed">
                  Ожидание начала драфта
                </Text>
              )}
            </>
          )}

          {hasFullTeams && !readonly && (
            <Button
              onClick={handleStartPlaying}
              loading={startPlayingMutation.isPending}
              variant="light"
            >
              Начать игру
            </Button>
          )}

          {lobby.status === "PLAYING" && !readonly && (
            <Group>
              <Select
                placeholder="Выберите победителя"
                data={[
                  {
                    value: "1",
                    label: getTeamLabel(1, captain1),
                  },
                  {
                    value: "2",
                    label: getTeamLabel(2, captain2),
                  },
                ]}
                onChange={(value) => {
                  if (value) {
                    const teamNumber = Number(value);
                    modals.openConfirmModal({
                      title: "Подтвердите победителя",
                      children: (
                        <Text size="sm">
                          Вы уверены, что команда{" "}
                          {getTeamLabel(
                            teamNumber,
                            teamNumber === 1 ? captain1 : captain2
                          )}{" "}
                          победила в этом лобби? Это действие нельзя отменить.
                        </Text>
                      ),
                      labels: { confirm: "Подтвердить", cancel: "Отмена" },
                      confirmProps: { color: "green" },
                      onConfirm: () => handleFinishLobby(teamNumber),
                    });
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
                <Title order={5}>{getTeamLabel(1, captain1)}</Title>
                <Badge color="gray">{team1.length}/5</Badge>
              </Group>
              {renderDraftSelects(1, team1)}
            </div>

            <div>
              <Group justify="space-between" mb="xs">
                <Title order={5}>{getTeamLabel(2, captain2)}</Title>
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
                  <div className="flex gap-4 text-gray-400">
                    <span>MMR: {participant.player?.mmr ?? "-"}</span>
                    <span>Роли: {participant.player?.gameRoles ?? "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1 text-xs">
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
                        {getTeamLabel(
                          participant.team,
                          participant.team === 1 ? captain1 : captain2
                        )}
                      </Badge>
                    )}
                  </div>
                  {!readonly && (
                    <Tooltip label="Заменить игрока">
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        onClick={() =>
                          handleReplacePlayer(participant.playerId)
                        }
                        loading={replacePlayerMutation.isPending}
                      >
                        <IconReplace size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </Stack>
        </div>
      </Stack>
    </Card>
  );
};
