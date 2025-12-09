import {
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Tabs,
  Container,
} from "@mantine/core";
import clsx from "clsx";
import { type FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetPublicTournament,
  TournamentApplicationsTable,
  TournamentPlayersTable,
} from "../features/PublicTournaments";
import type { TournamentStatus } from "../entitity/Tournament";
import { useTournamentLobbiesLongPoll } from "../features/ManageLobby";
import { RoundSection } from "../features/ManageLobby/ui";

type PublicTournamentPageProps = {
  className?: string;
};

const statusLabels: Record<TournamentStatus, string> = {
  draft: "Черновик",
  collecting: "Сбор заявок",
  running: "Идет",
  finished: "Завершен",
};

const statusColors: Record<TournamentStatus, string> = {
  draft: "gray",
  collecting: "blue",
  running: "green",
  finished: "dark",
};

type TournamentTabValue = "applications" | "players" | "rounds";

export const PublicTournamentPage: FC<PublicTournamentPageProps> = ({
  className,
}) => {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id ? Number(id) : 0;
  const tournamentQuery = useGetPublicTournament(tournamentId);
  const { lobbies, isLoading: lobbiesLoading } =
    useTournamentLobbiesLongPoll(tournamentId);
  const [activeTab, setActiveTab] =
    useState<TournamentTabValue>("applications");
  const [playersRefreshToken, setPlayersRefreshToken] = useState(0);

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    const nextTab = value as TournamentTabValue;
    setActiveTab(nextTab);
    if (nextTab === "players") {
      setPlayersRefreshToken((prev) => prev + 1);
    }
  };
  const lobbiesByRound = useMemo(() => {
    return lobbies.reduce<Record<number, typeof lobbies>>((acc, lobby) => {
      const round = lobby.round;
      if (!acc[round]) acc[round] = [];
      acc[round].push(lobby);
      return acc;
    }, {});
  }, [lobbies]);

  if (tournamentQuery.isLoading) {
    return (
      <Center className={clsx("py-12", className)}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (tournamentQuery.isError || !tournamentQuery.data) {
    return (
      <div className={clsx("py-12", className)}>
        <Text c="red">Ошибка при загрузке турнира</Text>
      </div>
    );
  }

  const tournament = tournamentQuery.data;

  const roundNumbers = Object.keys(lobbiesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Container size="xl" className={clsx("", className)}>
      <Stack gap="xl">
        {/* <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(ROUTES.publicTournaments)}
          mb="md"
          style={{ alignSelf: "flex-start" }}
        >
          Назад
        </Button> */}
        <Group justify="space-between" align="flex-start">
          <Title size="h1">{tournament.name}</Title>
          <Group gap="md">
            <Badge
              color={statusColors[tournament.status]}
              variant="light"
              size="lg"
            >
              {statusLabels[tournament.status]}
            </Badge>
          </Group>
        </Group>

        <Group gap="xl">
          {tournament.eventDate && (
            <div>
              <Text size="sm" c="dimmed">
                Дата проведения
              </Text>
              <Text fw={500}>
                {new Date(tournament.eventDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </div>
          )}
          <div>
            <Text size="sm" c="dimmed">
              Взнос
            </Text>
            <Text fw={500}>{tournament.price} ₽</Text>
          </div>
          {tournament.prizePool && (
            <div>
              <Text size="sm" c="dimmed">
                Призовой фонд
              </Text>
              <Text fw={500}>{tournament.prizePool} ₽</Text>
            </div>
          )}
        </Group>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="applications">Заявки</Tabs.Tab>
            <Tabs.Tab value="players">Игроки</Tabs.Tab>
            <Tabs.Tab value="rounds">Раунды</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="applications" pt="lg">
            <TournamentApplicationsTable tournamentId={tournamentId} />
          </Tabs.Panel>

          <Tabs.Panel value="players" pt="lg">
            <TournamentPlayersTable
              tournamentId={tournamentId}
              refreshToken={playersRefreshToken}
            />
          </Tabs.Panel>

          <Tabs.Panel value="rounds" pt="lg">
            <Stack gap="md">
              <Title order={2}>Раунды</Title>
              {lobbiesLoading ? (
                <Center py="xl">
                  <Loader />
                </Center>
              ) : roundNumbers.length === 0 ? (
                <Text c="dimmed">Лобби еще не были сгенерированы.</Text>
              ) : (
                roundNumbers.map((round) => (
                  <RoundSection
                    key={round}
                    round={round}
                    lobbies={lobbiesByRound[round] ?? []}
                    tournamentId={tournamentId}
                    readonly
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};
