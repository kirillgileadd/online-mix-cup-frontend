export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application {
  id: number;
  userId: number;
  tournamentId: number;
  mmr: number;
  gameRoles: string;
  nickname: string | null;
  status: ApplicationStatus;
  createdAt: string;
  dotabuff?: string | null;
  receiptImageUrl?: string | null;
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
