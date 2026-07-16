import { file, write } from 'bun';
import * as path from 'node:path';

export class SessionManager<TSession extends {}> {
    private _session: TSession | null = null;

    get session() {
        return this._session;
    }

    private get filepath() {
        return path.join(this.storageDir, 'session.json');
    }

    constructor(private readonly storageDir: string) {}

    update(updater: (prevSession: TSession | null) => TSession) {
        this._session = updater(this.session);
    }

    async load() {
        const sessionFile = file(this.filepath);
        const sessionContent = await sessionFile.text();

        this._session = JSON.parse(sessionContent);
    }

    async write() {
        await write(this.filepath, JSON.stringify(this._session));
    }
}
