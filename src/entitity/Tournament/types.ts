export type TournamentStatus = "draft" | "collecting" | "running" | "finished";

export interface Tournament {
  id: number;
  name: string;
  status: TournamentStatus;
  eventDate: string | null;
  price: number;
  prizePool: number | null;
  createdAt: string;
}

