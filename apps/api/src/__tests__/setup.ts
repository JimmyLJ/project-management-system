import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const envTestPath = path.join(rootDir, ".env.test");
const envPath = path.join(rootDir, ".env");

const loadEnvFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }
    const index = trimmed.indexOf("=");
    if (index === -1) {
      return;
    }
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

if (existsSync(envTestPath)) {
  loadEnvFile(envTestPath);
} else {
  loadEnvFile(envPath);
}

const databaseUrl = process.env.DATABASE_URL;
const testDbToken = process.env.TEST_DATABASE_NAME ?? "pms_test";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for tests.");
}

if (!databaseUrl.includes(testDbToken) && process.env.ALLOW_NON_TEST_DB !== "1") {
  throw new Error(
    `DATABASE_URL must include '${testDbToken}' for tests. Create apps/api/.env.test or set ALLOW_NON_TEST_DB=1 to override.`,
  );
}
