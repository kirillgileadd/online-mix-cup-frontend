import {
  Box,
  Button,
  Flex,
  Text,
  NumberInput,
} from "@mantine/core";
import clsx from "clsx";
import { type FC } from "react";
import { Controller, useForm, type UseFormSetError } from "react-hook-form";

export type AddPointsFormValues = {
  points: number;
};

type AddPointsFormProps = {
  className?: string;
  onSuccess: (
    data: AddPointsFormValues,
    setError: UseFormSetError<AddPointsFormValues>
  ) => Promise<void>;
  error?: string;
};

export const AddPointsForm: FC<AddPointsFormProps> = ({
  className,
  onSuccess,
  error,
}) => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddPointsFormValues>({
    defaultValues: {
      points: 0,
    },
  });

  const onSubmit = async (data: AddPointsFormValues) => {
    await onSuccess(data, setError);
  };

  return (
    <Box className={clsx("", className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="md">
          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          <Controller
            name="points"
            control={control}
            rules={{
              required: "Очки обязательны",
            }}
            render={({ field }) => (
              <NumberInput
                label="Очки для добавления"
                placeholder="Введите количество очков"
                {...field}
                value={field.value ?? undefined}
                onChange={(value) => field.onChange(value ?? 0)}
                error={errors.points?.message}
              />
            )}
          />

          <Button type="submit" loading={isSubmitting} mt="md">
            Добавить очки
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

