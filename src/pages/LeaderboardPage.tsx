import clsx from "clsx";
import type { FC } from "react";
import { useMemo, useState } from "react";
import {
  LeaderboardTable,
  TopPlayersSection,
} from "../features/ManageLeaderboard";
import { useGetLeaderboard } from "../features/ManageLeaderboard/model/useGetLeaderboard";
import {
  Container,
  Title,
  Button,
  Modal,
  Text,
  Stack,
  Divider,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

type LeaderboardPageProps = {
  className?: string;
};

export const LeaderboardPage: FC<LeaderboardPageProps> = ({ className }) => {
  const leaderboardQuery = useGetLeaderboard();
  const [opened, setOpened] = useState(false);

  const topPlayers = useMemo(() => {
    if (!leaderboardQuery.data) return [];
    // Сортируем по очкам (по убыванию) и берем топ-3
    return [...leaderboardQuery.data]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 3);
  }, [leaderboardQuery.data]);

  return (
    <Container size="md" className={clsx("py-6", className)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Title size="h1">Лидерборд</Title>
        <Button
          leftSection={<IconInfoCircle size={18} />}
          variant="light"
          onClick={() => setOpened(true)}
        >
          Как начисляются очки
        </Button>
      </div>
      <TopPlayersSection topPlayers={topPlayers} />
      <LeaderboardTable />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Как начисляются очки"
        size="lg"
        styles={{
          title: {
            fontSize: "1.5rem",
            fontWeight: 700,
          },
        }}
      >
        <Stack gap="md">
          <div>
            <Text fw={600} size="lg" mb="xs">
              1. Сроки проведения
            </Text>
            <Text size="sm" c="dimmed">
              Лидерборд турнира Mixify Cup действует до конца февраля. По
              завершении периода итоги подсчитываются и объявляются победители.
            </Text>
          </div>

          <Divider />

          <div>
            <Text fw={600} size="lg" mb="xs">
              2. Итоги и призы
            </Text>
            <Text size="sm" c="dimmed" mb="xs">
              По итогам всех турниров за период формируется общий лидерборд.
              Участники, занявшие призовые места, получают:
            </Text>
            <Stack gap="xs" mt="xs">
              <Text size="sm" c="dimmed">
                • 1 место — 5000 рублей
              </Text>
              <Text size="sm" c="dimmed">
                • 2 место — 2500 рублей
              </Text>
              <Text size="sm" c="dimmed">
                • 3 место — 1000 рублей
              </Text>
            </Stack>
          </div>

          <Divider />

          <div>
            <Text fw={600} size="lg" mb="xs">
              3. Начисление очков
            </Text>
            <Text size="sm" c="dimmed" mb="xs">
              Очки начисляются по итогам каждого турнира Mixify Cup:
            </Text>
            <Stack gap="xs" mt="xs">
              <Text size="sm" c="dimmed">
                • 1 место — 20 очков
              </Text>
              <Text size="sm" c="dimmed">
                • 2 место — 10 очков
              </Text>
              <Text size="sm" c="dimmed">
                • 3 место — 5 очков
              </Text>
              <Text size="sm" c="dimmed">
                • Хайлайт турнира — 3 очка
              </Text>
            </Stack>
            <Text fw={600} size="sm" mt="md" mb="xs">
              Особенности начисления:
            </Text>
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                • Если несколько игроков занимают одно и то же место, каждый
                получает полное количество очков, указанных в регламенте.
              </Text>
              <Text size="sm" c="dimmed">
                • Очки не делятся и не уменьшаются.
              </Text>
              <Text size="sm" c="dimmed">
                • Передавать, обменивать или отдавать свои очки другим
                участникам запрещено.
              </Text>
            </Stack>
          </div>

          <Divider />

          <div>
            <Text fw={600} size="lg" mb="xs">
              4. Хайлайт турнира
            </Text>
            <Text size="sm" c="dimmed">
              Хайлайт определяется голосованием в Telegram, которое длится 24
              часа. Если организаторы выявят накрутку голосов, хайлайт
              определяется ими вручную. Игрок, чей момент признан хайлайтом
              турнира, получает 3 очка.
            </Text>
          </div>

          <Divider />

          <div>
            <Text fw={600} size="lg" mb="xs">
              5. Правила при равенстве очков
            </Text>
            <Text size="sm" c="dimmed" mb="xs">
              Если по итогам лидерборда два или более игроков набирают
              одинаковое количество очков, используется следующая система
              определения более высокого места:
            </Text>
            <Stack gap="xs" mt="xs">
              <Text size="sm" c="dimmed">
                • Выше тот, у кого больше побед (1-х мест) в турнирах.
              </Text>
              <Text size="sm" c="dimmed">
                • Если количество побед одинаковое — выше тот, у кого меньше
                очков, полученных за хайлайты.
              </Text>
              <Text size="sm" c="dimmed">
                • Если и этот показатель равен — победитель определяется
                подбрасыванием монетки (случайным способом, который проводят
                организаторы).
              </Text>
            </Stack>
          </div>
        </Stack>
      </Modal>
    </Container>
  );
};
