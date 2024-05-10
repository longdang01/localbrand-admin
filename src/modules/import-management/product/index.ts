import lazyLoad from '@/utils/loadable';

const ProductPage = lazyLoad(
    () => import('./views/Product'),
    (module) => module.default,
);

export { ProductPage };
