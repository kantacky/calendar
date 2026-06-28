import type { EventType } from "./event-type";

export type Event = {
  date: string;
  type: EventType;
  name: string;
};
