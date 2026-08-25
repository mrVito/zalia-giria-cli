export interface Session {
    username?: string;
    cartUrl?: string;
    cookie: Record<string, string>;
}
