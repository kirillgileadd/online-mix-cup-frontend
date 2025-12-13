import { Modal, TextInput, Button, Text, Flex } from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "../model/useUpdateProfile";

type SteamLinkModalProps = {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  className?: string;
};

type SteamLinkFormValues = {
  steamUrl: string;
};

export const SteamLinkModal: FC<SteamLinkModalProps> = ({
  opened,
  onClose,
  onSuccess,
  className,
}) => {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SteamLinkFormValues>({
    defaultValues: {
      steamUrl: "",
    },
  });

  const onSubmit = async (data: SteamLinkFormValues) => {
    try {
      await updateMutation.mutateAsync({
        steamProfileLink: data.steamUrl,
      });
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      // Ошибка обрабатывается автоматически через interceptor в client.ts
      // Но можно добавить дополнительную обработку если нужно
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const errorMessage = updateMutation.error
    ? (updateMutation.error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || "Ошибка при привязке Steam профиля"
    : null;

  return (
    <Modal
      title="Привязать Steam профиль"
      opened={opened}
      onClose={handleClose}
      className={clsx("", className)}
      withinPortal
    >
      <form onSubmit={handleFormSubmit}>
        <Flex direction="column" gap="md">
          {errorMessage && (
            <Text c="red" size="sm">
              {errorMessage}
            </Text>
          )}

          <TextInput
            label="URL Steam профиля"
            placeholder="Введите ссылку на Steam профиль"
            {...register("steamUrl", {
              required: "URL Steam профиля обязателен",
            })}
            error={errors.steamUrl?.message}
          />

          <Flex gap="sm" justify="flex-end">
            <Button
              type="button"
              variant="subtle"
              onClick={handleClose}
              disabled={updateMutation.isPending}
            >
              Отмена
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Привязать
            </Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};
