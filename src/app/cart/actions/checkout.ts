import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';
import type { CheckoutResponseDTO } from '@/lib/zalia-giria/dto/CheckoutResponseDTO.ts';

export async function checkout(addressId: string, paymentMethodId: string): Promise<ActionState<CheckoutResponseDTO>> {
    try {
        const result = await zaliaGiriaClient.checkout(addressId, paymentMethodId);

        return {
            status: ActionStatus.Success,
            result: result,
        };
    } catch (error) {
        return {
            status: ActionStatus.Fail,
            error: error as Error,
        };
    }
}
