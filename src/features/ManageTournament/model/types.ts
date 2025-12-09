export type TournamentFormValues = {
  name: string;
  eventDate?: string | null;
  price: number;
  prizePool?: number | null;
  previewImageBase64?: File | null;
};
