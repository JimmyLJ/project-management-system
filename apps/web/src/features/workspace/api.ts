import { apiRequest } from "~/lib/apiClient";
import type { Workspace, CreateWorkspacePayload } from "./types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  me: ["workspaces", "me"] as const,
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
