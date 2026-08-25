import * as cheerio from 'cheerio';
import type { CartResponseDTO } from '@/lib/zalia-giria/dto/CartResponseDTO.ts';
import type { CartItemResponseDTO } from '@/lib/zalia-giria/dto/CartItemResponseDTO.ts';
import type { ProductListResponseDTO } from '@/lib/zalia-giria/dto/ProductListResponseDTO.ts';
import type { ProductResponseDTO } from '@/lib/zalia-giria/dto/ProductResponseDTO.ts';
import type { AddressResponseDTO } from '@/lib/zalia-giria/dto/AddressResponseDTO.ts';
import type { PaymentMethodResponseDTO } from '@/lib/zalia-giria/dto/PaymentMethodResponseDTO.ts';

export class ResponseParser {
    private static readonly PAYMENT_METHOD_NAMES: Record<string, string> = {
        '2': 'Swedbank',
        '3': 'SEB',
        '4': 'Danske Bank',
        '5': 'Luminor',
        '6': 'Citadele',
        '8': 'Šiaulių Bankas',
        '9': 'Medicinos Bankas',
        '11': 'LKU',
        '10': 'PaySera',
        '12': 'Debetinė/kreditinė kortelė',
    };

    parseCart(html: string): CartResponseDTO {
        const $ = cheerio.load(html);

        const items: CartItemResponseDTO[] = $('#special-cart-table tbody tr')
            .toArray()
            .map(row => {
                const $row = $(row);
                const cells = $row.find('> td');

                return {
                    id: cells.eq(6).find('i.removeProduct').attr('data-cart-product-id')?.trim() ?? '',
                    name: cells.eq(2).find('a').text().trim(),
                    price: this.parsePrice(cells.eq(4).find('strong')),
                    quantity: cells.eq(1).find('input.count').attr('value')?.trim() ?? '',
                    totalPrice: this.parsePrice(cells.eq(5).find('strong')),
                };
            });

        const grandTotal = this.parsePrice($('#grandTotalId'));
        const deliveryDate = $('#delivery-date-id').text().trim();

        const addresses: AddressResponseDTO[] = $('#subUsersInfoTable tbody tr')
            .toArray()
            .map(row => {
                const $row = $(row);
                const cells = $row.find('> td');

                return {
                    id: $row.find('input[name="rad"]').attr('value')?.trim() ?? '',
                    name: `${cells.eq(2).text().trim()} ${cells.eq(3).text().trim()}`.trim(),
                    address: [cells.eq(4), cells.eq(5), cells.eq(6), cells.eq(7)]
                        .map(cell => cell.text().trim())
                        .filter(Boolean)
                        .join(', '),
                };
            });

        const paymentMethods: PaymentMethodResponseDTO[] = $('input.paymentType')
            .toArray()
            .map(input => {
                const id = $(input).attr('value')?.trim() ?? '';

                return { id, name: ResponseParser.PAYMENT_METHOD_NAMES[id] ?? id };
            });

        return { items, grandTotal, deliveryDate, addresses, paymentMethods };
    }

    parseProducts(html: string): ProductListResponseDTO {
        const $ = cheerio.load(html);

        const products: ProductResponseDTO[] = $('.pl-item')
            .toArray()
            .map(item => {
                const $item = $(item);

                return {
                    id: $item.find('a.addToCart').attr('data-product-id')?.trim() ?? '',
                    name: $item.find('.cont > a.title').text().trim(),
                    price: this.parsePrice($item.find('.price-block .black-semi-color.bold')),
                };
            });

        return { products };
    }

    private parsePrice($el: cheerio.Cheerio<any>): string {
        const clone = $el.clone();

        const cents = clone.find('sup').text().trim();

        clone.find('sup').remove();

        const whole = clone.text().replace(/[^\d]/g, '');

        return `${whole}.${cents}€`;
    }
}
