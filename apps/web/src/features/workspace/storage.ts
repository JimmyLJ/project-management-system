const WORKSPACE_STORAGE_KEY = "pms-workspace";

export const getStoredWorkspaceSlug = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
};

export const setStoredWorkspaceSlug = (slug: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, slug);
};

export const clearStoredWorkspaceSlug = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
};
