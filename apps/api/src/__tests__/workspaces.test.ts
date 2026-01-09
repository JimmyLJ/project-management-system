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

const buildHeaders = (cookie?: string, contentType = true) => {
  const headers: Record<string, string> = {};
  if (trustedOrigin) {
    headers.Origin = trustedOrigin;
  }
  if (cookie) {
    headers.Cookie = cookie;
  }
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const resetTables = async () => {
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
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

const signIn = async (payload: SignInPayload) =>
  app.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

const createAuthenticatedUser = async () => {
  const email = makeEmail();
  const password = "secret123";
  await signUp({ name: "Test User", email, password });
  const signInRes = await signIn({ email, password });
  const cookie = extractCookie(signInRes);
  return { email, cookie };
};

describe("workspaces endpoints", () => {
  beforeEach(async () => {
    await resetTables();
  });

  describe("GET /api/workspaces/me", () => {
    it("未登录返回 401", async () => {
      const res = await app.request("/api/workspaces/me", {
        headers: buildHeaders(undefined, false),
      });
      expect(res.status).toBe(401);
    });

    it("返回用户的工作区列表（空）", async () => {
      const { cookie } = await createAuthenticatedUser();

      const res = await app.request("/api/workspaces/me", {
        headers: buildHeaders(cookie, false),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.workspaces).toEqual([]);
    });

    it("返回用户的工作区列表（有数据）", async () => {
      const { cookie } = await createAuthenticatedUser();

      await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "测试工作区", slug: "test-ws" }),
      });

      const res = await app.request("/api/workspaces/me", {
        headers: buildHeaders(cookie, false),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.workspaces).toHaveLength(1);
      expect(json.workspaces[0].name).toBe("测试工作区");
      expect(json.workspaces[0].slug).toBe("test-ws");
    });
  });

  describe("POST /api/workspaces", () => {
    it("未登录返回 401", async () => {
      const res = await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(undefined),
        body: JSON.stringify({ name: "Test", slug: "test" }),
      });
      expect(res.status).toBe(401);
    });

    it("name 过短返回 400", async () => {
      const { cookie } = await createAuthenticatedUser();

      const res = await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "T", slug: "test" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toContain("2-50");
    });

    it("slug 格式错误返回 400", async () => {
      const { cookie } = await createAuthenticatedUser();

      const res = await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "Test Workspace", slug: "INVALID_SLUG!" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toContain("小写字母");
    });

    it("slug 重复返回 400", async () => {
      const { cookie } = await createAuthenticatedUser();

      await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "First", slug: "my-slug" }),
      });

      const res = await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "Second", slug: "my-slug" }),
      });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.message).toContain("已被使用");
    });

    it("创建成功返回 201", async () => {
      const { cookie } = await createAuthenticatedUser();

      const res = await app.request("/api/workspaces", {
        method: "POST",
        headers: buildHeaders(cookie),
        body: JSON.stringify({ name: "我的工作区", slug: "my-workspace" }),
      });

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.workspace.name).toBe("我的工作区");
      expect(json.workspace.slug).toBe("my-workspace");
      expect(json.workspace.id).toBeDefined();
    });
  });
});
