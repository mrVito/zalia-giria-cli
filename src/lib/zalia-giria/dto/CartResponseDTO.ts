import type { CartItemResponseDTO } from '@/lib/zalia-giria/dto/CartItemResponseDTO.ts';
import type { AddressResponseDTO } from '@/lib/zalia-giria/dto/AddressResponseDTO.ts';
import type { PaymentMethodResponseDTO } from '@/lib/zalia-giria/dto/PaymentMethodResponseDTO.ts';

export interface CartResponseDTO {
    items: CartItemResponseDTO[];
    grandTotal: string;
    deliveryDate: string;
    addresses: AddressResponseDTO[];
    paymentMethods: PaymentMethodResponseDTO[];
}
