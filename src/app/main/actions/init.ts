import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';
import { sessionManager } from '@/integration/session/sessionManager.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';

export interface InitActionResult {
    username: string;
}

export async function init(): Promise<ActionState<InitActionResult>> {
    try {
        await sessionManager.load();
    } catch (error) {
        return {
            status: ActionStatus.Fail,
            error: error as Error,
        };
    }

    const username = sessionManager.session?.username;
    const response = await zaliaGiriaClient.sendRequest('/');

    if (username == null) {
        return {
            status: ActionStatus.Fail,
        };
    }

    try {
        const text = await response.text();

        const signedIn = text.includes(username);

        if (signedIn) {
            return {
                status: ActionStatus.Success,
                result: {
                    username: username,
                },
            };
        } else {
            return {
                status: ActionStatus.Fail,
            };
        }
    } catch (error) {
        return {
            status: ActionStatus.Fail,
            error: error as Error,
        };
    }
}
