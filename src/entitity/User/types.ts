export interface User {
  id: number;
  telegramId: string;
  username: string | null;
  photoUrl: string | null;
  discordUsername: string | null;
  createdAt: string;
  roles: string[];
}
