import { authorizedApiClient } from "./client";
import type { User } from "../../entitity/User";

export type GetUserResponse = User;

export type GetUsersResponse = User[];

export interface CreateUserRequest {
  telegramId: string;
  username?: string;
  photoUrl?: string;
  discordUsername?: string;
  steamId64?: string;
  roles?: string[];
}

export interface CreateUserResponse {
  user: User;
}

export interface UpdateUserRequest {
  userId: number;
  username?: string;
  photoUrl?: string;
  discordUsername?: string;
  steamId64?: string;
  roles?: string[];
}

export type UpdateUserResponse = User;

export const getUser = async (userId: number): Promise<GetUserResponse> => {
  const response = await authorizedApiClient.get<GetUserResponse>(
    `/users/id/${userId}`
  );
  return response.data;
};

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await authorizedApiClient.get<GetUsersResponse>("/users");
  return response.data;
};

export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  const response = await authorizedApiClient.post<CreateUserResponse>(
    "/users",
    data
  );
  return response.data;
};

export const updateUser = async (
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await authorizedApiClient.patch<UpdateUserResponse>(
    `/users/${data.userId}`,
    data
  );
  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await authorizedApiClient.delete(`/users/${userId}`);
};
