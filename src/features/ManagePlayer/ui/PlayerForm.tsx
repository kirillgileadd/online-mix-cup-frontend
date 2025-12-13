import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import clsx from "clsx";
import { type FC, useMemo } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useGetPlayer } from "../model/useGetPlayer";
import { useGetUsers } from "../../MeangeUser/model/useGetUsers";
import { useGetTournaments } from "../../ManageTournament/model/useGetTournaments";
import type { PlayerStatus } from "../../../entitity/Player";

export type PlayerFormValues = {
  userId?: number;
  tournamentId?: number;
  gameRoles: string;
  mmr: number | null;
  chillZoneValue: number | null;
  lives: number | null;
  status: PlayerStatus | "active" | "eliminated";
};

type PlayerFormProps = {
  className?: string;
  playerId?: number;
  defaultTournamentId?: number;
  onSuccess: (
    player: PlayerFormValues,
    setError: UseFormSetError<PlayerFormValues>
  ) => Promise<void>;
  error?: string;
};

const statusOptions = [
  { value: "active", label: "Активен" },
  { value: "eliminated", label: "Выбыл" },
  { value: "inactive", label: "Неактивен" },
];

export const PlayerForm: FC<PlayerFormProps> = ({
  className,
  onSuccess,
  error,
  playerId,
  defaultTournamentId,
}) => {
  const playerQuery = useGetPlayer(playerId);
  const usersQuery = useGetUsers();
  const tournamentsQuery = useGetTournaments();

  const userOptions = useMemo(() => {
    return (
      usersQuery.data?.map((user) => ({
        value: user.id.toString(),
        label: user.username || user.telegramId,
      })) ?? []
    );
  }, [usersQuery.data]);

  const tournamentOptions = useMemo(() => {
    return (
      tournamentsQuery.data?.map((tournament) => ({
        value: tournament.id.toString(),
        label: tournament.name,
      })) ?? []
    );
  }, [tournamentsQuery.data]);

  const formValues = useMemo<PlayerFormValues | undefined>(() => {
    if (!playerId || !playerQuery.data) {
      return undefined;
    }
    const player = playerQuery.data;
    return {
      gameRoles: player.gameRoles ?? "",
      mmr: player.mmr ?? null,
      seed: player.seed,
      score: player.score,
      chillZoneValue: player.chillZoneValue,
      lives: player.lives,
      status: player.status,
    };
  }, [playerQuery.data, playerId]);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormValues>({
    defaultValues: {
      userId: undefined,
      tournamentId: defaultTournamentId,
      gameRoles: "",
      mmr: null,
      chillZoneValue: 0,
      lives: 3,
      status: "active",
    },
    values: formValues,
  });

  const onSubmit = async (data: PlayerFormValues) => {
    await onSuccess(data, setError);
  };

  return (
    <Box className={clsx("relative", className)}>
      <LoadingOverlay visible={playerQuery.isLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="md">
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          {!playerId && (
            <>
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
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    onChange={(value) =>
                      field.onChange(value ? Number(value) : 0)
                    }
                    error={errors.userId?.message}
                    searchable
                  />
                )}
              />

              <Controller
                name="tournamentId"
                control={control}
                rules={{
                  required: "Турнир обязателен",
                  validate: (value) => !value || value > 0 || "Выберите турнир",
                }}
                render={({ field }) => (
                  <Select
                    label="Турнир"
                    placeholder="Выберите турнир"
                    data={tournamentOptions}
                    value={
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    onChange={(value) =>
                      field.onChange(value ? Number(value) : 0)
                    }
                    error={errors.tournamentId?.message}
                    searchable
                  />
                )}
              />
            </>
          )}

          <Controller
            name="gameRoles"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Игровые роли"
                placeholder="Введите роли (через запятую)"
                {...field}
                error={errors.gameRoles?.message}
              />
            )}
          />

          <Controller
            name="mmr"
            control={control}
            rules={{
              required: "MMR обязателен",
            }}
            render={({ field }) => (
              <NumberInput
                label="MMR"
                placeholder="Введите MMR"
                {...field}
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
                error={errors.mmr?.message}
                min={0}
              />
            )}
          />

          <Controller
            name="chillZoneValue"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Chill Zone"
                placeholder="Введите значение Chill Zone"
                {...field}
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
                error={errors.chillZoneValue?.message}
              />
            )}
          />

          <Controller
            name="lives"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Жизни"
                placeholder="Введите количество жизней"
                {...field}
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? null)}
                error={errors.lives?.message}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Статус"
                data={statusOptions}
                {...field}
                error={errors.status?.message}
              />
            )}
          />

          <Button type="submit" loading={isSubmitting} mt="md">
            {playerId ? "Обновить" : "Создать"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
