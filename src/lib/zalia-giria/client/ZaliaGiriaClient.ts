import type { SessionManager } from '@/lib/session/SessionManager.ts';
import type { Session } from '@/lib/zalia-giria/model/Session.ts';
import type { LoginResponseDTO } from '@/lib/zalia-giria/dto/LoginResponseDTO.ts';
import { ResponseParser } from '@/lib/zalia-giria/parser/ResponseParser.ts';

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

    async getCart() {
        const response = await this.sendRequest('/prekiu-krepselis');

        if (!response.ok) {
            throw new Error('Failed to retrieve the cart');
        }

        const html = await this.parseText(response);

        if (html == null) {
            throw new Error('Failed to retrieve the cart');
        }

        return this.parser.parseCart(html);
    }

    private async parseText(response: Response): Promise<string | null> {
        try {
            return await response.text();
        } catch (error) {
            return null;
        }
    }
}
