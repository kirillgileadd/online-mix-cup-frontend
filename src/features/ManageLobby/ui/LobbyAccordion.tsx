import { Accordion, Group, Badge, Avatar, Text, Stack } from "@mantine/core";
import { IconUser, IconTrophy } from "@tabler/icons-react";
import { type FC, useMemo } from "react";
import type { Lobby, Participation, Team } from "../../../shared/api/lobbies";
import { getPhotoUrl } from "../../../shared/utils/photoUrl";
import { LobbyCard } from "./LobbyCard";
import { ChillZone } from "./ChillZone";

type LobbyAccordionProps = {
  lobby: Lobby;
  readonly?: boolean;
  tournamentId?: number;
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

export const LobbyAccordion: FC<LobbyAccordionProps> = ({
  lobby,
  readonly,
  tournamentId,
}) => {
  const teams = useMemo(() => lobby.teams || [], [lobby.teams]);
  const team1 = teams[0] || null;
  const team2 = teams[1] || null;

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

  // Вычисляем счет - всегда показываем, даже если 0:0
  const score = useMemo(() => {
    if (lobby.status === "FINISHED") {
      const team1Wins = lobby.participations.filter(
        (p) => p.teamId === team1?.id && p.result === "WIN"
      ).length;
      const team2Wins = lobby.participations.filter(
        (p) => p.teamId === team2?.id && p.result === "WIN"
      ).length;

      // Если есть победители, показываем счет
      if (team1Wins > 0 || team2Wins > 0) {
        return `${team1Wins > 0 ? 1 : 0}:${team2Wins > 0 ? 1 : 0}`;
      }
    }

    // По умолчанию показываем 0:0
    return "0:0";
  }, [lobby.status, lobby.participations, team1, team2]);

  // Определяем победившую команду
  const winningTeam = useMemo(() => {
    if (lobby.status !== "FINISHED") return null;
    const winners = lobby.participations.filter((p) => p.result === "WIN");
    if (winners.length === 0) return null;
    const winnerTeamId = winners[0].teamId;
    if (!winnerTeamId) return null;
    return teams.find((t) => t.id === winnerTeamId) || null;
  }, [lobby.status, lobby.participations, teams]);

  const isTeam1Winner = winningTeam?.id === team1?.id;
  const isTeam2Winner = winningTeam?.id === team2?.id;

  const team1Name = getTeamLabel(team1, captain1);
  const team2Name = getTeamLabel(team2, captain2);
  const captain1Photo = captain1?.player?.user?.photoUrl
    ? getPhotoUrl(captain1.player.user.photoUrl)
    : undefined;
  const captain2Photo = captain2?.player?.user?.photoUrl
    ? getPhotoUrl(captain2.player.user.photoUrl)
    : undefined;

  const shouldBeOpenByDefault = lobby.status !== "FINISHED";
  const accordionValue = `lobby-${lobby.id}`;

  return (
    <Accordion
      variant="separated"
      defaultValue={shouldBeOpenByDefault ? accordionValue : undefined}
    >
      <Accordion.Item className="border-none!" value={accordionValue}>
        <Accordion.Control>
          <Group justify="space-between" w="100%" wrap="nowrap">
            {/* Информация о раунде слева */}
            <Text size="sm" c="dimmed" className="shrink-0 mr-4">
              Раунд {lobby.round}
            </Text>

            <Group
              gap="lg"
              wrap="nowrap"
              className="flex-1 min-w-0"
              justify="center"
              align="center"
            >
              {/* Команда 1 - аватарка слева, название справа */}
              <Group
                gap="sm"
                wrap="nowrap"
                className="flex-1 min-w-0"
                justify="flex-end"
              >
                <div className="relative shrink-0">
                  <Avatar size={48} radius={1000} src={captain1Photo}>
                    {!captain1Photo && (
                      <IconUser size={24} className="text-gray-400" />
                    )}
                  </Avatar>
                  {isTeam1Winner && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <IconTrophy
                        size={20}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                    </div>
                  )}
                </div>
                <Text
                  size="sm"
                  fw={500}
                  truncate
                  // className="w-[150px] min-w-[150px]"
                  c="red"
                >
                  {team1Name}
                </Text>
              </Group>

              {/* Счет - всегда по центру с фиксированной шириной для выравнивания */}
              <Text
                size="xl"
                fw={700}
                c="white"
                className="shrink-0 w-[70px] text-center"
              >
                {score}
              </Text>

              {/* Команда 2 - аватарка слева, название справа */}
              <Group
                gap="sm"
                wrap="nowrap"
                className="flex-1 min-w-0"
                justify="flex-start"
              >
                <div className="relative shrink-0">
                  <Avatar size={48} radius={1000} src={captain2Photo}>
                    {!captain2Photo && (
                      <IconUser size={24} className="text-gray-400" />
                    )}
                  </Avatar>
                  {isTeam2Winner && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <IconTrophy
                        size={20}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                    </div>
                  )}
                </div>
                <Text
                  size="sm"
                  fw={500}
                  truncate
                  // className="w-[150px] min-w-[150px]"
                  c="blue"
                >
                  {team2Name}
                </Text>
              </Group>
            </Group>

            {/* Статус */}
            <div className="shrink-0 ml-auto w-[120px] min-w-[120px] flex justify-center">
              <Badge color={getStatusColor(lobby.status)} variant="light">
                {getStatusLabel(lobby.status)}
              </Badge>
            </div>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="md">
            <LobbyCard lobby={lobby} readonly={readonly} />
            <ChillZone
              tournamentId={tournamentId || lobby.tournamentId || undefined}
              round={lobby.round}
            />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
