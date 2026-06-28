import { Hono } from "hono";
import { createHolidaysJpRepository } from "./repository";
import { createGetHolidaysInRangeUseCase } from "./usecase";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const holidaysHandler = new Hono();

holidaysHandler.get("/", async (c) => {
  const from = c.req.query("from");
  const to = c.req.query("to");

  if (!from || !DATE_PATTERN.test(from) || !to || !DATE_PATTERN.test(to)) {
    return c.json(
      {
        error: "query parameters `from` and `to` must be in YYYY-MM-DD format",
      },
      400,
    );
  }

  if (from > to) {
    return c.json({ error: "`from` must be less than or equal to `to`" }, 400);
  }

  const getHolidays = createGetHolidaysInRangeUseCase(
    createHolidaysJpRepository(),
  );
  const events = await getHolidays(from, to);

  return c.json({ events });
});
