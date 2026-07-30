import { init } from '@/app/main/actions/init.ts';
import { exit } from '@/app/main/actions/exit.ts';
import { login } from '@/app/auth/actions/login.ts';
import { logout } from '@/app/auth/actions/logout.ts';

export const app = {
    init: init,
    exit: exit,
    login: login,
    logout: logout,
};
