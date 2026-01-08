const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const rootDir = path.resolve(__dirname, "..");
const envTestPath = path.join(rootDir, ".env.test");
const envPath = path.join(rootDir, ".env");

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, "utf8");
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

  return true;
};

if (!loadEnvFile(envTestPath)) {
  loadEnvFile(envPath);
}

const databaseUrl = process.env.DATABASE_URL;
const testDbToken = process.env.TEST_DATABASE_NAME || "pms_test";

if (!databaseUrl) {
  console.error("DATABASE_URL is required for test migrations.");
  process.exit(1);
}

if (!databaseUrl.includes(testDbToken) && process.env.ALLOW_NON_TEST_DB !== "1") {
  console.error(
    `DATABASE_URL must include '${testDbToken}' for test migrations. Create apps/api/.env.test or set ALLOW_NON_TEST_DB=1 to override.`,
  );
  process.exit(1);
}

const result = spawnSync("drizzle-kit", ["migrate"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(typeof result.status === "number" ? result.status : 1);
