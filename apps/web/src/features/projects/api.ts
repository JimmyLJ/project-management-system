import { apiRequest } from "~/lib/apiClient";
import type { CreateProjectPayload, Project } from "./types";

export const projectKeys = {
  all: ["projects"] as const,
  list: (workspaceId?: string) => ["projects", "list", workspaceId] as const,
};

export const getProjects = async (workspaceId: string) => {
  const data = await apiRequest<{ projects: Project[] }>(`/api/projects?workspaceId=${encodeURIComponent(workspaceId)}`);
  return data.projects;
};

export const createProject = async (payload: CreateProjectPayload) => {
  const data = await apiRequest<{ project: Project }>("/api/projects", {
    method: "POST",
    json: payload,
  });
  return data.project;
};
