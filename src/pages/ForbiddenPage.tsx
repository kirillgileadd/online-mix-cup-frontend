import { Button, Title, Text, Stack, Center } from "@mantine/core";
import { IconHome, IconLock } from "@tabler/icons-react";
import clsx from "clsx";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/routes";

type ForbiddenPageProps = {
  className?: string;
};

export const ForbiddenPage: FC<ForbiddenPageProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Center className={clsx("min-h-[60vh]", className)}>
      <Stack align="center" gap="lg">
        <IconLock size={64} stroke={1.5} color="var(--mantine-color-red-6)" />
        <Title order={1} size="3rem" c="red">
          403
        </Title>
        <Title order={2}>Доступ запрещен</Title>
        <Text c="dimmed" size="lg" ta="center">
          У вас нет прав для доступа к этой странице.
        </Text>
        <Button
          leftSection={<IconHome size={16} />}
          onClick={() => navigate(ROUTES.publicTournaments)}
          size="md"
          mt="md"
        >
          Вернуться на главную
        </Button>
      </Stack>
    </Center>
  );
};
