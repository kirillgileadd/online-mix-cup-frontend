import { authorizedApiClient, publicApiClient } from "./client";
import type { Player } from "../../entitity/Player";

export type GetPlayersResponse = Player[];

export interface GetPlayersParams {
  tournamentId?: number;
}

export type GetPlayerResponse = Player;

export interface CreatePlayerRequest {
  userId: number;
  tournamentId: number;
  nickname: string;
  mmr?: number | null;
  seed?: number | null;
  score?: number | null;
  chillZoneValue?: number | null;
  lives?: number | null;
  status?: "active" | "eliminated";
}

export type CreatePlayerResponse = Player;

export interface UpdatePlayerRequest {
  playerId: number;
  nickname?: string;
  mmr?: number | null;
  seed?: number | null;
  score?: number | null;
  chillZoneValue?: number | null;
  lives?: number | null;
  status?: Player["status"];
}

export type UpdatePlayerResponse = Player;

export const getPlayers = async (
  params?: GetPlayersParams
): Promise<GetPlayersResponse> => {
  const queryParams = params?.tournamentId
    ? `?tournamentId=${params.tournamentId}`
    : "";
  const response = await authorizedApiClient.get<GetPlayersResponse>(
    `/players${queryParams}`
  );
  return response.data;
};

export const getPlayer = async (
  playerId: number
): Promise<GetPlayerResponse> => {
  const response = await authorizedApiClient.get<GetPlayerResponse>(
    `/players/${playerId}`
  );
  return response.data;
};

export const createPlayer = async (
  data: CreatePlayerRequest
): Promise<CreatePlayerResponse> => {
  const response = await authorizedApiClient.post<CreatePlayerResponse>(
    "/players",
    data
  );
  return response.data;
};

export const updatePlayer = async (
  data: UpdatePlayerRequest
): Promise<UpdatePlayerResponse> => {
  const { playerId, ...updateData } = data;
  const response = await authorizedApiClient.patch<UpdatePlayerResponse>(
    `/players/${playerId}`,
    updateData
  );
  return response.data;
};

export const getPublicPlayers = async (
  tournamentId: number
): Promise<Player[]> => {
  const response = await publicApiClient.get<Player[]>(
    `/players?tournamentId=${tournamentId}`
  );
  return response.data;
};

export const getChillZonePlayers = async (
  tournamentId: number,
  round?: number
): Promise<Player[]> => {
  const query = round !== undefined ? `?round=${round}` : "";
  const response = await publicApiClient.get<Player[]>(
    `/players/tournament/${tournamentId}/chill-zone${query}`
  );
  return response.data;
};

