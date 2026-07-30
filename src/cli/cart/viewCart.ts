import { app } from '@/app/app.ts';
import { printTable } from 'console-table-printer';
import { ui } from '@/ui/ui.ts';
import { logout } from '@/cli/auth/logout.ts';
import { checkout } from '@/cli/checkout/checkout.ts';

export async function viewCart() {
    const loader = ui.startLoader('Retrieving cart...');

    const cart = await app.getCart();

    loader.succeed('Cart retrieved');

    printTable([
        ...cart.items.map(item => ({
            Name: item.name,
            Price: item.price,
            Quantity: item.quantity,
            Total: item.totalPrice,
        })),
        { Total: cart.grandTotal },
    ]);

    ui.print(`Delivery date: ${cart.deliveryDate}`);

    await ui.select('What would you like to do next?', [
        { name: 'Checkout', action: checkout },
        { name: 'Logout', action: logout },
        { name: 'Exit', action: app.exit },
    ]);
}
