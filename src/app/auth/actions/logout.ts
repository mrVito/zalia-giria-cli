import { sessionManager } from '@/integration/session/sessionManager.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';

export async function logout(): Promise<ActionState> {
    if (sessionManager.session != null) {
        sessionManager.session.cookie = {};

        return {
            status: ActionStatus.Success,
            result: null,
        };
    }

    return {
        status: ActionStatus.Fail,
    };
}
