import { app } from '@/app/app.ts';
import { ui } from '@/ui/ui.ts';
import { logout } from '@/cli/auth/logout.ts';
import { viewCart } from '@/cli/cart/viewCart.ts';
import type { ProductResponseDTO } from '@/lib/zalia-giria/dto/ProductResponseDTO.ts';
import { input } from '@inquirer/prompts';
import { menu } from '@/cli/menu.ts';

export async function viewProducts() {
    const loader = ui.startLoader('Loading products...');

    const result = await app.getProducts();

    loader.succeed('Products loaded');

    await renderProducts(result.products);
}

async function renderProducts(products: ProductResponseDTO[]) {
    const selected = await ui.selectTable<ProductResponseDTO>(
        'Select a product',
        [
            { header: 'Name', value: product => product.name },
            { header: 'Price', value: product => product.price },
        ],
        products,
    );

    await ui.select(`Product "${selected.name}" is selected. What's next?`, [
        { name: 'Add to cart', action: () => addToCart(selected, products) },
        { name: 'Go back', action: () => renderProducts(products) },
        { name: 'Return to menu', action: menu },
    ]);
}

async function addToCart(product: ProductResponseDTO, products: ProductResponseDTO[]) {
    const quantity = await input({
        message: 'Quantity',
        required: true,
        default: '1',
        validate: (value: string) => (Number.isNaN(Number(value)) ? 'Must be a valid number' : true),
    });

    const loader = ui.startLoader('Adding product to cart...');

    const result = await app.addToCart(product.id, Number(quantity));

    if (result.status === 'success') {
        loader.succeed(`Added ${result.result.quantity} items to cart`);

        await ui.select('What would you like to do next?', [
            { name: 'View products', action: () => renderProducts(products) },
            { name: 'View cart', action: viewCart },
            { name: 'Logout', action: logout },
            { name: 'Exit', action: app.exit },
        ]);
    }

    if (result.status === 'fail') {
        loader.fail(`Failed to add the item to cart`);

        await ui.select('What would you like to do next?', [
            { name: 'View products', action: () => renderProducts(products) },
            { name: 'View cart', action: viewCart },
            { name: 'Logout', action: logout },
            { name: 'Exit', action: app.exit },
        ]);
    }
}
