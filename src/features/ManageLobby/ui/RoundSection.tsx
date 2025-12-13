import {
  Accordion,
  Card,
  Stack,
  Title,
  Group,
  Badge,
  Loader,
  Text,
} from "@mantine/core";
import { type FC } from "react";
import type { Lobby } from "../../../shared/api/lobbies";
import { useGetChillZonePlayers } from "../model/useGetChillZonePlayers";
import { LobbyCard } from "./LobbyCard";

type RoundSectionProps = {
  round: number;
  lobbies: Lobby[];
  tournamentId?: number;
  readonly?: boolean;
};

export const RoundSection: FC<RoundSectionProps> = ({
  round,
  lobbies,
  tournamentId,
  readonly,
}) => {
  const { data: chillZonePlayers = [], isLoading: chillZoneLoading } =
    useGetChillZonePlayers(tournamentId, round);

  // Проверяем, все ли лобби завершены
  const allLobbiesFinished =
    lobbies.length > 0 && lobbies.every((lobby) => lobby.status === "FINISHED");

  const accordionProps = allLobbiesFinished
    ? { variant: "separated" as const }
    : { variant: "separated" as const, defaultValue: `round-${round}` };

  return (
    <Accordion {...accordionProps}>
      <Accordion.Item className="border-none!" value={`round-${round}`}>
        <Accordion.Control>
          <Group justify="space-between" w="100%">
            <Title order={3} m={0}>
              Раунд {round}
            </Title>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="md">
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
            <Stack gap="md">
              {lobbies.map((lobby) => (
                <LobbyCard key={lobby.id} lobby={lobby} readonly={readonly} />
              ))}
            </Stack>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
