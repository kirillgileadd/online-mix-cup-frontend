import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  FileInput,
  Avatar,
} from "@mantine/core";
import clsx from "clsx";
import { type FC, useMemo, useEffect } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useGetProfile } from "../model/useGetProfile";
import { type ProfileFormValues } from "../model/types";
import { IconUser } from "@tabler/icons-react";
import { SteamLinkSection } from "./SteamLinkSection";

type ProfileFormProps = {
  className?: string;
  onSuccess: (
    profile: ProfileFormValues,
    setError: UseFormSetError<ProfileFormValues>
  ) => Promise<void>;
  isPending?: boolean;
  error?: string;
};

export const ProfileForm: FC<ProfileFormProps> = ({
  className,
  onSuccess,
  error,
  isPending,
}) => {
  const profileQuery = useGetProfile();

  // Подготавливаем значения для формы
  const formValues = useMemo<ProfileFormValues | undefined>(() => {
    if (!profileQuery.data) {
      return undefined;
    }
    const user = profileQuery.data;
    return {
      nickname: user.nickname ?? null,
      discordUsername: user.discordUsername ?? null,
      photoBase64: null, // Файл нельзя восстановить из URL, поэтому null
    };
  }, [profileQuery.data]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      nickname: null,
      discordUsername: null,
      photoBase64: null,
    },
    values: formValues,
  });

  const photoFile = watch("photoBase64");
  const profilePhoto = profileQuery.data?.photoUrl;

  // Определяем какое фото показывать: загруженное в форму или с бэка
  const displayPhoto = useMemo(() => {
    // Если загружено новое фото в форму - показываем его
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      return url;
    }

    // Если есть фото с бэка
    if (profilePhoto) {
      // Если начинается с https - используем как есть
      if (profilePhoto.startsWith("https://")) {
        return profilePhoto;
      }

      // Если начинается с /uploads - добавляем базовый URL API
      if (profilePhoto.startsWith("/uploads")) {
        const baseUrl = import.meta.env.VITE_STATIC || "";
        return `${baseUrl}${profilePhoto}`;
      }

      // Для других случаев возвращаем как есть
      return profilePhoto;
    }

    // Если фото нет - undefined
    return undefined;
  }, [photoFile, profilePhoto]);

  // Очистка URL при размонтировании или изменении файла
  useEffect(() => {
    if (photoFile && displayPhoto && displayPhoto.startsWith("blob:")) {
      return () => {
        URL.revokeObjectURL(displayPhoto);
      };
    }
  }, [photoFile, displayPhoto]);

  const onSubmit = (data: ProfileFormValues) => {
    onSuccess(data, setError);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={profileQuery.isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={clsx("", className)}>
        <Flex direction="column" gap="md">
          {!!error && <Text color="red">{error}</Text>}

          {/* Аватар */}
          <Flex direction="column" align="start" gap="sm">
            <Avatar
              size={120}
              radius={1000}
              src={displayPhoto}
              className="border-2 border-dark-600"
            >
              {!displayPhoto && (
                <IconUser size={60} className="text-gray-400" />
              )}
            </Avatar>
            <Text size="sm" c="dimmed">
              Ваше фото профиля
            </Text>
          </Flex>

          <Controller
            name="photoBase64"
            control={control}
            render={({ field }) => (
              <FileInput
                label="Загрузить фото"
                placeholder="Выберите изображение (необязательно)"
                accept="image/*"
                value={field.value}
                onChange={field.onChange}
                error={errors.photoBase64?.message}
              />
            )}
          />

          <TextInput
            label="Никнейм"
            placeholder="Введите никнейм"
            {...register("nickname")}
            error={errors.nickname?.message}
          />

          <TextInput
            label="Discord Username"
            placeholder="Введите Discord username"
            {...register("discordUsername")}
            error={errors.discordUsername?.message}
          />

          <SteamLinkSection />

          <Button loading={isPending} type="submit">
            Обновить профиль
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
