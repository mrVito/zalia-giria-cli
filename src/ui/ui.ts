import { startLoader } from '@/ui/loader/startLoader.ts';
import { renderLogo } from '@/ui/logo/renderLogo.ts';
import { successMessage } from '@/ui/message/successMessage.ts';
import { select } from '@/ui/select/select.ts';
import { selectTable } from '@/ui/table/selectTable.ts';
import { errorMessage } from '@/ui/message/errorMessage.ts';
import { print } from '@/ui/print/print.ts';

export const ui = {
    errorMessage: errorMessage,
    print: print,
    renderLogo: renderLogo,
    select: select,
    selectTable: selectTable,
    startLoader: startLoader,
    successMessage: successMessage,
};
