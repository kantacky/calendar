export type HolidaysMap = Record<string, string>;

export type HolidaysRepository = {
  fetchAll: () => Promise<HolidaysMap>;
};

const ENDPOINT = "https://holidays-jp.github.io/api/v1/date.json";

export const createHolidaysJpRepository = (): HolidaysRepository => ({
  fetchAll: async () => {
    const res = await fetch(ENDPOINT);
    if (!res.ok) {
      throw new Error(`Failed to fetch holidays: ${res.status}`);
    }
    return (await res.json()) as HolidaysMap;
  },
});
