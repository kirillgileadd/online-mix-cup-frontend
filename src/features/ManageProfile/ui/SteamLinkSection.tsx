import { Button, Flex, Text, Badge } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconBrandSteam } from "@tabler/icons-react";
import { useState } from "react";
import { useGetProfile } from "../model/useGetProfile";
import { SteamLinkModal } from "./SteamLinkModal";

export const SteamLinkSection = () => {
  const profileQuery = useGetProfile();
  const [modalOpened, setModalOpened] = useState(false);

  const hasSteam = !!profileQuery.data?.steamId64;

  const handleSuccess = () => {
    // Показываем уведомление об успешной привязке
    notifications.show({
      title: "Успех",
      message: "Steam успешно привязан",
      color: "green",
    });
  };

  return (
    <>
      <Flex direction="column" gap="sm">
        <Text size="sm" fw={500}>
          Привязка Steam
        </Text>
        {hasSteam ? (
          <Flex align="center" gap="xs">
            <Badge
              leftSection={<IconCheck size={14} />}
              color="green"
              variant="light"
            >
              Steam уже привязан
            </Badge>
          </Flex>
        ) : (
          <Button
            leftSection={<IconBrandSteam size={16} />}
            variant="light"
            onClick={() => setModalOpened(true)}
          >
            Привязать Steam
          </Button>
        )}
      </Flex>

      <SteamLinkModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};
