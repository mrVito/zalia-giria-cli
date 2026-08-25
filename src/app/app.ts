import { init } from '@/app/main/actions/init.ts';
import { exit } from '@/app/main/actions/exit.ts';
import { login } from '@/app/auth/actions/login.ts';
import { logout } from '@/app/auth/actions/logout.ts';
import { getCart } from '@/app/cart/loaders/getCart.ts';
import { addToCart } from '@/app/cart/actions/addToCart.ts';
import { checkout } from '@/app/cart/actions/checkout.ts';
import { getProducts } from '@/app/product/loaders/getProducts.ts';

export const app = {
    addToCart: addToCart,
    checkout: checkout,
    init: init,
    exit: exit,
    getCart: getCart,
    getProducts: getProducts,
    login: login,
    logout: logout,
};
