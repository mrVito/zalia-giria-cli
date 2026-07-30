import { SessionManager } from '@/lib/session/SessionManager.ts';
import { parameters } from '@/parameters.ts';
import type { Session } from '@/lib/zalia-giria/model/Session.ts';

export const sessionManager = new SessionManager<Session>(parameters.sessionStorageDir);
