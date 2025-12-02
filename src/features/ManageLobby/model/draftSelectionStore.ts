import { create } from "zustand";

type TeamSlot = [number | null, number | null, number | null, number | null];

interface DraftSelectionState {
  // Ключ - lobbyId, значение - состояние выбора для этого лобби
  selections: Record<
    number,
    {
      team1: TeamSlot;
      team2: TeamSlot;
    }
  >;

  // Инициализировать состояние для лобби
  initializeLobby: (lobbyId: number) => void;

  // Установить игрока в конкретный слот команды
  setPlayerInSlot: (
    lobbyId: number,
    team: 1 | 2,
    slotIndex: number,
    playerId: number | null
  ) => void;

  // Удалить игрока из всех слотов команды
  removePlayerFromTeam: (
    lobbyId: number,
    team: 1 | 2,
    playerId: number
  ) => void;

  // Очистить состояние для лобби
  clearLobby: (lobbyId: number) => void;

  // Получить состояние для лобби
  getLobbySelection: (lobbyId: number) => {
    team1: TeamSlot;
    team2: TeamSlot;
  } | null;
}

const createEmptyTeamSlot = (): TeamSlot => [null, null, null, null];

export const useDraftSelectionStore = create<DraftSelectionState>(
  (set, get) => ({
    selections: {},

    initializeLobby: (lobbyId: number) => {
      set((state) => {
        if (!state.selections[lobbyId]) {
          return {
            selections: {
              ...state.selections,
              [lobbyId]: {
                team1: createEmptyTeamSlot(),
                team2: createEmptyTeamSlot(),
              },
            },
          };
        }
        return state;
      });
    },

    setPlayerInSlot: (
      lobbyId: number,
      team: 1 | 2,
      slotIndex: number,
      playerId: number | null
    ) => {
      // slotIndex может быть 0-4, где 0 - капитан (не хранится в store)
      // В store храним только слоты 1-4 (индексы 0-3 в массиве)
      if (slotIndex < 1 || slotIndex > 4) {
        console.warn(
          `Invalid slot index: ${slotIndex}. Must be between 1 and 4.`
        );
        return;
      }

      // Преобразуем slotIndex (1-4) в индекс массива (0-3)
      const arrayIndex = slotIndex - 1;

      set((state) => {
        // Инициализируем лобби, если его еще нет
        const currentSelection = state.selections[lobbyId] || {
          team1: createEmptyTeamSlot(),
          team2: createEmptyTeamSlot(),
        };

        // Создаем копию массива команды
        const teamKey = team === 1 ? "team1" : "team2";
        const newTeam = [...currentSelection[teamKey]] as TeamSlot;

        // Если устанавливаем игрока, сначала удаляем его из всех слотов обеих команд
        if (playerId !== null) {
          // Удаляем из текущей команды
          for (let i = 0; i < newTeam.length; i++) {
            if (newTeam[i] === playerId) {
              newTeam[i] = null;
            }
          }

          // Удаляем из другой команды
          const otherTeamKey = team === 1 ? "team2" : "team1";
          const otherTeam = [...currentSelection[otherTeamKey]] as TeamSlot;
          for (let i = 0; i < otherTeam.length; i++) {
            if (otherTeam[i] === playerId) {
              otherTeam[i] = null;
            }
          }

          // Устанавливаем игрока в указанный слот
          newTeam[arrayIndex] = playerId;

          return {
            selections: {
              ...state.selections,
              [lobbyId]: {
                ...currentSelection,
                [teamKey]: newTeam,
                [otherTeamKey]: otherTeam,
              },
            },
          };
        } else {
          // Если playerId === null, просто очищаем слот
          newTeam[arrayIndex] = null;

          return {
            selections: {
              ...state.selections,
              [lobbyId]: {
                ...currentSelection,
                [teamKey]: newTeam,
              },
            },
          };
        }
      });
    },

    removePlayerFromTeam: (lobbyId: number, team: 1 | 2, playerId: number) => {
      set((state) => {
        const currentSelection = state.selections[lobbyId];
        if (!currentSelection) return state;

        const teamKey = team === 1 ? "team1" : "team2";
        const newTeam = [...currentSelection[teamKey]] as TeamSlot;

        for (let i = 0; i < newTeam.length; i++) {
          if (newTeam[i] === playerId) {
            newTeam[i] = null;
          }
        }

        return {
          selections: {
            ...state.selections,
            [lobbyId]: {
              ...currentSelection,
              [teamKey]: newTeam,
            },
          },
        };
      });
    },

    clearLobby: (lobbyId: number) => {
      set((state) => {
        const { [lobbyId]: _, ...rest } = state.selections;
        return { selections: rest };
      });
    },

    getLobbySelection: (lobbyId: number) => {
      return get().selections[lobbyId] || null;
    },
  })
);
