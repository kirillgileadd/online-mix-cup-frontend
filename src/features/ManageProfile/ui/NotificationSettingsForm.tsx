import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Switch,
  Slider,
  Text,
  Title,
  Paper,
} from "@mantine/core";
import clsx from "clsx";
import { type FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useGetNotificationSettings,
  useUpdateNotificationSettings,
} from "../model";
import { notifications } from "@mantine/notifications";
import { notificationService } from "../../../shared/api/notifications";

interface NotificationSettingsFormValues {
  isTelegramNotifications: boolean;
  isSSENotifications: boolean;
  notificationsVolume: number;
}

type NotificationSettingsFormProps = {
  className?: string;
};

export const NotificationSettingsForm: FC<NotificationSettingsFormProps> = ({
  className,
}) => {
  const settingsQuery = useGetNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  // Подготавливаем значения для формы
  const formValues = useMemo<NotificationSettingsFormValues | undefined>(() => {
    if (!settingsQuery.data) {
      return undefined;
    }
    const settings = settingsQuery.data;
    return {
      isTelegramNotifications: settings.isTelegramNotifications,
      isSSENotifications: settings.isSSENotifications,
      notificationsVolume: settings.notificationsVolume,
    };
  }, [settingsQuery.data]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<NotificationSettingsFormValues>({
    defaultValues: {
      isTelegramNotifications: false,
      isSSENotifications: true,
      notificationsVolume: 5,
    },
    values: formValues,
    mode: "onChange",
  });

  const isTelegramNotifications = watch("isTelegramNotifications");
  const isSSENotifications = watch("isSSENotifications");
  const notificationsVolume = watch("notificationsVolume");

  const onSubmit = async (data: NotificationSettingsFormValues) => {
    try {
      const updatedSettings = await updateMutation.mutateAsync(data);
      // Обновляем кэш в сервисе уведомлений для применения новой громкости
      notificationService.updateSettingsCache(updatedSettings);
      notifications.show({
        title: "Успех",
        message: "Настройки уведомлений успешно обновлены",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Не удалось обновить настройки уведомлений",
        color: "red",
      });
    }
  };

  return (
    <Paper
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      className={clsx("", className)}
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={settingsQuery.isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="md">
            <Title order={3} mb="xs">
              Настройки уведомлений
            </Title>

            <Switch
              label="Telegram уведомления"
              description="Получать уведомления через Telegram"
              checked={isTelegramNotifications}
              {...register("isTelegramNotifications")}
              onChange={(event) =>
                setValue(
                  "isTelegramNotifications",
                  event.currentTarget.checked,
                  {
                    shouldDirty: true,
                  }
                )
              }
              error={errors.isTelegramNotifications?.message}
            />

            <Switch
              label="SSE уведомления"
              description="Получать уведомления через Server-Sent Events (в браузере)"
              checked={isSSENotifications}
              {...register("isSSENotifications")}
              onChange={(event) =>
                setValue("isSSENotifications", event.currentTarget.checked, {
                  shouldDirty: true,
                })
              }
              error={errors.isSSENotifications?.message}
            />

            <Box>
              <Text size="sm" fw={500} mb="xs">
                Громкость уведомлений
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                Уровень громкости звука уведомлений (от 1 до 10)
              </Text>
              <Slider
                value={notificationsVolume}
                min={1}
                max={10}
                step={1}
                marks={[
                  { value: 1, label: "1" },
                  { value: 5, label: "5" },
                  { value: 10, label: "10" },
                ]}
                onChange={(value) =>
                  setValue("notificationsVolume", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                mb="md"
              />
              {errors.notificationsVolume && (
                <Text size="xs" c="red" mt="xs">
                  {errors.notificationsVolume.message}
                </Text>
              )}
            </Box>

            <Button
              loading={updateMutation.isPending}
              type="submit"
              disabled={!isDirty}
            >
              Сохранить настройки
            </Button>
          </Flex>
        </form>
      </Box>
    </Paper>
  );
};
