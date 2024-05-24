import lazyLoad from '@/utils/loadable';

const OrderPage = lazyLoad(
    () => import('./Order'),
    (module) => module.default,
);

const OrderCreatePage = lazyLoad(
    () => import('./OrderCreate'),
    (module) => module.default,
);

const OrderEditPage = lazyLoad(
    () => import('./OrderEdit'),
    (module) => module.default,
);

export { OrderPage, OrderCreatePage, OrderEditPage };
