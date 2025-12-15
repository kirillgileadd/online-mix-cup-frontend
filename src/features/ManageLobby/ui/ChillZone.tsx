import { Card, Group, Badge, Loader, Text, Stack, Title } from "@mantine/core";
import { type FC } from "react";
import { useGetChillZonePlayers } from "../model/useGetChillZonePlayers";

type ChillZoneProps = {
  tournamentId?: number;
  round: number;
};

export const ChillZone: FC<ChillZoneProps> = ({ tournamentId, round }) => {
  const { data: chillZonePlayers = [], isLoading: chillZoneLoading } =
    useGetChillZonePlayers(tournamentId, round);

  return (
    <Card padding="md">
      <Group justify="space-between" mb="sm">
        <Title order={5}>Chill Zone</Title>
        <Badge variant="light" color="gray">
          {chillZoneLoading ? "..." : chillZonePlayers.length}
        </Badge>
      </Group>
      {chillZoneLoading ? (
        <Loader size="sm" />
      ) : chillZonePlayers.length > 0 ? (
        <Stack gap={6}>
          {chillZonePlayers.map((player) => (
            <Group
              key={player.id}
              justify="space-between"
              className="rounded py-2 text-sm"
            >
              <Text fw={500}>
                {player.user?.nickname ||
                  player.user?.username ||
                  player.user?.telegramId ||
                  "-"}
              </Text>
              <Text size="xs" c="dimmed">
                Жизни: {player.lives ?? "-"} · Chill:{" "}
                {player.chillZoneValue ?? 0}
              </Text>
            </Group>
          ))}
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          Все игроки участвуют в раунде.
        </Text>
      )}
    </Card>
  );
};
