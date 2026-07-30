import type { CartItemResponseDTO } from '@/lib/zalia-giria/dto/CartItemResponseDTO.ts';

export interface CartResponseDTO {
    items: CartItemResponseDTO[];
    grandTotal: string;
    deliveryDate: string;
}
