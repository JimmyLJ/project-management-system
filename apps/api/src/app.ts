import { Hono } from "hono";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";
import { jwt } from "hono/jwt";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { SignJWT } from "jose";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import { organizationMembers, organizations, users } from "./schema";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
});

const organizationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  logoUrl: z.string().trim().url().optional().nullable(),
});

export function createApp() {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.post("/auth/register", async (c) => {
    const payload = registerSchema.safeParse(await c.req.json());

    if (!payload.success) {
      return c.json({ message: "Invalid registration data." }, 400);
    }

    const email = payload.data.email.toLowerCase();
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return c.json({ message: "Email already registered." }, 409);
    }

    const passwordHash = await bcrypt.hash(payload.data.password, 12);
    const inserted = await db
      .insert(users)
      .values({
        name: payload.data.name,
        email,
        passwordHash,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    const user = inserted[0];
    if (!user) {
      return c.json({ message: "Registration failed." }, 500);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return c.json({ message: "JWT_SECRET is not configured." }, 500);
    }

    const token = await new SignJWT({ sub: String(user.id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    setCookie(c, "auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({ user });
  });

  app.post("/auth/login", async (c) => {
    const payload = loginSchema.safeParse(await c.req.json());

    if (!payload.success) {
      return c.json({ message: "Invalid login data." }, 400);
    }

    const email = payload.data.email.toLowerCase();
    const records = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const userRecord = records[0];
    if (!userRecord) {
      return c.json({ message: "Invalid email or password." }, 401);
    }

    const passwordOk = await bcrypt.compare(
      payload.data.password,
      userRecord.passwordHash,
    );
    if (!passwordOk) {
      return c.json({ message: "Invalid email or password." }, 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return c.json({ message: "JWT_SECRET is not configured." }, 500);
    }

    const token = await new SignJWT({
      sub: String(userRecord.id),
      email: userRecord.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    setCookie(c, "auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      },
    });
  });

  const jwtSecret = process.env.JWT_SECRET ?? "";

  if (!jwtSecret) {
    app.get("/auth/me", (c) =>
      c.json({ message: "JWT_SECRET is not configured." }, 500),
    );
  } else {
    app.get(
      "/auth/me",
      jwt({ secret: jwtSecret, cookie: "auth_token" }),
      async (c) => {
        const payload = c.get("jwtPayload");
        const userId = Number(payload?.sub);
        if (!userId) {
          return c.json({ message: "Unauthorized." }, 401);
        }

        const records = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            lastOrganizationId: users.lastOrganizationId,
          })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        const user = records[0];
        if (!user) {
          return c.json({ message: "Unauthorized." }, 401);
        }

        return c.json({ user });
      },
    );
  }

  if (!jwtSecret) {
    app.use("/orgs/*", (c) =>
      c.json({ message: "JWT_SECRET is not configured." }, 500),
    );
  } else {
    app.use("/orgs/*", jwt({ secret: jwtSecret, cookie: "auth_token" }));
  }

  app.get("/orgs/mine", async (c) => {
    const payload = c.get("jwtPayload");
    const userId = Number(payload?.sub);
    if (!userId) {
      return c.json({ message: "Unauthorized." }, 401);
    }

    const rows = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logoUrl: organizations.logoUrl,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id),
      )
      .where(eq(organizationMembers.userId, userId))
      .limit(1);

    const organization = rows[0] ?? null;
    return c.json({ organization });
  });

  app.get("/orgs", async (c) => {
    const payload = c.get("jwtPayload");
    const userId = Number(payload?.sub);
    if (!userId) {
      return c.json({ message: "Unauthorized." }, 401);
    }

    const rows = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        logoUrl: organizations.logoUrl,
      })
      .from(organizationMembers)
      .innerJoin(
        organizations,
        eq(organizationMembers.organizationId, organizations.id),
      )
      .where(eq(organizationMembers.userId, userId));

    return c.json({ organizations: rows });
  });

  app.post("/orgs/active", async (c) => {
    const payload = c.get("jwtPayload");
    const userId = Number(payload?.sub);
    if (!userId) {
      return c.json({ message: "Unauthorized." }, 401);
    }

    const body = await c.req.json().catch(() => null);
    const orgId = Number(body?.orgId);
    if (!orgId) {
      return c.json({ message: "Invalid organization." }, 400);
    }

    const membership = await db
      .select({ id: organizationMembers.id })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, orgId),
        ),
      )
      .limit(1);

    if (membership.length === 0) {
      return c.json({ message: "Forbidden." }, 403);
    }

    await db
      .update(users)
      .set({ lastOrganizationId: orgId })
      .where(eq(users.id, userId));

    return c.json({ ok: true });
  });

  app.post("/orgs", async (c) => {
    const authPayload = c.get("jwtPayload");
    const userId = Number(authPayload?.sub);
    if (!userId) {
      return c.json({ message: "Unauthorized." }, 401);
    }

    const uploadDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const formData = await c.req.formData();
    const name = formData.get("name");
    const slugValue = formData.get("slug");
    const logo = formData.get("logo");

    const payload = organizationSchema.safeParse({
      name: typeof name === "string" ? name : "",
      slug: typeof slugValue === "string" ? slugValue : "",
      logoUrl: undefined,
    });

    if (!payload.success) {
      return c.json({ message: "Invalid organization data." }, 400);
    }

    const slug = payload.data.slug.toLowerCase();
    const existingOrg = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);

    if (existingOrg.length > 0) {
      return c.json({ message: "Slug already in use." }, 409);
    }

    const file =
      typeof File !== "undefined" && logo instanceof File ? logo : null;
    let logoUrl: string | null = null;

    if (file) {
      const type = file.type?.toLowerCase() ?? "";
      if (!["image/png", "image/jpeg"].includes(type)) {
        return c.json({ message: "Logo must be PNG or JPG." }, 400);
      }
      if (file.size > 10 * 1024 * 1024) {
        return c.json({ message: "Logo file is too large." }, 413);
      }

      const ext = extname(file.name || "");
      const targetName = `org-${Date.now()}${ext}`;
      const targetPath = join(uploadDir, targetName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(targetPath, buffer);
      logoUrl = `/uploads/${targetName}`;
    }

    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(organizations)
        .values({
          name: payload.data.name,
          slug,
          logoUrl,
        })
        .returning({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          logoUrl: organizations.logoUrl,
        });

      const org = inserted[0];
      if (!org) {
        return null;
      }

      await tx.insert(organizationMembers).values({
        userId,
        organizationId: org.id,
        role: "owner",
      });

      await tx
        .update(users)
        .set({ lastOrganizationId: org.id })
        .where(eq(users.id, userId));

      return org;
    });

    if (!result) {
      return c.json({ message: "Organization creation failed." }, 500);
    }

    return c.json({ organization: result });
  });

  return app;
}
