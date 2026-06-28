import { Hono } from "hono";
import { cors } from "hono/cors";
import { createFetchHandler } from "./connect-handler";
import { registerServices } from "./services";

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

const connectHandler = createFetchHandler(registerServices);

app.all("*", async (c, next) => {
  const res = await connectHandler(c.req.raw);
  if (res) return res;
  await next();
});

export default app;
