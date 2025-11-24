import { authorizedApiClient, publicApiClient } from "./client";
import type {
  Application,
  ApplicationStatus,
} from "../../entitity/Application";

export type GetPendingApplicationsResponse = Application[];

export interface GetPendingApplicationsParams {
  tournamentId?: number;
}

export type ApproveApplicationResponse = Application;
export type RejectApplicationResponse = Application;

export const getPendingApplications = async (
  params?: GetPendingApplicationsParams
): Promise<GetPendingApplicationsResponse> => {
  const queryParams = params?.tournamentId
    ? `?tournamentId=${params.tournamentId}`
    : "";
  const response =
    await authorizedApiClient.get<GetPendingApplicationsResponse>(
      `/applications/${queryParams}`
    );
  return response.data;
};

export const approveApplication = async (
  applicationId: number
): Promise<ApproveApplicationResponse> => {
  const response = await authorizedApiClient.post<ApproveApplicationResponse>(
    `/applications/${applicationId}/approve`
  );
  return response.data;
};

export const rejectApplication = async (
  applicationId: number
): Promise<RejectApplicationResponse> => {
  const response = await authorizedApiClient.post<RejectApplicationResponse>(
    `/applications/${applicationId}/reject`
  );
  return response.data;
};

export const getPublicApplications = async (
  tournamentId: number
): Promise<Application[]> => {
  const response = await publicApiClient.get<Application[]>(
    `/applications?tournamentId=${tournamentId}`
  );
  return response.data;
};
