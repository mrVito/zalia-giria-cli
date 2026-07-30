import { app } from '@/app/app.ts';
import { ui } from '@/ui/ui.ts';
import { select } from '@/ui/select/select.ts';
import { login } from '@/cli/auth/login.ts';
import { menu } from '@/cli/menu.ts';

export async function root() {
    ui.renderLogo();

    const loader = ui.startLoader('Checking login state');

    const result = await app.init();

    if (result.status === 'fail') {
        loader.fail('Not signed in');

        await select('What would you like to do next?', [
            { name: 'Login', action: login },
            { name: 'Exit', action: app.exit },
        ]);
    }

    if (result.status === 'success') {
        loader.succeed(`Signed in as ${result.result.username}`);

        await menu();
    }
}
