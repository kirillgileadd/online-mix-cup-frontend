import { Card, Title, Badge, Text, Group, Stack, Loader, Center } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import { useGetPublicTournaments } from "../model/useGetPublicTournaments";
import type { TournamentStatus } from "../../../entitity/Tournament";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../shared/routes";

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
      <Title size="h1" mb="xl">
        Турниры
      </Title>
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
                    {new Date(tournament.eventDate).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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

