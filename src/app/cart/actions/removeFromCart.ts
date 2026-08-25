import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';

export async function removeFromCart(cartProductId: string): Promise<ActionState> {
    try {
        await zaliaGiriaClient.removeFromCart(cartProductId);

        return {
            status: ActionStatus.Success,
            result: null,
        };
    } catch (error) {
        return {
            status: ActionStatus.Fail,
            error: error as Error,
        };
    }
}
