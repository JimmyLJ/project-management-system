import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects, projectKeys } from "./api";
import type { CreateProjectPayload } from "./types";

export const useProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: projectKeys.list(workspaceId),
    queryFn: () => getProjects(workspaceId as string),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list(variables.workspaceId) });
    },
  });
};
