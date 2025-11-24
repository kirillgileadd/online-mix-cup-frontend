import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "./types.ts";

interface PlayerStoreState {
  players: Player[];
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: number) => void;
  setPlayers: (player: Player) => void; // now updates a single player
  loseLives: (playerIds: number[]) => void; // decrement lives for losers
  incrementChillZone: (playerIds: number[]) => void; // increment chillZoneValue for chill zone players
}

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set, get) => ({
      players: [],
      addPlayer: (player: Player) =>
        set({ players: [...get().players, player] }),
      // update single player by id
      setPlayers: (player: Player) =>
        set({
          players: get().players.map((p) => (p.id === player.id ? player : p)),
        }),
      removePlayer: (playerId: number) =>
        set({ players: get().players.filter((p) => p.id !== playerId) }),
      loseLives: (playerIds: number[]) =>
        set({
          players: get().players.map((p) =>
            playerIds.includes(p.id)
              ? { ...p, lives: Math.max(0, (p.lives ?? 0) - 1) }
              : p
          ),
        }),
      incrementChillZone: (playerIds: number[]) =>
        set({
          players: get().players.map((p) =>
            playerIds.includes(p.id)
              ? { ...p, chillZoneValue: (p.chillZoneValue ?? 0) + 1 }
              : p
          ),
        }),
    }),
    {
      name: "player-storage",
      partialize: (state) => ({
        players: state.players,
      }),
    }
  )
);
