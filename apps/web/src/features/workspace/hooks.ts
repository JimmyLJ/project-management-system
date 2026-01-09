import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getMyWorkspaces, createWorkspace, workspaceKeys } from "./api";
import type { CreateWorkspacePayload } from "./types";

const WORKSPACE_STORAGE_KEY = "pms-workspace";

export const useMyWorkspaces = () => {
  return useQuery({
    queryKey: workspaceKeys.me,
    queryFn: getMyWorkspaces,
    staleTime: 60_000,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) => createWorkspace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.me });
    },
  });
};

const getStoredWorkspaceSlug = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
};

export const useCurrentWorkspace = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug?: string }>();
  const { data: workspaces = [], isLoading } = useMyWorkspaces();
  const storedSlug = getStoredWorkspaceSlug();
  const preferredSlug = workspaceSlug ?? storedSlug ?? undefined;

  const currentWorkspace = useMemo(() => {
    if (workspaces.length === 0) return undefined;
    if (preferredSlug) {
      return workspaces.find((workspace) => workspace.slug === preferredSlug) ?? workspaces[0];
    }
    return workspaces[0];
  }, [preferredSlug, workspaces]);

  useEffect(() => {
    if (typeof window === "undefined" || !currentWorkspace) return;
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, currentWorkspace.slug);
  }, [currentWorkspace]);

  return {
    workspaces,
    currentWorkspace,
    isLoading,
    workspaceSlug,
  };
};
