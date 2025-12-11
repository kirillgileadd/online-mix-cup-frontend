import { type FC } from "react";
import { Stack, Select, Badge } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { Team, Participation } from "../../../shared/api/lobbies";
import { useDraftPick } from "../model/useDraftPick";
import { Controller, useForm } from "react-hook-form";

type TeamDraftFormProps = {
  lobbyId: number;
  team: Team | null;
  participations: Participation[];
  unassignedPlayers: Participation[];
  readonly?: boolean;
  disabled?: boolean;
};

const getPlayerName = (participant: Participation) =>
  participant.player?.nickname || participant.player?.username || "Неизвестно";

/**
 * Расставляет id из массива participations по индексу slot - 1
 * @param participations - массив participations с полем slot
 * @param arrayLength - длина результирующего массива (по умолчанию 5)
 * @returns массив id, где каждый id находится на позиции (slot - 1)
 */
const arrangeIdsBySlot = (
  participations: Participation[],
  arrayLength: number = 5
): (number | null)[] => {
  const result: (number | null)[] = new Array(arrayLength).fill(null);

  participations.forEach((participation) => {
    if (participation.slot !== null && participation.slot !== undefined) {
      const index = participation.slot;
      if (index >= 0 && index < arrayLength) {
        result[index] = participation.player?.id ?? null;
      }
    }
  });

  return result;
};

export const TeamDraftForm: FC<TeamDraftFormProps> = ({
  lobbyId,
  team,
  participations,
  readonly = false,
  disabled = false,
}) => {
  const draftPickMutation = useDraftPick();

  const { watch, control, getValues } = useForm({
    defaultValues: {
      teamForm: team ? arrangeIdsBySlot(team?.participations ?? [], 5) : null,
    },
    values: {
      teamForm: team ? arrangeIdsBySlot(team?.participations ?? [], 5) : null,
    },
  });

  const teamForm = watch("teamForm");

  const handlePlayerSelect = async (
    playerId: number,
    teamId: number,
    slot: number,
    type: "add" | "remove"
  ) => {
    try {
      // Отправляем на сервер (данные обновятся автоматически через refetch)
      await draftPickMutation.mutateAsync({
        lobbyId,
        playerId,
        teamId,
        slot,
        type,
      });
      // После успешного ответа store синхронизируется через useEffect в LobbyCard
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message:
          error instanceof Error ? error.message : "Не удалось выбрать игрока",
        color: "red",
      });
    }
  };

  // Строим список опций для выбора игроков
  const buildPlayerOptions = () => {
    const options = participations.map((participant) => ({
      value: String(participant.playerId),
      label: getPlayerName(participant),
      disabled: teamForm?.some(
        (id) => id === participant.playerId || !!participant.teamId
      ),
    }));

    // Сортируем: disabled опции в конце
    return options.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return 0;
    });
  };

  if (!team) {
    return (
      <Stack gap="xs" mt="sm">
        <Badge color="gray" variant="light">
          Команда еще не создана
        </Badge>
      </Stack>
    );
  }

  return (
    <Stack gap="md" mt="sm">
      {[0, 1, 2, 3, 4].map((slotNum) => {
        return (
          <Controller
            control={control}
            name={`teamForm.${slotNum}`}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  key={`slot-${slotNum}`}
                  placeholder={
                    slotNum === 0 ? "Выберите капитана" : "Выберите игрока"
                  }
                  size="lg"
                  searchable
                  data={buildPlayerOptions()}
                  value={value ? String(value) : null}
                  onChange={(value) => {
                    if (!readonly && !disabled && team) {
                      const previousValue = getValues(`teamForm.${slotNum}`);

                      if (value && previousValue) {
                        notifications.show({
                          title: "Ошибка",
                          message: "Игрок уже выбран",
                          color: "red",
                        });
                        return;
                      }

                      onChange(value ? Number(value) : null);
                      handlePlayerSelect(
                        value ? Number(value) : Number(previousValue),
                        team.id,
                        slotNum,
                        value ? "add" : "remove"
                      );
                    }
                  }}
                  readOnly={
                    slotNum === 0 ||
                    readonly ||
                    disabled ||
                    (draftPickMutation.isPending &&
                      draftPickMutation.variables.playerId === value)
                  }
                  clearable={!readonly && !disabled}
                  disabled={disabled}
                />
              );
            }}
          />
        );
      })}
    </Stack>
  );
};
