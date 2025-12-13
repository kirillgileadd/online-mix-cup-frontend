import clsx from "clsx";
import type { FC } from "react";
import { Container, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ProfileForm } from "../features/ManageProfile";
import { useUpdateProfile, useGetProfile } from "../features/ManageProfile";
import { getChangedFields } from "../features/ManageProfile/model/getChangedFields";
import type { ProfileFormValues } from "../features/ManageProfile/model/types";
import type { UseFormSetError } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../shared/query-keys";
import { appSessionStore } from "../shared/session";

type ProfilePageProps = {
  className?: string;
};

export const ProfilePage: FC<ProfilePageProps> = ({ className }) => {
  const updateMutation = useUpdateProfile();
  const profileQuery = useGetProfile();
  const queryClient = useQueryClient();

  const onUpdateProfile = async (
    profileData: ProfileFormValues,
    setError: UseFormSetError<ProfileFormValues>
  ) => {
    try {
      // Получаем текущий профиль
      const currentProfile = profileQuery.data;
      if (!currentProfile) {
        throw new Error("Профиль не загружен");
      }

      // Получаем только измененные поля
      const changedFields = await getChangedFields(currentProfile, profileData);

      // Если ничего не изменилось, не отправляем запрос
      if (Object.keys(changedFields).length === 0) {
        notifications.show({
          title: "Информация",
          message: "Нет изменений для сохранения",
          color: "blue",
        });
        return;
      }

      const userResponse = await updateMutation.mutateAsync(changedFields);

      // Обновляем сессию если изменилось фото
      if (changedFields.photoBase64) {
        const token = appSessionStore.getSessionToken();
        if (token) {
          const session = appSessionStore.getSession();
          if (session) {
            // Обновляем фото в сессии через обновление кэша
            queryClient.setQueryData(
              [QUERY_KEYS.USER, "profile"],
              userResponse
            );
          }
        }
      }

      // Показываем уведомление об успешном обновлении
      notifications.show({
        title: "Успех",
        message: "Профиль успешно обновлен",
        color: "green",
      });
    } catch (error) {
      // Обработка ошибок валидации
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              data?: Record<string, string[]>;
            };
          };
        };
        const validationErrors = axiosError.response?.data?.data;
        if (validationErrors) {
          Object.entries(validationErrors).forEach(([field, messages]) => {
            setError(field as keyof ProfileFormValues, {
              type: "server",
              message: messages[0],
            });
          });
        }
      }
    }
  };

  return (
    <Container size="xl" className={clsx("py-6", className)}>
      <div className="max-w-md">
        <Title order={2} mb="md">
          Мой профиль
        </Title>
        <ProfileForm
          isPending={updateMutation.isPending}
          onSuccess={onUpdateProfile}
        />
      </div>
    </Container>
  );
};
