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

type PlaceConfig = {
  position: number;
  borderColor: string;
  badgeColor: string;
  textColor: string;
  pointsColor: string;
  showCrown: boolean;
};

const PLACE_CONFIGS: Record<number, PlaceConfig> = {
  1: {
    position: 1,
    borderColor: "border-yellow-500",
    badgeColor: "yellow",
    textColor: "white",
    pointsColor: "yellow",
    showCrown: true,
  },
  2: {
    position: 2,
    borderColor: "border-gray-400",
    badgeColor: "gray",
    textColor: "white",
    pointsColor: "dimmed",
    showCrown: false,
  },
  3: {
    position: 3,
    borderColor: "border-orange-500",
    badgeColor: "orange",
    textColor: "white",
    pointsColor: "dimmed",
    showCrown: false,
  },
};

export const TopPlayersSection: FC<TopPlayersSectionProps> = ({
  className,
  topPlayers,
}) => {
  const getPlayerName = (player: Leaderboard) => {
    return (
      player.user?.nickname ||
      player.user?.username ||
      player.user?.telegramId ||
      "Неизвестный"
    );
  };

  const topThree = topPlayers.slice(0, 3);
  // Порядок отображения: 2-е место, 1-е место, 3-е место
  const displayOrder = [
    topThree[1], // 2-е место
    topThree[0], // 1-е место
    topThree[2], // 3-е место
  ].filter(Boolean);

  return (
    <div
      className={clsx("grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", className)}
    >
      {displayOrder.map((player, index) => {
        // Определяем реальное место: индекс 0 = 2-е место, индекс 1 = 1-е место, индекс 2 = 3-е место
        const place = index === 0 ? 2 : index === 1 ? 1 : 3;
        const config = PLACE_CONFIGS[place];
        if (!config || !player) return null;

        return (
          <Card
            key={player.id || index}
            shadow={place === 1 ? "lg" : "sm"}
            padding="lg"
            radius="md"
            withBorder
            className={clsx(
              "bg-dark-700 border-2 h-full flex flex-col",
              config.borderColor
            )}
          >
            <Stack align="center" gap="md" className="flex-1">
              <div className="relative">
                <Avatar
                  size={90}
                  radius={1000}
                  src={getPhotoUrl(player.user?.photoUrl)}
                  className={clsx(
                    "border-2",
                    config.borderColor,
                    place === 1 && "border-4"
                  )}
                >
                  {!getPhotoUrl(player.user?.photoUrl) && (
                    <IconUser
                      size={45}
                      className={clsx(
                        place === 1 && "text-yellow-500",
                        place === 2 && "text-gray-400",
                        place === 3 && "text-orange-500"
                      )}
                    />
                  )}
                </Avatar>
                {config.showCrown && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <IconCrown
                      size={28}
                      className="text-yellow-500 fill-yellow-500"
                      stroke={2}
                    />
                  </div>
                )}
              </div>
              <Badge color={config.badgeColor} variant="light" size="lg">
                {place}-е место
              </Badge>
              <Text
                fw={place === 1 ? 700 : 500}
                size="lg"
                c={config.textColor}
                ta="center"
              >
                {getPlayerName(player)}
              </Text>
              {player.points !== undefined && (
                <Text
                  size="sm"
                  fw={place === 1 ? 500 : 400}
                  c={config.pointsColor}
                >
                  {player.points} очков
                </Text>
              )}
            </Stack>
          </Card>
        );
      })}
    </div>
  );
};
