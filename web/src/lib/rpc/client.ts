import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { env } from '$env/dynamic/public';
import { HolidaysService } from '../gen/holiday/v1/service_pb';

const baseUrl = env.PUBLIC_API_BASE_URL ?? 'http://localhost:8787';

const transport = createConnectTransport({ baseUrl });

export const holidaysClient = createClient(HolidaysService, transport);
