import { Hono } from "hono";
import { cors } from "hono/cors";
import { holidaysHandler } from "./holidays/handler";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return undefined;
      if (origin === "http://localhost:5173") return origin;
      if (/^https:\/\/([a-z0-9-]+\.)?kantacky-calendar-web\.[^/]+\.workers\.dev$/.test(origin)) {
        return origin;
      }
      if (/^https:\/\/([a-z0-9-]+\.)?calendar\.kantacky\.com$/.test(origin)) {
        return origin;
      }
      return undefined;
    },
  }),
);

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.route("/holidays", holidaysHandler);

export default app;
