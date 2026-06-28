import type { ConnectRouter } from "@connectrpc/connect";
import { registerHolidaysService } from "./holidays/connect";

export const registerServices = (router: ConnectRouter) => {
  registerHolidaysService(router);
};
