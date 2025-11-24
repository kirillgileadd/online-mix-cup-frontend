export type PlayerStatus = "active" | "eliminated" | "inactive";

export interface Player {
  id: number;
  userId: number;
  tournamentId: number;
  nickname: string;
  seed: number | null;
  score: number | null;
  chillZoneValue: number | null;
  lives: number | null;
  status: PlayerStatus;
  createdAt: string;
  mmr?: number | null;
  role?: string | null;
  user?: {
    id: number;
    telegramId: string;
    username: string | null;
  };
  tournament?: {
    id: number;
    name: string;
  };
}
