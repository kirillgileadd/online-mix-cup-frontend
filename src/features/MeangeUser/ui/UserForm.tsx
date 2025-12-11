import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { clsx } from "clsx";
import { type FC, useMemo } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useGetUser } from "../model/useGetUser";
import { useGetRoles } from "../model/useGetRoles";
import { type UserFormValues } from "../model/types";

type UserFormProps = {
  className?: string;
  userId?: number;
  onSuccess: (
    user: UserFormValues,
    setError: UseFormSetError<UserFormValues>
  ) => Promise<void>;
  error?: string;
};

export const UserForm: FC<UserFormProps> = ({
  className,
  onSuccess,
  error,
  userId,
}) => {
  const userQuery = useGetUser(userId);
  const rolesQuery = useGetRoles();

  const roleOptions = useMemo(() => {
    if (!rolesQuery.data) return [];
    return rolesQuery.data.map((role) => ({
      value: role.name,
      label: role.description || role.name,
    }));
  }, [rolesQuery.data]);

  // Подготавливаем значения для формы
  const formValues = useMemo<UserFormValues | undefined>(() => {
    if (!userId || !userQuery.data) {
      return undefined;
    }
    const user = userQuery.data;
    return {
      telegramId: user.telegramId,
      username: user.username ?? "",
      photoUrl: user.photoUrl ?? "",
      discordUsername: user.discordUsername ?? "",
      steamProfileLink: user.steamId64 ?? "",
      roles: user.roles ?? [],
    };
  }, [userQuery.data, userId]);

  formValues;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      telegramId: "",
      username: "",
      photoUrl: "",
      discordUsername: "",
      steamProfileLink: "",
      roles: [],
    },
    values: formValues, // Используем values для автоматического обновления
  });

  const onSubmit = (data: UserFormValues) => {
    onSuccess(data, setError);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={userQuery.isLoading || rolesQuery.isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={clsx("", className)}>
        <Flex direction="column" gap="md">
          {!!error && <Text color="red">{error}</Text>}
          <TextInput
            label="Telegram ID"
            placeholder="Введите Telegram ID"
            {...register("telegramId", {
              required: "Telegram ID обязателен",
            })}
            error={errors.telegramId?.message}
            disabled={!!userId}
          />
          <TextInput
            label="Username"
            placeholder="Введите username"
            {...register("username")}
            error={errors.username?.message}
          />
          <Controller
            name="roles"
            control={control}
            rules={{ required: "Роли обязательны" }}
            render={({ field }) => (
              <MultiSelect
                label="Роли"
                placeholder="Выберите роли"
                data={roleOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.roles?.message}
              />
            )}
          />
          <TextInput
            label="Photo URL"
            placeholder="Введите URL фото"
            {...register("photoUrl")}
            error={errors.photoUrl?.message}
          />
          <TextInput
            label="Discord Username"
            placeholder="Введите Discord username"
            {...register("discordUsername")}
            error={errors.discordUsername?.message}
          />
          <TextInput
            label="Steam Profile Link"
            placeholder="Введите ссылку на Steam профиль"
            {...register("steamProfileLink")}
            error={errors.steamProfileLink?.message}
          />
          <Button type="submit">{userId ? "Обновить" : "Создать"}</Button>
        </Flex>
      </form>
    </Box>
  );
};
