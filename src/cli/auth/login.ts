import { sessionManager } from '@/integration/session/sessionManager.ts';
import { input, password } from '@inquirer/prompts';
import { ui } from '@/ui/ui.ts';
import { app } from '@/app/app.ts';
import { logout } from '@/cli/auth/logout.ts';

export async function login() {
    const username = await input({
        message: 'Username',
        required: true,
        validate: value => value.length > 0,
        default: sessionManager.session?.username,
    });

    const pass = await password({
        message: 'Password',
        validate: value => value.length > 0,
        mask: '*',
    });

    const loader = ui.startLoader('Signing-in');

    const result = await app.login(username, pass);

    if (result.status === 'fail') {
        loader.fail('Failed to login');

        await ui.select('What would you like to do next?', [
            { name: 'Try again', action: login },
            { name: 'Exit', action: app.exit },
        ]);
    }

    if (result.status === 'success') {
        loader.succeed(`Signed in as ${username}`);

        await ui.select('What would you like to do next?', [
            { name: 'Logout', action: logout },
            { name: 'Exit', action: app.exit },
        ]);
    }
}
