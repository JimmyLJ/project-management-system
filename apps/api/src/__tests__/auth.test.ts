import { beforeEach, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { app } from "./test-utils";
import { db } from "../db";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

const trustedOrigin = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")[0];

const buildHeaders = (cookie?: string) => {
  const headers: Record<string, string> = {};
  if (trustedOrigin) {
    headers.Origin = trustedOrigin;
  }
  if (cookie) {
    headers.Cookie = cookie;
  }
  return headers;
};

const resetAuthTables = async () => {
  await db.execute(
    sql`TRUNCATE TABLE "auth_sessions", "auth_accounts", "auth_verifications", "auth_users" RESTART IDENTITY CASCADE`,
  );
};

const makeEmail = () => `user_${Date.now()}_${Math.random().toString(16).slice(2)}@example.com`;

const extractCookie = (response: Response) => {
  const raw = response.headers.get("set-cookie");
  if (!raw) {
    return "";
  }
  return raw.split(",")[0].split(";")[0];
};

const signUp = async (payload: SignUpPayload) =>
  app.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify(payload),
  });

const signIn = async (payload: SignInPayload) =>
  app.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify(payload),
  });

describe("auth endpoints", () => {
  beforeEach(async () => {
    await resetAuthTables();
  });

  it("注册后可以登录", async () => {
    const email = makeEmail();
    const password = "secret123";

    const signUpRes = await signUp({ name: "Test User", email, password });
    expect(signUpRes.status).toBe(200);

    const signInRes = await signIn({ email, password });
    expect(signInRes.status).toBe(200);

    const json = await signInRes.json();
    expect(json?.user?.email).toBe(email);
  });

  it("密码错误时返回 401", async () => {
    const email = makeEmail();
    const password = "secret123";

    await signUp({ name: "Test User", email, password });

    const signInRes = await signIn({ email, password: "wrong-pass" });
    expect(signInRes.status).toBe(401);
  });

  it("未登录时 get-session 返回 401 或空会话", async () => {
    const sessionRes = await app.request("/api/auth/get-session", {
      headers: buildHeaders(),
    });

    if (sessionRes.status === 200) {
      const json = await sessionRes.json();
      expect(json).toBeNull();
    } else {
      expect(sessionRes.status).toBe(401);
    }
  });

  it("登录后 get-session 返回用户信息", async () => {
    const email = makeEmail();
    const password = "secret123";

    await signUp({ name: "Test User", email, password });
    const signInRes = await signIn({ email, password });
    const cookie = extractCookie(signInRes);
    expect(cookie).not.toBe("");

    const sessionRes = await app.request("/api/auth/get-session", {
      headers: buildHeaders(cookie),
    });

    expect(sessionRes.status).toBe(200);

    const json = await sessionRes.json();
    expect(json?.user?.email).toBe(email);
  });

  it("登出后会话失效", async () => {
    const email = makeEmail();
    const password = "secret123";

    await signUp({ name: "Test User", email, password });
    const signInRes = await signIn({ email, password });
    const cookie = extractCookie(signInRes);

    const signOutRes = await app.request("/api/auth/sign-out", {
      method: "POST",
      headers: buildHeaders(cookie),
    });

    expect(signOutRes.status).toBeGreaterThanOrEqual(200);
    expect(signOutRes.status).toBeLessThan(300);

    const sessionRes = await app.request("/api/auth/get-session", {
      headers: buildHeaders(cookie),
    });

    if (sessionRes.status === 200) {
      const json = await sessionRes.json();
      expect(json).toBeNull();
    } else {
      expect(sessionRes.status).toBe(401);
    }
  });

  it("登出后仍可重新登录", async () => {
    const email = makeEmail();
    const password = "secret123";

    await signUp({ name: "Test User", email, password });
    const signInRes = await signIn({ email, password });
    const cookie = extractCookie(signInRes);
    expect(cookie).not.toBe("");

    await app.request("/api/auth/sign-out", {
      method: "POST",
      headers: buildHeaders(cookie),
    });

    const signInAgainRes = await signIn({ email, password });
    expect(signInAgainRes.status).toBe(200);
    expect(extractCookie(signInAgainRes)).not.toBe("");
  });
});
