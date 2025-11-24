import { authorizedApiClient, publicApiClient } from "./client";

export type LobbyStatus = "PENDING" | "DRAFTING" | "PLAYING" | "FINISHED";

export type ParticipationResult = "WIN" | "LOSS" | "NONE";

export interface Participation {
  id: number;
  lobbyId: number;
  tournamentPlayerId?: number | null;
  playerId: number;
  team?: number | null;
  isCaptain: boolean;
  pickedAt?: string | null;
  result?: ParticipationResult | null;
  player?: {
    id: number;
    nickname?: string;
    username: string;
    mmr: number;
    lives: number;
  };
}

export interface Lobby {
  id: number;
  round: number;
  status: LobbyStatus;
  tournamentId?: number | null;
  createdAt: string;
  participations: Participation[];
}

export interface GenerateLobbiesRequest {
  tournamentId: number;
}

export type GenerateLobbiesResponse = Lobby[];

export type StartDraftResponse = Lobby;

export interface DraftPickRequest {
  lobbyId: number;
  playerId: number;
  team: number;
}

export type DraftPickResponse = Lobby;

export interface FinishLobbyRequest {
  lobbyId: number;
  winningTeam: number;
}

export type FinishLobbyResponse = Lobby;

export const generateLobbies = async (
  data: GenerateLobbiesRequest
): Promise<GenerateLobbiesResponse> => {
  const response = await authorizedApiClient.post<GenerateLobbiesResponse>(
    "/lobbies/generate-lobbies",
    data
  );
  return response.data;
};

export const startDraft = async (
  lobbyId: number
): Promise<StartDraftResponse> => {
  const response = await authorizedApiClient.post<StartDraftResponse>(
    `/lobbies/${lobbyId}/start-draft`
  );
  return response.data;
};

export const draftPick = async (
  data: DraftPickRequest
): Promise<DraftPickResponse> => {
  const response = await authorizedApiClient.post<DraftPickResponse>(
    "/lobbies/draft-pick",
    data
  );
  return response.data;
};

export const finishLobby = async (
  data: FinishLobbyRequest
): Promise<FinishLobbyResponse> => {
  const response = await authorizedApiClient.post<FinishLobbyResponse>(
    "/lobbies/finish-lobby",
    data
  );
  return response.data;
};

export const getLobbyById = async (lobbyId: number): Promise<Lobby> => {
  const response = await authorizedApiClient.get<Lobby>(`/lobbies/${lobbyId}`);
  return response.data;
};

export const listLobbiesByTournament = async (
  tournamentId: number
): Promise<Lobby[]> => {
  const response = await authorizedApiClient.get<Lobby[]>(
    `/lobbies/tournament/${tournamentId}`
  );
  return response.data;
};

export const listPublicLobbiesByTournament = async (
  tournamentId: number
): Promise<Lobby[]> => {
  const response = await publicApiClient.get<Lobby[]>(
    `/lobbies/tournament/${tournamentId}`
  );
  return response.data;
};

export interface LongPollLobbiesResponse {
  lastUpdate: string;
  lobbies: Lobby[];
}

export const longPollLobbies = async (
  tournamentId: number,
  params?: { since?: string; timeoutMs?: number }
): Promise<LongPollLobbiesResponse | null> => {
  const response = await publicApiClient.get<LongPollLobbiesResponse>(
    `/lobbies/tournament/${tournamentId}/long-poll`,
    {
      params,
      validateStatus: (status) => status === 200 || status === 204,
    }
  );
  if (response.status === 204) {
    return null;
  }
  return response.data;
};
