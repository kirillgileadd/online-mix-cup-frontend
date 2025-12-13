import clsx from "clsx";
import type { FC } from "react";
import { useMemo } from "react";
import {
  LeaderboardTable,
  TopPlayersSection,
} from "../features/ManageLeaderboard";
import { useGetLeaderboard } from "../features/ManageLeaderboard/model/useGetLeaderboard";
import { Container, Title } from "@mantine/core";

type LeaderboardPageProps = {
  className?: string;
};

export const LeaderboardPage: FC<LeaderboardPageProps> = ({ className }) => {
  const leaderboardQuery = useGetLeaderboard();

  const topPlayers = useMemo(() => {
    if (!leaderboardQuery.data) return [];
    // Сортируем по очкам (по убыванию) и берем топ-3
    return [...leaderboardQuery.data]
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 3);
  }, [leaderboardQuery.data]);

  return (
    <Container size="md" className={clsx("py-6", className)}>
      <div className="mb-6">
        <Title size="h1">Лидерборд</Title>
      </div>
      <TopPlayersSection topPlayers={topPlayers} />
      <LeaderboardTable />
    </Container>
  );
};
