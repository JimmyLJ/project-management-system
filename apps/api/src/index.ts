import "dotenv/config";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3000);

const app = createApp();
app.get("/uploads/*", serveStatic({ root: "./" }));
serve({ fetch: app.fetch, port });

console.log(`API listening on http://localhost:${port}`);
