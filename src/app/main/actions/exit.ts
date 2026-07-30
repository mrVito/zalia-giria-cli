import { sessionManager } from '@/integration/session/sessionManager.ts';

export async function exit() {
    await sessionManager.write();
}
