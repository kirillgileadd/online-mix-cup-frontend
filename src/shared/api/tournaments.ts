import { authorizedApiClient, publicApiClient } from "./client";
import type { Tournament, TournamentStatus } from "../../entitity/Tournament";

export type GetTournamentsResponse = Tournament[];

export interface CreateTournamentRequest {
  name: string;
  eventDate?: string | null;
  price: number;
  prizePool?: number | null;
  previewImageBase64?: string | null;
}

export type CreateTournamentResponse = Tournament;

export interface UpdateTournamentRequest {
  tournamentId: number;
  name?: string;
  eventDate?: string | null;
  price?: number;
  prizePool?: number | null;
  previewImageBase64?: string | null;
}

export interface UpdateTournamentStatusRequest {
  tournamentId: number;
  status: TournamentStatus;
}

export type UpdateTournamentStatusResponse = Tournament;

export const getTournaments = async (): Promise<GetTournamentsResponse> => {
  const response =
    await authorizedApiClient.get<GetTournamentsResponse>("/tournaments");
  return response.data;
};

export const getPublicTournaments =
  async (): Promise<GetTournamentsResponse> => {
    const response =
      await publicApiClient.get<GetTournamentsResponse>("/tournaments");
    return response.data;
  };

export const getTournament = async (
  tournamentId: number
): Promise<Tournament> => {
  const response = await authorizedApiClient.get<Tournament>(
    `/tournaments/${tournamentId}`
  );
  return response.data;
};

export const getPublicTournament = async (
  tournamentId: number
): Promise<Tournament> => {
  const response = await publicApiClient.get<Tournament>(
    `/tournaments/${tournamentId}`
  );
  return response.data;
};

export const createTournament = async (
  data: CreateTournamentRequest
): Promise<CreateTournamentResponse> => {
  const response = await authorizedApiClient.post<CreateTournamentResponse>(
    "/tournaments",
    data
  );
  return response.data;
};

export const updateTournament = async (
  data: UpdateTournamentRequest
): Promise<Tournament> => {
  const { tournamentId, ...updateData } = data;
  const response = await authorizedApiClient.patch<Tournament>(
    `/tournaments/${tournamentId}`,
    updateData
  );
  return response.data;
};

export const updateTournamentStatus = async (
  data: UpdateTournamentStatusRequest
): Promise<UpdateTournamentStatusResponse> => {
  const response =
    await authorizedApiClient.patch<UpdateTournamentStatusResponse>(
      `/tournaments/${data.tournamentId}/status`,
      { status: data.status }
    );
  return response.data;
};

export const startTournament = async (
  tournamentId: number
): Promise<Tournament> => {
  const response = await authorizedApiClient.post<Tournament>(
    `/tournaments/${tournamentId}/start`
  );
  return response.data;
};

export type DeleteTournamentResponse = Tournament;

export const deleteTournament = async (
  tournamentId: number
): Promise<DeleteTournamentResponse> => {
  const response = await authorizedApiClient.delete<DeleteTournamentResponse>(
    `/tournaments/${tournamentId}`
  );
  return response.data;
};
