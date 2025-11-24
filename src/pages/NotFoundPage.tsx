import { Button, Title, Text, Stack, Center } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import clsx from "clsx";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../shared/routes";

type NotFoundPageProps = {
  className?: string;
};

export const NotFoundPage: FC<NotFoundPageProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Center className={clsx("min-h-[60vh]", className)}>
      <Stack align="center" gap="lg">
        <Title order={1} size="3rem" c="dimmed">
          404
        </Title>
        <Title order={2}>Страница не найдена</Title>
        <Text c="dimmed" size="lg" ta="center">
          К сожалению, запрашиваемая страница не существует.
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
