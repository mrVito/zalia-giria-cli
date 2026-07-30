import * as cheerio from 'cheerio';
import type { CartResponseDTO } from '@/lib/zalia-giria/dto/CartResponseDTO.ts';
import type { CartItemResponseDTO } from '@/lib/zalia-giria/dto/CartItemResponseDTO.ts';

export class ResponseParser {
    parseCart(html: string): CartResponseDTO {
        const $ = cheerio.load(html);

        const items: CartItemResponseDTO[] = $('#special-cart-table tbody tr')
            .toArray()
            .map(row => {
                const $row = $(row);
                const cells = $row.find('> td');

                return {
                    name: cells.eq(2).find('a').text().trim(),
                    price: this.parsePrice(cells.eq(4).find('strong')),
                    quantity: cells.eq(1).find('input.count').attr('value')?.trim() ?? '',
                    totalPrice: this.parsePrice(cells.eq(5).find('strong')),
                };
            });

        const grandTotal = this.parsePrice($('#grandTotalId'));
        const deliveryDate = $('#delivery-date-id').text().trim();

        return { items, grandTotal, deliveryDate };
    }

    private parsePrice($el: cheerio.Cheerio<any>): string {
        const clone = $el.clone();

        const cents = clone.find('sup').text().trim();

        clone.find('sup').remove();

        const whole = clone.text().replace(/[^\d]/g, '');

        return `${whole}.${cents}€`;
    }
}
