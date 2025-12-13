import { authorizedApiClient, publicApiClient } from "./client";
import type { Leaderboard } from "../../entitity/Leaderboard";

export type GetLeaderboardResponse = Leaderboard[];

export interface GetLeaderboardParams {
  limit?: number;
  offset?: number;
}

export type GetLeaderboardItemResponse = Leaderboard;

export interface CreateLeaderboardRequest {
  userId: number;
  points?: number;
  createdAt?: string;
}

export type CreateLeaderboardResponse = Leaderboard;

export interface UpdateLeaderboardRequest {
  points?: number;
  createdAt?: string;
}

export type UpdateLeaderboardResponse = Leaderboard;

export interface AddPointsRequest {
  points: number;
}

export type AddPointsResponse = Leaderboard;

export interface GetUserRankResponse {
  rank: number | null;
}

export const getLeaderboard = async (
  params?: GetLeaderboardParams
): Promise<GetLeaderboardResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params?.offset) {
    queryParams.append("offset", params.offset.toString());
  }
  const queryString = queryParams.toString();
  const response = await publicApiClient.get<GetLeaderboardResponse>(
    `/leaderboard${queryString ? `?${queryString}` : ""}`
  );
  return response.data;
};

export const getLeaderboardItem = async (
  id: number
): Promise<GetLeaderboardItemResponse> => {
  const response = await publicApiClient.get<GetLeaderboardItemResponse>(
    `/leaderboard/${id}`
  );
  return response.data;
};

export const getLeaderboardByUserId = async (
  userId: number
): Promise<GetLeaderboardItemResponse> => {
  const response = await publicApiClient.get<GetLeaderboardItemResponse>(
    `/leaderboard/user/${userId}`
  );
  return response.data;
};

export const getUserRank = async (
  userId: number
): Promise<GetUserRankResponse> => {
  const response = await publicApiClient.get<GetUserRankResponse>(
    `/leaderboard/user/${userId}/rank`
  );
  return response.data;
};

export const createLeaderboard = async (
  data: CreateLeaderboardRequest
): Promise<CreateLeaderboardResponse> => {
  const response = await authorizedApiClient.post<CreateLeaderboardResponse>(
    "/leaderboard",
    data
  );
  return response.data;
};

export const updateLeaderboard = async (
  id: number,
  data: UpdateLeaderboardRequest
): Promise<UpdateLeaderboardResponse> => {
  const response = await authorizedApiClient.put<UpdateLeaderboardResponse>(
    `/leaderboard/${id}`,
    data
  );
  return response.data;
};

export const updateLeaderboardByUserId = async (
  userId: number,
  data: UpdateLeaderboardRequest
): Promise<UpdateLeaderboardResponse> => {
  const response = await authorizedApiClient.put<UpdateLeaderboardResponse>(
    `/leaderboard/user/${userId}`,
    data
  );
  return response.data;
};

export const addPoints = async (
  userId: number,
  data: AddPointsRequest
): Promise<AddPointsResponse> => {
  const response = await authorizedApiClient.post<AddPointsResponse>(
    `/leaderboard/user/${userId}/add-points`,
    data
  );
  return response.data;
};

export const deleteLeaderboard = async (id: number): Promise<void> => {
  await authorizedApiClient.delete(`/leaderboard/${id}`);
};

export const deleteLeaderboardByUserId = async (userId: number): Promise<void> => {
  await authorizedApiClient.delete(`/leaderboard/user/${userId}`);
};

export const recalculateRanks = async (): Promise<{ message: string }> => {
  const response = await authorizedApiClient.post<{ message: string }>(
    "/leaderboard/recalculate-ranks"
  );
  return response.data;
};

