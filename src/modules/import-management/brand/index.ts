import lazyLoad from '@/utils/loadable';

const BrandPage = lazyLoad(
    () => import('./Brand'),
    (module) => module.default,
);

export { BrandPage };
