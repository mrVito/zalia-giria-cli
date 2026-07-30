import { startLoader } from '@/ui/loader/startLoader.ts';
import { renderLogo } from '@/ui/logo/renderLogo.ts';
import { successMessage } from '@/ui/message/successMessage.ts';
import { select } from '@/ui/select/select.ts';
import { errorMessage } from '@/ui/message/errorMessage.ts';

export const ui = {
    errorMessage: errorMessage,
    renderLogo: renderLogo,
    select: select,
    startLoader: startLoader,
    successMessage: successMessage,
};
