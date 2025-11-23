import { authorizedApiClient } from "./client";
import type { Role } from "../../entitity/Role";

export type GetRolesResponse = Role[];

export const getRoles = async (): Promise<GetRolesResponse> => {
  const response = await authorizedApiClient.get<GetRolesResponse>("/roles");
  return response.data;
};

