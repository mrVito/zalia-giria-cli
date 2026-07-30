import { app } from '@/app/app.ts';
import { ui } from '@/ui/ui.ts';
import { login } from '@/cli/auth/login.ts';

export async function logout() {
    const loader = ui.startLoader('Signing out...');

    const result = await app.logout();

    if (result.status === 'success') {
        loader.succeed('You have signed out');

        await ui.select('What would you like to do next?', [
            { name: 'Login', action: login },
            { name: 'Exit', action: app.exit },
        ]);
    }

    if (result.status === 'fail') {
        ui.errorMessage('Failed to logout');

        await app.exit();
    }
}
