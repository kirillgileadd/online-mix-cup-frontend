export interface Leaderboard {
  id: number;
  userId: number;
  points: number;
  rank: number | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    telegramId: string;
    username: string | null;
    nickname: string | null;
    photoUrl: string | null;
  };
}
