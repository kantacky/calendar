import { createConnectRouter, type ConnectRouter } from "@connectrpc/connect";
import {
  universalServerRequestFromFetch,
  universalServerResponseToFetch,
} from "@connectrpc/connect/protocol";

export const createFetchHandler = (
  register: (router: ConnectRouter) => void,
  options: { prefix?: string } = {},
) => {
  const router = createConnectRouter();
  register(router);
  const prefix = options.prefix ?? "";
  const byPath = new Map(
    router.handlers.map((h) => [`${prefix}${h.requestPath}`, h]),
  );

  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url);
    const handler = byPath.get(url.pathname);
    if (!handler) return null;
    const uReq = universalServerRequestFromFetch(request, {});
    const uRes = await handler(uReq);
    return universalServerResponseToFetch(uRes);
  };
};
