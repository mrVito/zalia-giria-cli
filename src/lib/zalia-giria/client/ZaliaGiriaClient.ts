import type { SessionManager } from '@/lib/session/SessionManager.ts';
import type { Session } from '@/lib/zalia-giria/model/Session.ts';
import type { LoginResponseDTO } from '@/lib/zalia-giria/dto/LoginResponseDTO.ts';
import { ResponseParser } from '@/lib/zalia-giria/parser/ResponseParser.ts';
import dayjs from 'dayjs';
import type { CheckoutResponseDTO } from '@/lib/zalia-giria/dto/CheckoutResponseDTO.ts';
import type { DeliveryDatesResponseDTO } from '@/lib/zalia-giria/dto/DeliveryDatesResponseDTO.ts';
import type { AddToCartResponseDTO } from '@/lib/zalia-giria/dto/AddToCartResponseDTO.ts';
import type { CartResponseDTO } from '@/lib/zalia-giria/dto/CartResponseDTO.ts';
import type { ProductListResponseDTO } from '@/lib/zalia-giria/dto/ProductListResponseDTO.ts';

export class ZaliaGiriaClient {
    private readonly parser: ResponseParser;

    constructor(
        private readonly sessionManager: SessionManager<Session>,
        private readonly rootUrl: string,
    ) {
        this.parser = new ResponseParser();
    }

    async sendRequest(url: string, method: 'GET' | 'POST' = 'GET', body?: string): Promise<Response> {
        const headers: Record<string, string> = {};

        if (this.sessionManager.session != null) {
            headers.cookie = Object.entries(this.sessionManager.session.cookie)
                .map(c => c.join('='))
                .join('; ');
        }

        if (method == 'POST') {
            headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            headers['x-requested-with'] = 'XMLHttpRequest';
        }

        const response = await fetch(url.startsWith('https') ? url : `${this.rootUrl}${url}`, {
            redirect: 'manual',
            method,
            body,
            headers,
        });

        const cookies = response.headers.getSetCookie();

        this.sessionManager.update(prev => ({
            ...prev,
            cookie: {
                ...(prev?.cookie ?? {}),
                ...Object.fromEntries(cookies.map(cookie => cookie.split(';')[0]!.trim().split('='))),
            },
        }));

        if (response.status === 302) {
            const location = response.headers.get('location');
            const server = response.headers.get('server');

            if (location != null && server === 'nginx') {
                return this.sendRequest(location);
            }
        }

        return response;
    }

    async login(username: string, password: string): Promise<LoginResponseDTO> {
        const response = await this.sendRequest(
            `/user/login_check`,
            'POST',
            `_username=${username.trim()}&_password=${password.trim()}`,
        );

        const text = await this.parseText(response);

        if (text == null) {
            throw new Error('Unauthorized');
        }

        const signedIn = text.includes(username);

        if (signedIn) {
            return {
                username: username,
            };
        }

        throw new Error('Unauthorized');
    }

    async getCart(): Promise<CartResponseDTO> {
        const response = await this.sendRequest('/prekiu-krepselis');

        if (!response.ok) {
            throw new Error('Failed to retrieve the cart');
        }

        const html = await this.parseText(response);

        if (html == null) {
            throw new Error('Failed to retrieve the cart');
        }

        if (this.sessionManager.session != null) {
            this.sessionManager.session.cartUrl = response.url;
        }

        return this.parser.parseCart(html);
    }

    async getProducts(): Promise<ProductListResponseDTO> {
        const response = await this.sendRequest('/zalia-giria');

        if (!response.ok) {
            throw new Error('Failed to retrieve the products');
        }

        const html = await this.parseText(response);

        if (html == null) {
            throw new Error('Failed to retrieve the products');
        }

        return this.parser.parseProducts(html);
    }

    async addToCart(productId: string, quantity: number): Promise<AddToCartResponseDTO> {
        const response = await this.sendRequest(
            '/set_quantity_project/minimal',
            'POST',
            `product=${productId}&quantity=${quantity}&type=1&returnProductList=0&productHomeValue=0`,
        );

        if (!response.ok) {
            throw new Error('Failed to add to cart');
        }

        const result = await this.parseJson<AddToCartResponseDTO>(response);

        if (result == null) {
            throw new Error('Failed to add to cart');
        }

        return result;
    }

    async checkout(addressId: string, paymentMethodId: string): Promise<CheckoutResponseDTO> {
        const cartUrl = this.sessionManager.session?.cartUrl;

        if (cartUrl == null) {
            throw new Error('Cart URL not present');
        }

        const datesResponse = await this.sendRequest(`/schedule/getDelivereDaysOne?customer=${addressId}`);
        const dates = (await datesResponse.json()) as DeliveryDatesResponseDTO;

        const checkout = {
            rad: addressId,
            processAtDate: dates.minDate,
            createAtDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            oldOrder: '0',
            type: paymentMethodId,
            note: '',
            deliveryPhoneConfirmed: '1',
        };

        const data = new URLSearchParams(checkout);

        const response = await this.sendRequest(cartUrl, 'POST', String(data));

        if (response.status === 302) {
            return {
                redirectUrl: response.headers.get('location') ?? '',
            };
        }

        throw new Error('Failed to checkout');
    }

    async removeFromCart(cartProductId: string): Promise<void> {
        const response = await this.sendRequest('/remove_product_project', 'POST', `cartProductId=${cartProductId}`);

        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }
    }

    private async parseText(response: Response): Promise<string | null> {
        try {
            return await response.text();
        } catch (error) {
            return null;
        }
    }

    private async parseJson<T>(response: Response): Promise<T | null> {
        try {
            return (await response.json()) as T;
        } catch (error) {
            return null;
        }
    }
}
