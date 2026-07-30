import { sessionManager } from '@/integration/session/sessionManager.ts';
import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';

export async function login(username: string, password: string): Promise<ActionState> {
    try {
        const result = await zaliaGiriaClient.login(username, password);

        if (sessionManager.session != null) {
            sessionManager.session.username = result.username;

            return {
                status: ActionStatus.Success,
                result: null,
            };
        }

        return {
            status: ActionStatus.Fail,
        };
    } catch (error) {
        return {
            status: ActionStatus.Fail,
            error: error as Error,
        };
    }
}
