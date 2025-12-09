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
  Container,
} from "@mantine/core";
import { IconSend, IconSettings } from "@tabler/icons-react";
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

  const telegramBotUsername =
    import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "mixifycup_bot";
  const telegramBotUrl = `https://t.me/${telegramBotUsername}`;

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
    <Container size="xl" className={clsx("", className)}>
      <div className="flex justify-between items-center mb-8">
        <Title size="h1">Турниры</Title>
        <div className="flex items-center flex-wrap gap-2">
          <Button
            component="a"
            href={telegramBotUrl}
            target="_blank"
            rel="noopener noreferrer"
            leftSection={<IconSend size={16} />}
            color="blue"
            variant="light"
          >
            Подать заявку
          </Button>
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
      </div>
      {tournaments.length === 0 ? (
        <Text c="dimmed">Турниры не найдены</Text>
      ) : tournaments.length === 1 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {tournaments[0] && (
              <Card
                key={tournaments[0].id}
                component={Link}
                to={ROUTES.publicTournament(tournaments[0].id)}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                <Stack gap="md">
                  {tournaments[0]?.previewUrl && (
                    <div className="aspect-square overflow-hidden rounded-md">
                      <Image
                        src={tournaments[0].previewUrl}
                        alt={tournaments[0].name}
                        fit="cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Group justify="space-between" align="flex-start">
                    <Title order={2} lineClamp={2}>
                      {tournaments[0].name}
                    </Title>
                    <Badge
                      color={statusColors[tournaments[0].status]}
                      variant="light"
                      size="lg"
                    >
                      {statusLabels[tournaments[0].status]}
                    </Badge>
                  </Group>

                  {tournaments[0].eventDate && (
                    <Text size="md" c="dimmed">
                      Дата:{" "}
                      {dayjs(tournaments[0].eventDate).format(
                        "DD.MM.YYYY HH:mm"
                      )}
                    </Text>
                  )}

                  <Group gap="xl">
                    <div>
                      <Text size="sm" c="dimmed">
                        Взнос
                      </Text>
                      <Text fw={500} size="lg">
                        {tournaments[0].price} ₽
                      </Text>
                    </div>
                    {!!tournaments[0].calculatedPrizePool ? (
                      <div>
                        <Text size="sm" c="dimmed">
                          Призовой фонд
                        </Text>
                        <Text fw={500} size="lg">
                          {tournaments[0].calculatedPrizePool} ₽
                        </Text>
                      </div>
                    ) : (
                      tournaments[0].prizePool && (
                        <div>
                          <Text size="sm" c="dimmed">
                            Призовой фонд
                          </Text>
                          <Text fw={500} size="lg">
                            {tournaments[0].prizePool} ₽
                          </Text>
                        </div>
                      )
                    )}
                  </Group>
                  {!!tournaments[0].approvedApplicationsCount && (
                    <div>
                      <Text size="sm" c="dimmed">
                        Одобренных заявок
                      </Text>
                      <Text fw={500} size="lg">
                        {tournaments[0].approvedApplicationsCount}
                      </Text>
                    </div>
                  )}
                </Stack>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              component={Link}
              to={ROUTES.publicTournament(tournament.id)}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              className="hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <Stack gap="md">
                {tournament?.previewUrl && (
                  <div className="aspect-square overflow-hidden rounded-md">
                    <Image
                      src={`${import.meta.env.VITE_ENVOY_API_URL}${tournament.previewUrl}`}
                      alt={tournament.name}
                      fit="cover"
                      className="w-full h-full object-cover"
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
                  {!!tournament.calculatedPrizePool ? (
                    <div>
                      <Text size="xs" c="dimmed">
                        Призовой фонд
                      </Text>
                      <Text fw={500}>{tournament.calculatedPrizePool} ₽</Text>
                    </div>
                  ) : (
                    tournament.prizePool && (
                      <div>
                        <Text size="xs" c="dimmed">
                          Призовой фонд
                        </Text>
                        <Text fw={500}>{tournament.prizePool} ₽</Text>
                      </div>
                    )
                  )}
                </Group>
                {!!tournament.approvedApplicationsCount && (
                  <div>
                    <Text size="xs" c="dimmed">
                      Одобренных заявок
                    </Text>
                    <Text fw={500}>{tournament.approvedApplicationsCount}</Text>
                  </div>
                )}
              </Stack>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};
