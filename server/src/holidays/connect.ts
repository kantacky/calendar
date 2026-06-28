import {
  Code,
  ConnectError,
  type ConnectRouter,
  type ServiceImpl,
} from "@connectrpc/connect";
import {
  EventType,
  HolidaysService,
} from "../gen/kantacky_calendar/v1/holidays_pb.js";
import { createHolidaysJpRepository } from "./repository";
import { createGetHolidaysInRangeUseCase } from "./usecase";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const holidaysServiceImpl: ServiceImpl<typeof HolidaysService> = {
  async getHolidaysInRange(req) {
    if (!DATE_PATTERN.test(req.from) || !DATE_PATTERN.test(req.to)) {
      throw new ConnectError(
        "`from` and `to` must be in YYYY-MM-DD format",
        Code.InvalidArgument,
      );
    }
    if (req.from > req.to) {
      throw new ConnectError(
        "`from` must be less than or equal to `to`",
        Code.InvalidArgument,
      );
    }

    const getHolidays = createGetHolidaysInRangeUseCase(
      createHolidaysJpRepository(),
    );
    const events = await getHolidays(req.from, req.to);

    return {
      events: events.map((e) => ({
        date: e.date,
        name: e.name,
        type: EventType.HOLIDAY,
      })),
    };
  },
};

export const registerHolidaysService = (router: ConnectRouter) => {
  router.service(HolidaysService, holidaysServiceImpl);
};
