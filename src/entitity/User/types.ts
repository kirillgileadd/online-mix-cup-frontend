export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  nickname: string | null;
  photoUrl: string | null;
  discordUsername: string | null;
  steamId64: string | null;
  createdAt: string;
  roles: string[];
}
