import { apiRequest, ApiError } from "~/lib/apiClient";
import type { AuthSession } from "./types";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export const getSession = async () => {
  try {
    return await apiRequest<AuthSession | null>("/api/auth/get-session");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
};

export const signOut = async () => apiRequest<void>("/api/auth/sign-out", { method: "POST" });

export const signInWithEmail = async (payload: { email: string; password: string }) =>
  apiRequest<AuthSession>("/api/auth/sign-in/email", {
    method: "POST",
    json: payload,
  });

export const signUpWithEmail = async (payload: { name: string; email: string; password: string }) =>
  apiRequest<AuthSession>("/api/auth/sign-up/email", {
    method: "POST",
    json: payload,
  });
