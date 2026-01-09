import { apiRequest } from "~/lib/apiClient";
import type { Workspace, CreateWorkspacePayload, WorkspaceMember } from "./types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  me: ["workspaces", "me"] as const,
  members: (workspaceId?: string) => ["workspaces", workspaceId, "members"] as const,
};

export const getMyWorkspaces = async () => {
  const data = await apiRequest<{ workspaces: Workspace[] }>("/api/workspaces/me");
  return data.workspaces;
};

export const createWorkspace = async (payload: CreateWorkspacePayload) => {
  const data = await apiRequest<{ workspace: Workspace }>("/api/workspaces", {
    method: "POST",
    json: payload,
  });
  return data.workspace;
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const data = await apiRequest<{ members: WorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members`);
  return data.members;
};
