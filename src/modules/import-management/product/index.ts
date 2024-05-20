import lazyLoad from '@/utils/loadable';

const ProductPage = lazyLoad(
    () => import('./Product'),
    (module) => module.default,
);

const ProductDetailPage = lazyLoad(
    () => import('./ProductDetail'),
    (module) => module.default,
);

export { ProductPage, ProductDetailPage };
