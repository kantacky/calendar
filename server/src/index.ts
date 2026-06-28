import { Hono } from "hono";
import { cors } from "hono/cors";
import { createFetchHandler } from "./connect-handler";
import { registerHolidaysService } from "./holidays/connect";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return undefined;
      if (origin === "http://localhost:5173") return origin;
      if (
        /^https:\/\/([a-z0-9-]+\.)?kantacky-calendar-web\.[^/]+\.workers\.dev$/.test(
          origin,
        )
      ) {
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

const connectHandler = createFetchHandler((router) => {
  registerHolidaysService(router);
});

app.all("/kantacky_calendar.v1.:service/:method", async (c) => {
  const res = await connectHandler(c.req.raw);
  if (!res) return c.notFound();
  return res;
});

export default app;
