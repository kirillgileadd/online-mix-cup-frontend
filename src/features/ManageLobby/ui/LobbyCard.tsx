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
  ActionIcon,
  Tooltip,
  Menu,
} from "@mantine/core";
import { IconReplace, IconShieldCheck, IconDots } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import type { Lobby, Participation, Team } from "../../../shared/api/lobbies";
import {
  useStartDraft,
  useStartPlaying,
  useFinishLobby,
  useReplacePlayer,
  useCreateSteamLobby,
  useLeaveSteamLobby,
} from "../index";
import { isTeamFull } from "../model/teamUtils";
import { notifications } from "@mantine/notifications";
import { TeamDraftForm } from "./TeamDraftForm";

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

const getTeamLabel = (team: Team | null, captain?: Participation | null) => {
  if (captain) {
    const namePattern = (name?: string) => `${name}'s Team`;
    const name =
      namePattern(captain.player?.nickname) ||
      namePattern(captain.player?.username) ||
      "Неизвестно";
    return name;
  }
  return team ? `Команда #${team.id}` : "Команда";
};

export const LobbyCard: FC<LobbyCardProps> = ({ lobby, readonly }) => {
  const startDraftMutation = useStartDraft();
  const startPlayingMutation = useStartPlaying();
  const finishLobbyMutation = useFinishLobby();
  const replacePlayerMutation = useReplacePlayer();
  const createSteamLobbyMutation = useCreateSteamLobby();
  const leaveSteamLobbyMutation = useLeaveSteamLobby();

  const getPlayerName = (participant: Participation) =>
    participant.player?.nickname ||
    participant.player?.username ||
    "Неизвестно";

  // Получаем команды из лобби
  const teams = useMemo(() => lobby.teams || [], [lobby.teams]);
  const team1 = teams[0] || null;
  const team2 = teams[1] || null;

  // Группируем участников по командам
  const team1Participations = useMemo(
    () =>
      team1
        ? lobby.participations
            .filter((p) => p.teamId === team1.id)
            .sort((a, b) => {
              if (a.isCaptain && !b.isCaptain) return -1;
              if (!a.isCaptain && b.isCaptain) return 1;
              const slotA = a.slot ?? 999;
              const slotB = b.slot ?? 999;
              return slotA - slotB;
            })
        : [],
    [lobby.participations, team1]
  );

  const team2Participations = useMemo(
    () =>
      team2
        ? lobby.participations
            .filter((p) => p.teamId === team2.id)
            .sort((a, b) => {
              if (a.isCaptain && !b.isCaptain) return -1;
              if (!a.isCaptain && b.isCaptain) return 1;
              const slotA = a.slot ?? 999;
              const slotB = b.slot ?? 999;
              return slotA - slotB;
            })
        : [],
    [lobby.participations, team2]
  );

  const unassigned = useMemo(
    () => lobby.participations.filter((p) => !p.teamId),
    [lobby.participations]
  );

  // Проверяем заполненность команд
  const team1Full = isTeamFull(team1Participations);
  const team2Full = isTeamFull(team2Participations);
  const hasFullTeams = team1Full && team2Full && lobby.status === "DRAFTING";

  // Определяем победившую команду
  const winningTeam = useMemo(() => {
    if (lobby.status !== "FINISHED") return null;

    const winners = lobby.participations.filter((p) => p.result === "WIN");
    if (winners.length === 0) return null;

    const winnerTeamId = winners[0].teamId;
    if (!winnerTeamId) return null;
    return teams.find((t) => t.id === winnerTeamId) || null;
  }, [lobby.status, lobby.participations, teams]);

  // Получаем капитанов
  const captains = useMemo(() => {
    return lobby.participations.filter((p) => p.isCaptain);
  }, [lobby.participations]);

  const captain1 = useMemo(
    () => (team1 ? captains.find((p) => p.teamId === team1.id) : null),
    [captains, team1]
  );
  const captain2 = useMemo(
    () => (team2 ? captains.find((p) => p.teamId === team2.id) : null),
    [captains, team2]
  );

  // Получаем данные из lobby
  const lotteryWinnerId = lobby.lotteryWinnerId ?? null;
  const firstPickerId = lobby.firstPickerId ?? null;

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

  const generateRandomPassword = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleStartPlaying = async () => {
    try {
      const randomPassword = generateRandomPassword();
      await startPlayingMutation.mutateAsync({
        lobbyId: lobby.id,
        gameName: `lobby${lobby.id}`,
        gameMode: 2,
        passKey: randomPassword,
        serverRegion: 8, // Стокгольм
      });
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

  const handleFinishLobby = async (winningTeamId: number) => {
    try {
      await finishLobbyMutation.mutateAsync({
        lobbyId: lobby.id,
        winningTeamId,
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

  const handleCreateSteamLobby = async () => {
    try {
      const randomPassword = generateRandomPassword();
      const result = await createSteamLobbyMutation.mutateAsync({
        lobbyId: lobby.id,
        gameName: `lobby${lobby.id}`,
        gameMode: 2,
        passKey: randomPassword,
        serverRegion: 8, // Стокгольм
      });

      if (result.success) {
        notifications.show({
          title: "Успех",
          message: result.message || "Steam лобби успешно создано",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Предупреждение",
          message: result.message || "Steam лобби не было создано",
          color: "yellow",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось создать Steam лобби";

      notifications.show({
        title: "Ошибка",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleLeaveSteamLobby = async () => {
    try {
      const result = await leaveSteamLobbyMutation.mutateAsync();

      if (result.success) {
        notifications.show({
          title: "Успех",
          message: result.message || "Бот успешно покинул Steam лобби",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Предупреждение",
          message: result.message || "Бот не смог покинуть Steam лобби",
          color: "yellow",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось покинуть Steam лобби";

      notifications.show({
        title: "Ошибка",
        message: errorMessage,
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

  return (
    <Card shadow="sm" padding="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group>
            <Title order={4}>Лобби #{lobby.id}</Title>
            <Badge color={getStatusColor(lobby.status)}>
              {getStatusLabel(lobby.status)}
            </Badge>
            {winningTeam && (
              <Badge color="green" size="lg" variant="light">
                🏆 Победитель:{" "}
                {getTeamLabel(
                  winningTeam,
                  winningTeam.id === team1?.id ? captain1 : captain2
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

          {lobby.status === "DRAFTING" && !hasFullTeams && (
            <>
              {captain1 && captain2 ? (
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
                  {firstPickerId && (
                    <Text size="sm" c="green" fw={500}>
                      Первый пикер:{" "}
                      {getPlayerName(
                        firstPickerId === captain1.playerId
                          ? captain1
                          : captain2
                      )}
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
            <Group>
              <Button
                onClick={handleStartPlaying}
                loading={startPlayingMutation.isPending}
                variant="light"
              >
                Начать игру
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="light" size="lg">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Steam лобби</Menu.Label>
                  <Menu.Item
                    onClick={handleCreateSteamLobby}
                    disabled={createSteamLobbyMutation.isPending}
                  >
                    Создать Steam лобби
                  </Menu.Item>
                  <Menu.Item
                    onClick={handleLeaveSteamLobby}
                    disabled={leaveSteamLobbyMutation.isPending}
                    color="red"
                  >
                    Покинуть Steam лобби
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}

          {lobby.status === "PLAYING" && !readonly && team1 && team2 && (
            <Group>
              <Select
                placeholder="Выберите победителя"
                data={[
                  {
                    value: String(team1.id),
                    label: getTeamLabel(team1, captain1),
                  },
                  {
                    value: String(team2.id),
                    label: getTeamLabel(team2, captain2),
                  },
                ]}
                onChange={(value) => {
                  if (value) {
                    const teamId = Number(value);
                    const selectedTeam = teamId === team1.id ? team1 : team2;
                    const selectedCaptain =
                      teamId === team1.id ? captain1 : captain2;
                    modals.openConfirmModal({
                      title: "Подтвердите победителя",
                      children: (
                        <Text size="sm">
                          Вы уверены, что команда{" "}
                          {getTeamLabel(selectedTeam, selectedCaptain)} победила
                          в этом лобби? Это действие нельзя отменить.
                        </Text>
                      ),
                      labels: { confirm: "Подтвердить", cancel: "Отмена" },
                      confirmProps: { color: "green" },
                      onConfirm: () => handleFinishLobby(teamId),
                    });
                  }
                }}
              />
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="light" size="lg">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Steam лобби</Menu.Label>
                  <Menu.Item
                    onClick={handleCreateSteamLobby}
                    disabled={createSteamLobbyMutation.isPending}
                  >
                    Создать Steam лобби
                  </Menu.Item>
                  <Menu.Item
                    onClick={handleLeaveSteamLobby}
                    disabled={leaveSteamLobbyMutation.isPending}
                    color="red"
                  >
                    Покинуть Steam лобби
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
            {/* Команда 1 */}
            <div>
              <Group justify="space-between" mb="xs">
                <Title order={5}>
                  {team1 ? getTeamLabel(team1, captain1) : "Команда 1"}
                </Title>
                <Badge color="gray">{team1Participations.length}/5</Badge>
              </Group>
              {team1 && (
                <TeamDraftForm
                  lobbyId={lobby.id}
                  team={team1}
                  participations={lobby.participations}
                  unassignedPlayers={unassigned}
                  readonly={readonly || lobby.status !== "DRAFTING"}
                />
              )}
            </div>

            {/* Команда 2 */}
            <div>
              <Group justify="space-between" mb="xs">
                <Title order={5}>
                  {team2 ? getTeamLabel(team2, captain2) : "Команда 2"}
                </Title>
                <Badge color="gray">{team2Participations.length}/5</Badge>
              </Group>
              {team2 && (
                <TeamDraftForm
                  lobbyId={lobby.id}
                  team={team2}
                  participations={lobby.participations}
                  unassignedPlayers={unassigned}
                  readonly={readonly || lobby.status !== "DRAFTING"}
                />
              )}
            </div>
          </div>

          {/* Список всех игроков */}
          <div className="md:basis-1/2 md:flex-1 min-w-0">
            <Group justify="space-between" mb="xs">
              <Title order={5}>Игроки лобби</Title>
              <Badge variant="light" color="blue">{lobby.participations.length}</Badge>
            </Group>
            {lobby.participations.map((participant) => (
              <div
                key={participant.id}
                className="flex flex-wrap items-center justify-between text-sm py-2"
              >
                <div className="flex items-center gap-2">
                  <Text fw={600}>{getPlayerName(participant)}</Text>
                  <div className="flex gap-4 text-gray-400">
                    <span>MMR: {participant.player?.mmr ?? "-"}</span>
                    <span>Жизни: {participant.player?.lives ?? "-"}</span>
                    <span>Роли: {participant.player?.gameRoles ?? "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-2 text-xs">
                    {participant.isCaptain && <IconShieldCheck size={16} />}
                    {participant.teamId && (
                      <Badge
                        size="xs"
                        variant="light"
                        color={
                          participant.teamId === team1?.id ? "red" : "blue"
                        }
                      >
                        {getTeamLabel(
                          teams.find((t) => t.id === participant.teamId) ||
                            null,
                          participant.teamId === team1?.id ? captain1 : captain2
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
          </div>
        </div>
      </Stack>
    </Card>
  );
};
