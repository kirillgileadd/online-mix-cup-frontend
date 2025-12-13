import { Card, Avatar, Text, Badge, Stack } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import type { Leaderboard } from "../../../entitity/Leaderboard";
import { IconCrown, IconUser } from "@tabler/icons-react";
import { getPhotoUrl } from "../../../shared/utils/photoUrl";

type TopPlayersSectionProps = {
  className?: string;
  topPlayers: Leaderboard[];
};

export const TopPlayersSection: FC<TopPlayersSectionProps> = ({
  className,
  topPlayers,
}) => {
  const firstPlace = topPlayers[0];
  const secondPlace = topPlayers[1];
  const thirdPlace = topPlayers[2];

  const getPlayerName = (player: Leaderboard) => {
    return (
      player.user?.nickname ||
      player.user?.username ||
      player.user?.telegramId ||
      "Неизвестный"
    );
  };

  return (
    <div
      className={clsx("grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", className)}
    >
      {/* 2nd Place */}
      {secondPlace && (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-dark-700 border-dark-600"
        >
          <Stack align="center" gap="md">
            <Avatar
              size={80}
              radius={1000}
              src={getPhotoUrl(secondPlace.user?.photoUrl)}
              className="border-2 border-gray-400"
            >
              {!getPhotoUrl(secondPlace.user?.photoUrl) && (
                <IconUser size={40} className="text-gray-400" />
              )}
            </Avatar>
            <Badge color="gray" variant="light" size="lg">
              2-е место
            </Badge>
            <Text fw={500} size="lg" c="white" ta="center">
              {getPlayerName(secondPlace)}
            </Text>
            {secondPlace.points !== undefined && (
              <Text size="sm" c="dimmed">
                {secondPlace.points} очков
              </Text>
            )}
          </Stack>
        </Card>
      )}

      {/* 1st Place */}
      {firstPlace && (
        <Card
          shadow="lg"
          padding="lg"
          radius="md"
          withBorder
          className="bg-dark-700 border-yellow-500 border-2"
        >
          <Stack align="center" gap="md">
            <div className="relative">
              <Avatar
                size={100}
                radius={1000}
                src={getPhotoUrl(firstPlace.user?.photoUrl)}
                className="border-4 border-yellow-500"
              >
                {!getPhotoUrl(firstPlace.user?.photoUrl) && (
                  <IconUser size={50} className="text-yellow-600" />
                )}
              </Avatar>
              <div className="absolute -top-2 -right-2">
                <IconCrown size={24} className="text-yellow-500" />
              </div>
            </div>
            <Badge color="yellow" variant="light" size="lg">
              1-е место
            </Badge>
            <Text fw={700} size="xl" c="white" ta="center">
              {getPlayerName(firstPlace)}
            </Text>
            {firstPlace.points !== undefined && (
              <Text size="md" fw={500} c="yellow">
                {firstPlace.points} очков
              </Text>
            )}
          </Stack>
        </Card>
      )}

      {/* 3rd Place */}
      {thirdPlace && (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="bg-dark-700 border-dark-600"
        >
          <Stack align="center" gap="md">
            <Avatar
              size={80}
              radius={1000}
              src={getPhotoUrl(thirdPlace.user?.photoUrl)}
              className="border-2 border-orange-500"
            >
              {!getPhotoUrl(thirdPlace.user?.photoUrl) && (
                <IconUser size={40} className="text-orange-400" />
              )}
            </Avatar>
            <Badge color="orange" variant="light" size="lg">
              3-е место
            </Badge>
            <Text fw={500} size="lg" c="white" ta="center">
              {getPlayerName(thirdPlace)}
            </Text>
            {thirdPlace.points !== undefined && (
              <Text size="sm" c="dimmed">
                {thirdPlace.points} очков
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </div>
  );
};
