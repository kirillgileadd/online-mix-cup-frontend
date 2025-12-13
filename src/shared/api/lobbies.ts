import { authorizedApiClient, publicApiClient } from "./client";

export type LobbyStatus = "PENDING" | "DRAFTING" | "PLAYING" | "FINISHED";

export type ParticipationResult = "WIN" | "LOSS" | "NONE";

export interface Participation {
  id: number;
  lobbyId: number;
  teamId?: number | null;
  playerId: number;
  slot?: number | null;
  isCaptain: boolean;
  pickedAt?: string | null;
  result?: ParticipationResult | null;
  updatedAt?: string;
  player?: {
    id: number;
    username: string;
    mmr: number;
    lives: number;
    gameRoles?: string | null;
    user?: {
      id: number;
      telegramId: string;
      username?: string | null;
      nickname?: string | null;
      discordUsername?: string | null;
    } | null;
  } | null;
}

export interface Team {
  id: number;
  lobbyId: number;
  discordChannelId?: string | null;
  createdAt: string;
  participations?: Participation[];
}

export interface SteamLobby {
  lobbyId: number;
  gameName: string;
  gameMode: number;
  passKey: string;
  serverRegion: number;
  allowCheats: boolean;
  fillWithBots: boolean;
  allowSpectating: boolean;
  visibility: number;
  allchat: boolean;
}

export interface Lobby {
  id: number;
  round: number;
  status: LobbyStatus;
  tournamentId?: number | null;
  lotteryWinnerId?: number | null; // ID капитана-победителя жребия
  firstPickerId?: number | null; // ID капитана, который выбирает первым
  createdAt: string;
  updatedAt?: string;
  participations: Participation[];
  teams: Team[];
  steamLobby?: SteamLobby | null;
}

export interface GenerateLobbiesRequest {
  tournamentId: number;
}

export type GenerateLobbiesResponse = Lobby[];

export type StartDraftResponse = Lobby;

export interface DraftPickRequest {
  lobbyId: number;
  playerId: number | null;
  teamId: number;
  slot: number;
  type: "add" | "remove";
}

export type DraftPickResponse = Lobby;

export interface FinishLobbyRequest {
  lobbyId: number;
  winningTeamId: number; // teamId команды-победителя
}

export type FinishLobbyResponse = Lobby;

export interface StartPlayingRequest {
  lobbyId: number;
  gameName?: string;
  gameMode?: number;
  passKey?: string;
  serverRegion?: number;
}

export type StartPlayingResponse = Lobby;

export interface ReplacePlayerRequest {
  lobbyId: number;
  playerId: number;
}

export type ReplacePlayerResponse = Lobby;

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

export const startPlaying = async (
  data: StartPlayingRequest
): Promise<StartPlayingResponse> => {
  const response = await authorizedApiClient.post<StartPlayingResponse>(
    "/lobbies/start-playing",
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

export const replacePlayer = async (
  data: ReplacePlayerRequest
): Promise<ReplacePlayerResponse> => {
  const response = await authorizedApiClient.post<ReplacePlayerResponse>(
    "/lobbies/replace-player",
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

export interface GetCurrentPickerResponse {
  currentPickerId: number | null;
}

export const getCurrentPicker = async (
  lobbyId: number
): Promise<GetCurrentPickerResponse> => {
  const response = await authorizedApiClient.get<GetCurrentPickerResponse>(
    `/lobbies/${lobbyId}/current-picker`
  );
  return response.data;
};

export interface SetFirstPickerRequest {
  lobbyId: number;
  firstPickerId: number;
}

export type SetFirstPickerResponse = Lobby;

export const setFirstPicker = async (
  data: SetFirstPickerRequest
): Promise<SetFirstPickerResponse> => {
  const response = await authorizedApiClient.post<SetFirstPickerResponse>(
    `/lobbies/${data.lobbyId}/set-first-picker`,
    { firstPickerId: data.firstPickerId }
  );
  return response.data;
};

export interface CreateSteamLobbyRequest {
  lobbyId: number;
  gameName?: string;
  gameMode?: number;
  passKey?: string;
  serverRegion?: number;
}

export interface CreateSteamLobbyResponse {
  success: boolean;
  message: string;
  steamLobby: SteamLobby | null;
}

export interface LeaveSteamLobbyResponse {
  success: boolean;
  message: string;
}

export const createSteamLobby = async (
  data: CreateSteamLobbyRequest
): Promise<CreateSteamLobbyResponse> => {
  const response = await authorizedApiClient.post<CreateSteamLobbyResponse>(
    "/lobbies/create-steam-lobby",
    data
  );
  return response.data;
};

export const leaveSteamLobby = async (): Promise<LeaveSteamLobbyResponse> => {
  const response = await authorizedApiClient.post<LeaveSteamLobbyResponse>(
    "/lobbies/leave-steam-lobby"
  );
  return response.data;
};
