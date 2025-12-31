import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { and, eq, inArray, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { createApp } from "../app";
import { db } from "../db";
import { organizationMembers, organizations, users } from "../schema";

let app: ReturnType<typeof createApp>;

function uniqueEmail() {
  return `test+${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
}

async function cleanup() {
  const orgIds = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(like(organizations.slug, "test-org-%"));

  const userIds = await db
    .select({ id: users.id })
    .from(users)
    .where(like(users.email, "test+%@example.com"));

  const conditions: SQL[] = [];
  const orgIdValues = orgIds.map((row) => row.id);
  const userIdValues = userIds.map((row) => row.id);

  if (orgIdValues.length > 0) {
    conditions.push(inArray(organizationMembers.organizationId, orgIdValues));
  }
  if (userIdValues.length > 0) {
    conditions.push(inArray(organizationMembers.userId, userIdValues));
  }

  if (conditions.length === 1) {
    await db.delete(organizationMembers).where(conditions[0]);
  } else if (conditions.length > 1) {
    await db.delete(organizationMembers).where(or(...conditions));
  }

  if (orgIds.length > 0) {
    await db.delete(organizations).where(like(organizations.slug, "test-org-%"));
  }

  await db.delete(users).where(like(users.email, "test+%@example.com"));
}

function extractCookie(setCookie: string | null) {
  if (!setCookie) return "";
  const [cookie] = setCookie.split(";");
  return cookie ?? "";
}

async function registerAndGetCookie() {
  const email = uniqueEmail();
  const response = await app.request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email,
      password: "password123",
    }),
  });
  const cookie = extractCookie(response.headers.get("set-cookie"));
  return { cookie, email };
}

function buildFile(
  size: number,
  type: string,
  name: string,
): { file: Blob; filename: string } {
  const buffer = new Uint8Array(size);
  const file = new Blob([buffer], { type });
  return { file, filename: name };
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

describe("organizations", () => {
  it("creates organization with logo", async () => {
    const { cookie, email } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);
    const { file, filename } = buildFile(1024, "image/png", "logo.png");
    form.append("logo", file, filename);

    const response = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.organization.slug).toContain("test-org-");
    expect(data.organization.logoUrl).toContain("/uploads/");

    const relativePath = String(data.organization.logoUrl).replace(/^\//, "");
    const logoPath = join(process.cwd(), relativePath);
    expect(existsSync(logoPath)).toBe(true);
    await unlink(logoPath);

    const userRows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const userId = userRows[0]?.id;
    expect(userId).toBeTruthy();

    const membership = await db
      .select({ id: organizationMembers.id })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, Number(userId)),
          eq(organizationMembers.organizationId, data.organization.id),
        ),
      )
      .limit(1);
    expect(membership.length).toBe(1);
  });

  it("rejects invalid logo type", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);
    const { file, filename } = buildFile(1024, "image/gif", "logo.gif");
    form.append("logo", file, filename);

    const response = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    expect(response.status).toBe(400);
  });

  it("rejects oversized logo", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);
    const { file, filename } = buildFile(
      10 * 1024 * 1024 + 1,
      "image/png",
      "logo.png",
    );
    form.append("logo", file, filename);

    const response = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    expect(response.status).toBe(413);
  });

  it("rejects invalid organization payload", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", "Invalid Slug");

    const response = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    expect(response.status).toBe(400);
  });

  it("returns empty organization list for new user", async () => {
    const { cookie } = await registerAndGetCookie();

    const response = await app.request("/orgs", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.organizations)).toBe(true);
    expect(data.organizations).toHaveLength(0);
  });

  it("returns organization for current user", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);

    await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    const response = await app.request("/orgs/mine", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.organization).toBeTruthy();
  });

  it("returns organization list for current user", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);

    const createResponse = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });
    expect(createResponse.status).toBe(200);

    const response = await app.request("/orgs", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.organizations)).toBe(true);
    expect(data.organizations.length).toBe(1);
    expect(data.organizations[0].slug).toContain("test-org-");
  });

  it("exposes last organization id in /auth/me", async () => {
    const { cookie } = await registerAndGetCookie();
    const form = new FormData();
    form.append("name", "Test Org");
    form.append("slug", `test-org-${Date.now()}`);

    const createResponse = await app.request("/orgs", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    });

    const createData = await createResponse.json();
    const response = await app.request("/auth/me", {
      method: "GET",
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user.lastOrganizationId).toBe(createData.organization.id);
  });
});
