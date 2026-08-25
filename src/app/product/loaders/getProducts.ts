import type { ProductListResponseDTO } from '@/lib/zalia-giria/dto/ProductListResponseDTO.ts';
import { zaliaGiriaClient } from '@/integration/zalia-giria/zaliaGiriaClient.ts';

export async function getProducts(): Promise<ProductListResponseDTO> {
    return zaliaGiriaClient.getProducts();
}
