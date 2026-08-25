import { app } from '@/app/app.ts';
import { printTable } from 'console-table-printer';
import { ui } from '@/ui/ui.ts';
import { logout } from '@/cli/auth/logout.ts';
import { checkout } from '@/cli/checkout/checkout.ts';
import { viewProducts } from '@/cli/product/viewProducts.ts';
import type { CartItemResponseDTO } from '@/lib/zalia-giria/dto/CartItemResponseDTO.ts';

export async function viewCart() {
    const loader = ui.startLoader('Retrieving cart...');

    const cart = await app.getCart();

    loader.succeed('Cart retrieved');

    if (cart.items.length === 0) {
        ui.print('-----------------');
        ui.print('The cart is empty');
        ui.print('-----------------');
    } else {
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
    }

    await ui.select('What would you like to do next?', [
        { name: 'Add products', action: viewProducts },
        ...(cart.items.length > 0
            ? [
                  { name: 'Remove products', action: () => removeProducts(cart.items) },
                  { name: 'Checkout', action: checkout },
              ]
            : []),
        { name: 'Logout', action: logout },
        { name: 'Exit', action: app.exit },
    ]);
}

async function removeProducts(cartItems: CartItemResponseDTO[]) {
    const item = await ui.selectTable(
        'Select the product to remove',
        [
            { header: 'Name', value: (item: CartItemResponseDTO) => item.name },
            { header: 'Quantity', value: (item: CartItemResponseDTO) => item.quantity },
            { header: 'Total', value: (item: CartItemResponseDTO) => item.totalPrice },
        ],
        cartItems,
    );

    await ui.select(`Remove "${item.name}" from the cart?`, [
        { name: 'Confirm', action: () => confirmRemoveFromCart(item.id) },
        { name: 'Cancel', action: viewCart },
    ]);
}

async function confirmRemoveFromCart(cartProductId: string) {
    const loader = ui.startLoader('Removing product from cart...');

    const result = await app.removeFromCart(cartProductId);

    if (result.status === 'success') {
        loader.succeed('Product removed from cart');
    } else {
        loader.fail('Failed to remove product from cart');
    }

    await viewCart();
}
