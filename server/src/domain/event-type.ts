export const EventType = {
  Holiday: "holiday",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
