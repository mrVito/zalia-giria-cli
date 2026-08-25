import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';
import type { ActionState } from '@/lib/action/ActionState.ts';
import { ActionStatus } from '@/lib/action/ActionStatus.ts';
import type { AddToCartResponseDTO } from '@/lib/zalia-giria/dto/AddToCartResponseDTO.ts';

export async function addToCart(productId: string, quantity: number): Promise<ActionState<AddToCartResponseDTO>> {
    try {
        const result = await zaliaGiriaClient.addToCart(productId, quantity);

        if (result.status) {
            return {
                status: ActionStatus.Success,
                result: result,
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
