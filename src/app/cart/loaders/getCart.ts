import type { CartResponseDTO } from '@/lib/zalia-giria/dto/CartResponseDTO.ts';
import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';

export async function getCart(): Promise<CartResponseDTO> {
    return zaliaGiriaClient.getCart();
}
