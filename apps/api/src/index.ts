import "dotenv/config";
import { serve } from "@hono/node-server";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3000);

const app = createApp();
serve({ fetch: app.fetch, port });

console.log(`API listening on http://localhost:${port}`);
