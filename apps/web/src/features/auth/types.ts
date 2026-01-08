export type AuthUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean | null;
};

export type AuthSession = {
  user?: AuthUser | null;
  session?: Record<string, unknown> | null;
  token?: string | null;
};
