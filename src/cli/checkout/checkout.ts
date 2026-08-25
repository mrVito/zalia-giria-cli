import { app } from '@/app/app.ts';
import { ui } from '@/ui/ui.ts';
import { viewProducts } from '@/cli/product/viewProducts.ts';
import { logout } from '@/cli/auth/logout.ts';
import { viewCart } from '@/cli/cart/viewCart.ts';
import { menu } from '@/cli/menu.ts';
import { openUrl } from '@/lib/open-url/openUrl.ts';

export async function checkout() {
    const cart = await getCart();

    const address = await ui.selectTable(
        'Select the delivery address',
        [
            {
                header: 'Name',
                value: address => address.name,
            },
        ],
        cart.addresses.map(address => ({
            id: address.id,
            name: `${address.name} ${address.address}`,
        })),
    );

    const paymentMethod = await ui.selectTable(
        'Select the payment method',
        [
            {
                header: 'Name',
                value: address => address.name,
            },
        ],
        cart.paymentMethods.map(paymentMethod => ({
            id: paymentMethod.id,
            name: paymentMethod.name,
        })),
    );

    await ui.select('Would you like to proceed?', [
        { name: 'Proceed', action: () => finishCheckout(address.id, paymentMethod.id) },
        { name: 'Cancel', action: viewCart },
    ]);
}

async function finishCheckout(addressId: string, paymentMethodId: string) {
    const loader = ui.startLoader('Processing your order... This may take a minute');

    const result = await app.checkout(addressId, paymentMethodId);

    if (result.status === 'success') {
        loader.succeed('Checkout successful');

        ui.print('Finish the payment on a browser', 'green');
        ui.print(result.result.redirectUrl, 'white');

        openUrl(result.result.redirectUrl);

        await menu();
    }

    if (result.status === 'fail') {
        await ui.select('What would you like to do next?', [
            { name: 'Try again', action: checkout },
            { name: 'View products', action: viewProducts },
            { name: 'View cart', action: viewCart },
            { name: 'Logout', action: logout },
            { name: 'Exit', action: app.exit },
        ]);
    }
}

async function getCart() {
    const loader = ui.startLoader('Retrieving cart information...');

    const cart = await app.getCart();

    loader.succeed('Cart retrieved');

    return cart;
}
