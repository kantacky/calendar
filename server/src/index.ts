import { Hono } from "hono";
import { holidaysHandler } from "./holidays/handler";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/holidays", holidaysHandler);

export default app;
