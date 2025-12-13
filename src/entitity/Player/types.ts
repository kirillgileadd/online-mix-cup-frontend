export type PlayerStatus = "active" | "eliminated" | "inactive";

export interface Player {
  id: number;
  userId: number;
  tournamentId: number;
  seed: number | null;
  score: number | null;
  chillZoneValue: number | null;
  lives: number | null;
  status: PlayerStatus;
  createdAt: string;
  mmr?: number | null;
  role?: string | null;
  gameRoles?: string | null;
  user?: {
    id: number;
    telegramId: string;
    username: string | null;
    nickname: string | null;
  };
  tournament?: {
    id: number;
    name: string;
  };
}
