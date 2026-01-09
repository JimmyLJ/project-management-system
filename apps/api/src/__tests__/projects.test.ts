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

const createWorkspace = async (cookie: string, name = "测试工作区", slug = "test-ws") => {
  const res = await app.request("/api/workspaces", {
    method: "POST",
    headers: buildHeaders(cookie),
    body: JSON.stringify({ name, slug }),
  });
  const json = await res.json();
  return { response: res, workspace: json.workspace };
};

describe("projects endpoints", () => {
  beforeEach(async () => {
    await resetTables();
  });

  it("未登录时 GET /api/projects 返回 401", async () => {
    const res = await app.request("/api/projects?workspaceId=abc", {
      headers: buildHeaders(undefined, false),
    });
    expect(res.status).toBe(401);
  });

  it("未登录时 POST /api/projects 返回 401", async () => {
    const res = await app.request("/api/projects", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ workspaceId: "abc", name: "Test" }),
    });
    expect(res.status).toBe(401);
  });

  it("workspaceId 缺失返回 400", async () => {
    const { cookie } = await createAuthenticatedUser();
    const res = await app.request("/api/projects", {
      method: "POST",
      headers: buildHeaders(cookie),
      body: JSON.stringify({ name: "Test Project" }),
    });
    expect(res.status).toBe(400);
  });

  it("无权限访问工作区返回 403", async () => {
    const { cookie: ownerCookie } = await createAuthenticatedUser();
    const { workspace } = await createWorkspace(ownerCookie, "Owner WS", "owner-ws");

    const { cookie: otherCookie } = await createAuthenticatedUser();
    const res = await app.request(`/api/projects?workspaceId=${workspace.id}`, {
      headers: buildHeaders(otherCookie, false),
    });

    expect(res.status).toBe(403);
  });

  it("返回空的项目列表", async () => {
    const { cookie } = await createAuthenticatedUser();
    const { workspace } = await createWorkspace(cookie);

    const res = await app.request(`/api/projects?workspaceId=${workspace.id}`, {
      headers: buildHeaders(cookie, false),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.projects).toEqual([]);
  });

  it("状态不合法返回 400", async () => {
    const { cookie } = await createAuthenticatedUser();
    const { workspace } = await createWorkspace(cookie);

    const res = await app.request("/api/projects", {
      method: "POST",
      headers: buildHeaders(cookie),
      body: JSON.stringify({
        workspaceId: workspace.id,
        name: "Invalid Status",
        status: "bad_status",
        priority: "medium",
      }),
    });

    expect(res.status).toBe(400);
  });

  it("创建项目成功返回 201", async () => {
    const { cookie } = await createAuthenticatedUser();
    const { workspace } = await createWorkspace(cookie);

    const res = await app.request("/api/projects", {
      method: "POST",
      headers: buildHeaders(cookie),
      body: JSON.stringify({
        workspaceId: workspace.id,
        name: "新项目",
        description: "项目描述",
        status: "planning",
        priority: "medium",
        startDate: "2026-01-01",
        endDate: "2026-02-01",
      }),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.project.name).toBe("新项目");
    expect(json.project.status).toBe("planning");
    expect(json.project.priority).toBe("medium");
    expect(json.project.id).toBeDefined();
  });

  it("创建后可以获取项目列表", async () => {
    const { cookie } = await createAuthenticatedUser();
    const { workspace } = await createWorkspace(cookie);

    await app.request("/api/projects", {
      method: "POST",
      headers: buildHeaders(cookie),
      body: JSON.stringify({
        workspaceId: workspace.id,
        name: "项目 A",
        status: "active",
        priority: "high",
      }),
    });

    const res = await app.request(`/api/projects?workspaceId=${workspace.id}`, {
      headers: buildHeaders(cookie, false),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.projects).toHaveLength(1);
    expect(json.projects[0].name).toBe("项目 A");
  });
});
