import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys, getSession, signOut } from "./api";
import { clearStoredWorkspaceSlug } from "~/features/workspace/storage";

export const useAuthSession = () =>
  useQuery({
    queryKey: authKeys.session,
    queryFn: getSession,
    staleTime: 60_000,
    retry: false,
  });

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearStoredWorkspaceSlug();
      queryClient.clear();
    },
  });
};
