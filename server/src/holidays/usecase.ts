import type { Event } from "../domain/event";
import { EventType } from "../domain/event-type";
import type { HolidaysRepository } from "./repository";

export type GetHolidaysInRangeUseCase = (
  from: string,
  to: string,
) => Promise<Event[]>;

export const createGetHolidaysInRangeUseCase = (
  repository: HolidaysRepository,
): GetHolidaysInRangeUseCase => {
  return async (from, to) => {
    const holidays = await repository.fetchAll();
    return Object.entries(holidays)
      .filter(([date]) => date >= from && date <= to)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, name]) => ({
        date,
        type: EventType.Holiday,
        name,
      }));
  };
};
