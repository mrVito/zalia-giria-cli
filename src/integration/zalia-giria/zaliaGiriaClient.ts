import { ZaliaGiriaClient } from '@/lib/zalia-giria/client/ZaliaGiriaClient.ts';
import { parameters } from '@/parameters.ts';
import { sessionManager } from '@/integration/session/sessionManager.ts';

export const zaliaGiriaClient = new ZaliaGiriaClient(sessionManager, parameters.rootUrl);
