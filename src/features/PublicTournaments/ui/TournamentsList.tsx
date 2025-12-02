import {
  Card,
  Title,
  Badge,
  Text,
  Group,
  Stack,
  Loader,
  Center,
  Button,
  Image,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import clsx from "clsx";
import { type FC } from "react";
import { useGetPublicTournaments } from "../model/useGetPublicTournaments";
import type { TournamentStatus } from "../../../entitity/Tournament";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/routes";
import { AppCan } from "../../../shared/authorization";
import dayjs from "dayjs";

type TournamentsListProps = {
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

export const TournamentsList: FC<TournamentsListProps> = ({ className }) => {
  const tournamentsQuery = useGetPublicTournaments();

  if (tournamentsQuery.isLoading) {
    return (
      <Center className={clsx("py-12", className)}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (tournamentsQuery.isError) {
    return (
      <div className={clsx("py-12", className)}>
        <Text c="red">Ошибка при загрузке турниров</Text>
      </div>
    );
  }

  const tournaments = tournamentsQuery.data || [];

  return (
    <div className={clsx("", className)}>
      <div className="flex justify-between items-center mb-8">
        <Title size="h1">Турниры</Title>
        <AppCan action={(permissions) => permissions.users.canManage()}>
          <Button
            component={Link}
            to={ROUTES.adminUsers}
            leftSection={<IconSettings size={16} />}
            variant="light"
          >
            Админка
          </Button>
        </AppCan>
      </div>
      {tournaments.length === 0 ? (
        <Text c="dimmed">Турниры не найдены</Text>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              component={Link}
              to={ROUTES.publicTournament(tournament.id)}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <Stack gap="md">
                {tournament?.previewUrl && (
                  <div
                    style={{
                      height: 200,
                      overflow: "hidden",
                      borderRadius: "var(--mantine-radius-md)",
                    }}
                  >
                    <Image
                      src={tournament.previewUrl}
                      alt={tournament.name}
                      fit="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <Group justify="space-between" align="flex-start">
                  <Title order={3} lineClamp={2}>
                    {tournament.name}
                  </Title>
                  <Badge
                    color={statusColors[tournament.status]}
                    variant="light"
                  >
                    {statusLabels[tournament.status]}
                  </Badge>
                </Group>

                {tournament.eventDate && (
                  <Text size="sm" c="dimmed">
                    Дата:{" "}
                    {dayjs(tournament.eventDate).format("DD.MM.YYYY HH:mm")}
                  </Text>
                )}

                <Group gap="xl">
                  <div>
                    <Text size="xs" c="dimmed">
                      Взнос
                    </Text>
                    <Text fw={500}>{tournament.price} ₽</Text>
                  </div>
                  {tournament.prizePool && (
                    <div>
                      <Text size="xs" c="dimmed">
                        Призовой фонд
                      </Text>
                      <Text fw={500}>{tournament.prizePool} ₽</Text>
                    </div>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
