import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inArray, like } from "drizzle-orm";
import { createApp } from "../app";
import { SignJWT } from "jose";
import { db } from "../db";
import { organizationMembers, users } from "../schema";

let app: ReturnType<typeof createApp>;

function uniqueEmail() {
  return `test+${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
}

async function cleanup() {
  const userIds = await db
    .select({ id: users.id })
    .from(users)
    .where(like(users.email, "test+%@example.com"));
  const ids = userIds.map((row) => row.id);
  if (ids.length > 0) {
    await db
      .delete(organizationMembers)
      .where(inArray(organizationMembers.userId, ids));
  }
  await db.delete(users).where(like(users.email, "test+%@example.com"));
}

function extractCookie(setCookie: string | null) {
  if (!setCookie) return "";
  const [cookie] = setCookie.split(";");
  return cookie ?? "";
}

async function postJson(path: string, body: unknown) {
  return app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function signToken(id: number) {
  const secret = process.env.JWT_SECRET ?? "test-secret";
  return new SignJWT({ sub: String(id) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1s")
    .sign(new TextEncoder().encode(secret));
}

beforeAll(async () => {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret";
  }
  app = createApp();
  await cleanup();
});

afterAll(async () => {
  await cleanup();
});

describe("auth", () => {
  it("registers a user and sets cookie", async () => {
    const email = uniqueEmail();
    const response = await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user.email).toBe(email);
    expect(response.headers.get("set-cookie")).toContain("auth_token=");
  });

  it("rejects duplicate registration", async () => {
    const email = uniqueEmail();
    await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });
    const response = await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });

    expect(response.status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    const email = uniqueEmail();
    await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });

    const response = await postJson("/auth/login", {
      email,
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("auth_token=");
    const data = await response.json();
    expect(data.user.email).toBe(email);
  });

  it("rejects invalid login", async () => {
    const response = await postJson("/auth/login", {
      email: "missing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.message).toBe("Invalid email or password.");
  });

  it("rejects invalid register payload", async () => {
    const response = await postJson("/auth/register", {
      name: "",
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
  });

  it("rejects invalid login payload", async () => {
    const response = await postJson("/auth/login", {
      email: "bad-email",
      password: "short",
    });

    expect(response.status).toBe(400);
  });

  it("clears auth cookie on logout", async () => {
    const response = await app.request("/auth/logout", {
      method: "POST",
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("auth_token=");
  });

  it("requires auth for /auth/me", async () => {
    const response = await app.request("/auth/me", { method: "GET" });
    expect(response.status).toBe(401);
  });

  it("allows /auth/me with auth cookie", async () => {
    const email = uniqueEmail();
    const registerResponse = await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });

    const cookie = extractCookie(registerResponse.headers.get("set-cookie"));
    expect(cookie).toContain("auth_token=");

    const meResponse = await app.request("/auth/me", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    expect(meResponse.status).toBe(200);
    const data = await meResponse.json();
    expect(data.user.email).toBe(email);
    expect(data.user.lastOrganizationId).toBeNull();
  });

  it("rejects /auth/me with expired token", async () => {
    const email = uniqueEmail();
    const registerResponse = await postJson("/auth/register", {
      name: "Test User",
      email,
      password: "password123",
    });

    const data = await registerResponse.json();
    const token = await signToken(data.user.id);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const response = await app.request("/auth/me", {
      method: "GET",
      headers: { Cookie: `auth_token=${token}` },
    });

    expect(response.status).toBe(401);
  });
});
