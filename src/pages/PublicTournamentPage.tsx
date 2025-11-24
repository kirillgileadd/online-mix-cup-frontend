import {
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Loader,
  Center,
  Button,
} from "@mantine/core";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import clsx from "clsx";
import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/routes";
import {
  useGetPublicTournament,
  TournamentApplicationsTable,
  TournamentPlayersTable,
} from "../features/PublicTournaments";
import type { TournamentStatus } from "../entitity/Tournament";

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

export const PublicTournamentPage: FC<PublicTournamentPageProps> = ({
  className,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tournamentId = id ? Number(id) : 0;
  const tournamentQuery = useGetPublicTournament(tournamentId);

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

  const telegramBotUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "mixifycup_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}`;

  return (
    <div className={clsx("p-6", className)}>
      <Stack gap="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(ROUTES.publicTournaments)}
          mb="md"
          style={{ alignSelf: "flex-start" }}
        >
          Назад
        </Button>
        <Group justify="space-between" align="flex-start">
          <Title size="h1">{tournament.name}</Title>
          <Group gap="md">
            <Button
              component="a"
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconSend size={16} />}
              color="blue"
            >
              Подать заявку
            </Button>
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

        <TournamentApplicationsTable tournamentId={tournamentId} />
        <TournamentPlayersTable tournamentId={tournamentId} />
      </Stack>
    </div>
  );
};
