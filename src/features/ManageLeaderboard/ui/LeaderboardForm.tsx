import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  NumberInput,
  Select,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import clsx from "clsx";
import { type FC, useMemo } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useGetLeaderboardItem } from "../model/useGetLeaderboardItem";
import { useGetUsers } from "../../MeangeUser/model/useGetUsers";

export type LeaderboardFormValues = {
  userId?: number;
  points: number | null;
  createdAt?: string | null;
};

type LeaderboardFormProps = {
  className?: string;
  leaderboardId?: number;
  onSuccess: (
    leaderboard: LeaderboardFormValues,
    setError: UseFormSetError<LeaderboardFormValues>
  ) => Promise<void>;
  error?: string;
};

export const LeaderboardForm: FC<LeaderboardFormProps> = ({
  className,
  onSuccess,
  error,
  leaderboardId,
}) => {
  const leaderboardQuery = useGetLeaderboardItem(leaderboardId || 0);
  const usersQuery = useGetUsers();

  const userOptions = useMemo(() => {
    return (
      usersQuery.data?.map((user) => ({
        value: user.id.toString(),
        label: user.nickname || user.username || user.telegramId,
      })) ?? []
    );
  }, [usersQuery.data]);

  const formValues = useMemo<LeaderboardFormValues | undefined>(() => {
    if (!leaderboardId || !leaderboardQuery.data) {
      return undefined;
    }
    const leaderboard = leaderboardQuery.data;
    return {
      points: leaderboard.points ?? null,
      createdAt: leaderboard.createdAt ?? null,
    };
  }, [leaderboardQuery.data, leaderboardId]);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeaderboardFormValues>({
    defaultValues: {
      userId: undefined,
      points: 0,
      createdAt: leaderboardId ? undefined : new Date().toISOString(),
    },
    values: formValues,
  });

  const onSubmit = async (data: LeaderboardFormValues) => {
    await onSuccess(data, setError);
  };

  return (
    <Box className={clsx("relative", className)}>
      <LoadingOverlay visible={leaderboardQuery.isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="md">
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          {!leaderboardId && (
            <Controller
              name="userId"
              control={control}
              rules={{
                required: "Пользователь обязателен",
                validate: (value) =>
                  !value || value > 0 || "Выберите пользователя",
              }}
              render={({ field }) => (
                <Select
                  label="Пользователь"
                  placeholder="Выберите пользователя"
                  data={userOptions}
                  value={
                    field.value && field.value > 0 ? field.value.toString() : ""
                  }
                  onChange={(value) =>
                    field.onChange(value ? Number(value) : 0)
                  }
                  error={errors.userId?.message}
                  searchable
                />
              )}
            />
          )}

          <Controller
            name="points"
            control={control}
            rules={{
              required: "Очки обязательны",
              min: { value: 0, message: "Очки не могут быть отрицательными" },
            }}
            render={({ field }) => (
              <NumberInput
                label="Очки"
                placeholder="Введите количество очков"
                {...field}
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
                error={errors.points?.message}
                min={0}
              />
            )}
          />

          <Controller
            name="createdAt"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Дата создания"
                placeholder="Выберите дату и время"
                value={
                  field.value
                    ? new Date(field.value)
                    : leaderboardId
                      ? null
                      : new Date()
                }
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                error={errors.createdAt?.message}
              />
            )}
          />

          <Button type="submit" loading={isSubmitting} mt="md">
            {leaderboardId ? "Обновить" : "Создать"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
