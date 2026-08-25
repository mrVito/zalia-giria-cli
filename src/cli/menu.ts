import { ui } from '@/ui/ui.ts';
import { viewCart } from '@/cli/cart/viewCart.ts';
import { logout } from '@/cli/auth/logout.ts';
import { app } from '@/app/app.ts';
import { viewProducts } from '@/cli/product/viewProducts.ts';

export async function menu() {
    await ui.select('What would you like to do next?', [
        { name: 'View products', action: viewProducts },
        { name: 'View cart', action: viewCart },
        { name: 'Logout', action: logout },
        { name: 'Exit', action: app.exit },
    ]);
}
