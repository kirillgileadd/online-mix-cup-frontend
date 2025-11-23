import {
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Text,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import clsx from "clsx";
import { type FC, useMemo } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";
import { useGetTournament } from "../model/useGetTournament";
import { type TournamentFormValues } from "../model/types";

type TournamentFormProps = {
  className?: string;
  tournamentId?: number;
  onSuccess: (
    tournament: TournamentFormValues,
    setError: UseFormSetError<TournamentFormValues>
  ) => Promise<void>;
  error?: string;
};

export const TournamentForm: FC<TournamentFormProps> = ({
  className,
  onSuccess,
  error,
  tournamentId,
}) => {
  const tournamentQuery = useGetTournament(tournamentId);

  // Подготавливаем значения для формы
  const formValues = useMemo<TournamentFormValues | undefined>(() => {
    if (!tournamentId || !tournamentQuery.data) {
      return undefined;
    }
    const tournament = tournamentQuery.data.tournament;
    return {
      name: tournament.name,
      eventDate: tournament.eventDate,
      price: tournament.price,
      prizePool: tournament.prizePool,
    };
  }, [tournamentQuery.data, tournamentId]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<TournamentFormValues>({
    defaultValues: {
      name: "",
      eventDate: null,
      price: 0,
      prizePool: null,
    },
    values: formValues,
  });

  const onSubmit = (data: TournamentFormValues) => {
    onSuccess(data, setError);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={tournamentQuery.isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={clsx("", className)}>
        <Flex direction="column" gap="md">
          {!!error && <Text color="red">{error}</Text>}
          <TextInput
            label="Название турнира"
            placeholder="Введите название турнира"
            {...register("name", {
              required: "Название турнира обязательно",
            })}
            error={errors.name?.message}
          />
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Дата события"
                placeholder="Выберите дату и время"
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString() || null)}
                error={errors.eventDate?.message}
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            rules={{
              required: "Цена обязательна",
              min: { value: 0, message: "Цена должна быть не меньше 0" },
            }}
            render={({ field }) => (
              <NumberInput
                label="Цена"
                placeholder="Введите цену"
                value={field.value}
                onChange={(value) => field.onChange(value ?? 0)}
                error={errors.price?.message}
                min={0}
              />
            )}
          />
          <Controller
            name="prizePool"
            control={control}
            rules={{
              min: { value: 0, message: "Призовой фонд должен быть не меньше 0" },
            }}
            render={({ field }) => (
              <NumberInput
                label="Призовой фонд"
                placeholder="Введите призовой фонд"
                value={field.value ?? null}
                onChange={(value) => field.onChange(value ?? null)}
                error={errors.prizePool?.message}
                min={0}
              />
            )}
          />
          <Button type="submit">
            {tournamentId ? "Обновить" : "Создать"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

