import { type FC, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Title,
  Button,
  Stack,
  Group,
  Badge,
  Text,
  Loader,
  Center,
  Tabs,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useGetTournament } from "../features/ManageTournament";
import { useGetLobbies, useGenerateLobbies } from "../features/ManageLobby";
import { RoundSection } from "../features/ManageLobby/ui";
import { ROUTES } from "../shared/routes";
import { PlayersTable } from "../features/ManagePlayer";

export const AdminTournamentPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tournamentId = id ? Number(id) : undefined;

  const { data: tournamentData, isLoading: tournamentLoading } =
    useGetTournament(tournamentId);
  const tournament = tournamentData?.tournament;
  const {
    data: lobbies,
    isLoading: lobbiesLoading,
    refetch,
  } = useGetLobbies(tournamentId);
  const generateLobbiesMutation = useGenerateLobbies();
  const [activeTab, setActiveTab] = useState<"lobbies" | "players">("lobbies");
  const [playersRefreshToken, setPlayersRefreshToken] = useState(0);

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    const nextTab = value as "lobbies" | "players";
    setActiveTab(nextTab);
    if (nextTab === "players") {
      setPlayersRefreshToken((prev) => prev + 1);
    }
  };

  const handleGenerateLobbies = async () => {
    if (!tournamentId) return;

    try {
      await generateLobbiesMutation.mutateAsync({
        tournamentId,
      });
      notifications.show({
        title: "Успех",
        message: "Лобби успешно сгенерированы",
        color: "green",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error
            ? error.message
            : "Не удалось сгенерировать лобби",
        color: "red",
      });
    }
  };

  if (tournamentLoading || lobbiesLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!tournament) {
    return (
      <div className="p-6">
        <Text c="red">Турнир не найден</Text>
        <Button mt="md" onClick={() => navigate(ROUTES.adminTournaments)}>
          Вернуться к списку турниров
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "gray";
      case "collecting":
        return "blue";
      case "running":
        return "yellow";
      case "finished":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Черновик";
      case "collecting":
        return "Сбор заявок";
      case "running":
        return "Идет";
      case "finished":
        return "Завершен";
      default:
        return status;
    }
  };

  // Группируем лобби по раундам
  const lobbiesByRound =
    lobbies?.reduce(
      (acc, lobby) => {
        const round = lobby.round;
        if (!acc[round]) {
          acc[round] = [];
        }
        acc[round].push(lobby);
        return acc;
      },
      {} as Record<number, typeof lobbies>
    ) || {};

  const rounds = Object.keys(lobbiesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Stack gap="lg">
        {/* Заголовок турнира */}
        <Group justify="space-between" align="center">
          <Group>
            <Title order={2}>{tournament.name}</Title>
            <Badge color={getStatusColor(tournament.status)}>
              {getStatusLabel(tournament.status)}
            </Badge>
          </Group>
          <Button
            variant="light"
            onClick={() => navigate(ROUTES.adminTournaments)}
          >
            Назад к турнирам
          </Button>
        </Group>

        {/* Информация о турнире */}
        <Group>
          {tournament.eventDate && (
            <Text size="sm" c="dimmed">
              Дата: {new Date(tournament.eventDate).toLocaleDateString("ru-RU")}
            </Text>
          )}
          <Text size="sm" c="dimmed">
            Призовой фонд: {tournament.prizePool || 0} ₽
          </Text>
        </Group>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="lobbies">Лобби</Tabs.Tab>
            <Tabs.Tab value="players">Игроки</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="lobbies" pt="lg">
            <Stack gap="lg">
              <Group>
                <Button
                  onClick={handleGenerateLobbies}
                  loading={generateLobbiesMutation.isPending}
                  disabled={tournament.status === "finished"}
                >
                  Сгенерировать лобби
                </Button>
              </Group>

              {rounds.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  Лобби еще не созданы. Нажмите "Сгенерировать лобби" для
                  начала.
                </Text>
              ) : (
                rounds.map((round) => (
                  <RoundSection
                    key={round}
                    round={round}
                    lobbies={lobbiesByRound[round] ?? []}
                    tournamentId={tournamentId}
                  />
                ))
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="players" pt="lg">
            <PlayersTable
              lockedTournamentId={tournamentId}
              showTournamentFilter={false}
              title="Игроки турнира"
              refreshToken={playersRefreshToken}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </div>
  );
};
