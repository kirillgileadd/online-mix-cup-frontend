export const UserRole = {
  ADMIN: "admin",
  PLAYER: "player",
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
