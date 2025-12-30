import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";
import { jwt } from "hono/jwt";
import { SignJWT } from "jose";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import { users } from "./schema";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ status: "ok" }));

const registerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
});

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
    user: { id: userRecord.id, name: userRecord.name, email: userRecord.email },
  });
});

const jwtSecret = process.env.JWT_SECRET ?? "";

if (!jwtSecret) {
  app.get("/auth/me", (c) =>
    c.json({ message: "JWT_SECRET is not configured." }, 500),
  );
} else {
  app.get("/auth/me", jwt({ secret: jwtSecret, cookie: "auth_token" }), (c) => {
    const payload = c.get("jwtPayload");
    return c.json({ user: payload });
  });
}

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port });

console.log(`API listening on http://localhost:${port}`);
